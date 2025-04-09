const db = require("../../database/db");
const emojis = require("../../config/emojis");

module.exports = {
  name: "track",
  aliases: ["watch", "vigilancia"],
  async execute(message, args) {
    if (!message.member.permissions.has("KickMembers")) {
      return message.reply(`${emojis.errado} Você não tem permissão para usar este comando.`);
    }

    const subcomando = ["remove", "delete", "motivo", "list"].includes(args[0]?.toLowerCase()) ? args[0].toLowerCase() : null;
    const userArg = subcomando && subcomando !== "list" ? args[1] : args[0];
    const userId = userArg?.replace(/[<@!>]/g, "");
    const date = new Date().toISOString();

    // 🔹 LISTAR usuários vigiados com paginação
    if (subcomando === "list") {
      db.all(`SELECT * FROM watchlist WHERE guild_id = ?`, [message.guild.id], async (err, rows) => {
        if (err) {
          console.error(err);
          return message.reply(`${emojis.errado} Erro ao buscar a lista de vigilância.`);
        }

        if (!rows || rows.length === 0) {
          return message.reply(`${emojis.info} Nenhum usuário está sendo vigiado neste servidor.`);
        }

        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
        const itemsPerPage = 5;
        let page = 0;

        const generateEmbed = (start) => {
          const current = rows.slice(start, start + itemsPerPage);
          const embed = new EmbedBuilder()
            .setTitle(`${emojis.lista} Lista de usuários vigiados`)
            .setColor("Yellow")
            .setFooter({ text: `Página ${page + 1} de ${Math.ceil(rows.length / itemsPerPage)}` })
            .setTimestamp();

          for (const row of current) {
            const dataFormatada = new Date(row.date).toLocaleDateString("pt-BR");
            embed.addFields({
              name: `${row.user_tag}`,
              value: `${emojis.caderno} **Motivo:** ${row.reason}\n${emojis.escudo} **Por:** ${row.added_by}\n${emojis.tempo} **Data:** ${dataFormatada}`,
              inline: false
            });
          }

          return embed;
        };

        const prevBtn = new ButtonBuilder().setCustomId("prev").setLabel("⬅️").setStyle(ButtonStyle.Secondary);
        const nextBtn = new ButtonBuilder().setCustomId("next").setLabel("➡️").setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(prevBtn, nextBtn);

        const msg = await message.reply({ embeds: [generateEmbed(0)], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 60000 });

        collector.on("collect", interaction => {
          if (interaction.user.id !== message.author.id) return interaction.reply({ content: "Apenas quem executou o comando pode usar os botões.", ephemeral: true });

          interaction.deferUpdate();
          if (interaction.customId === "prev" && page > 0) page--;
          else if (interaction.customId === "next" && (page + 1) * itemsPerPage < rows.length) page++;

          msg.edit({ embeds: [generateEmbed(page * itemsPerPage)], components: [row] });
        });

        collector.on("end", () => {
          msg.edit({ components: [] });
        });
      });
      return;
    }

    if (!userId && subcomando !== "list") {
      return message.reply(`${emojis.errado} Mencione um usuário ou forneça o ID.`);
    }

    const user = await message.client.users.fetch(userId).catch(() => null);
    if (!user && subcomando !== "list") {
      return message.reply(`${emojis.errado} Usuário não encontrado.`);
    }

    // 🔹 REMOVER da watchlist
    if (subcomando === "remove" || subcomando === "delete") {
      db.run(`DELETE FROM watchlist WHERE user_id = ? AND guild_id = ?`,
        [user.id, message.guild.id],
        function (err) {
          if (err) {
            console.error(err);
            return message.reply(`${emojis.errado} Erro ao remover da lista de vigilância.`);
          }

          if (this.changes === 0) {
            return message.reply(`${emojis.errado} Este usuário não está na lista de vigilância.`);
          }

          return message.reply(`${emojis.certo} ${user.tag} foi removido da lista de vigilância.`);
        }
      );
      return;
    }

    // 🔹 ATUALIZAR MOTIVO
    if (subcomando === "motivo") {
      const novoMotivo = args.slice(2).join(" ");
      if (!novoMotivo) {
        return message.reply(`${emojis.errado} Forneça um novo motivo.`);
      }

      db.run(`UPDATE watchlist SET reason = ? WHERE user_id = ? AND guild_id = ?`,
        [novoMotivo, user.id, message.guild.id],
        function (err) {
          if (err) {
            console.error(err);
            return message.reply(`${emojis.errado} Erro ao atualizar o motivo.`);
          }

          if (this.changes === 0) {
            return message.reply(`${emojis.errado} Este usuário não está na lista de vigilância.`);
          }

          return message.reply(`${emojis.certo} Motivo atualizado para ${user.tag}.`);
        }
      );
      return;
    }

    // 🔹 ADICIONAR à watchlist
    const motivo = args.slice(1).join(" ");
    if (!motivo) {
      return message.reply(`${emojis.errado} Use: \`s!track <usuário> <motivo>\``);
    }

    db.get(`SELECT * FROM watchlist WHERE user_id = ? AND guild_id = ?`, [user.id, message.guild.id], (err, row) => {
      if (err) {
        console.error(err);
        return message.reply(`${emojis.errado} Erro ao acessar o banco de dados.`);
      }

      if (row) {
        return message.reply(`${emojis.errado} Este usuário já está sendo vigiado.`);
      }

      db.run(`INSERT INTO watchlist (guild_id, user_id, user_tag, reason, added_by, date) VALUES (?, ?, ?, ?, ?, ?)`,
        [message.guild.id, user.id, user.tag, motivo, message.author.tag, date],
        (err) => {
          if (err) {
            console.error(err);
            return message.reply(`${emojis.errado} Erro ao adicionar à lista de vigilância.`);
          }

          return message.reply(`${emojis.certo} ${user.tag} foi adicionado à lista de vigilância.`);
        });
    });
  }
};
