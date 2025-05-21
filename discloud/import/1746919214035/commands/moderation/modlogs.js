const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("../../database/db");
const emojis = require("../../config/emojis");

module.exports = {
  name: "modlogs",
  async execute(message, args) {
    if (!message.member.permissions.has("KickMembers")) {
      return message.reply(`${emojis.errado} Você não tem permissão para usar este comando.`);
    }

    const userId = args[0]?.replace(/[<@!>]/g, "");
    if (!userId) return message.reply(`${emojis.errado} Mencione um usuário ou forneça o ID.`);

    const user = await message.client.users.fetch(userId).catch(() => null);
    if (!user) return message.reply(`${emojis.errado} Usuário não encontrado.`);

    db.all(
      `SELECT * FROM modlogs WHERE guild_id = ? AND user_id = ? ORDER BY date DESC`,
      [message.guild.id, user.id],
      async (err, rows) => {
        if (err) {
          console.error(err);
          return message.reply(`${emojis.errado} Erro ao acessar o banco de dados.`);
        }

        if (!rows || rows.length === 0) {
          return message.reply(`${emojis.errado} Esse usuário não possui registros de moderação.`);
        }

        const pageSize = 5;
        let currentPage = 0;
        const totalPages = Math.ceil(rows.length / pageSize);

        const generateEmbed = (page) => {
          const start = page * pageSize;
          const currentLogs = rows.slice(start, start + pageSize);

          const embed = new EmbedBuilder()
            .setTitle(`${emojis.lista} Histórico de moderação de ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor("Orange")
            .setFooter({ text: `Página ${page + 1} de ${totalPages}` });

          for (const row of currentLogs) {
            embed.addFields({
              name: `Caso ${row.case_id} - ${row.type?.toUpperCase() || "AÇÃO"}`,
              value: `${emojis.escudo} Moderador: \`${row.moderator_tag}\`\n${emojis.caderno} Motivo: \`${row.reason}\`\n${emojis.tempo} <t:${Math.floor(new Date(row.date).getTime() / 1000)}:f>`,
            });
          }

          return embed;
        };

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("◀️ Anterior")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Próximo ▶️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(totalPages <= 1)
        );

        const reply = await message.reply({
          embeds: [generateEmbed(currentPage)],
          components: [row],
          allowedMentions: { repliedUser: false }
        });

        const collector = reply.createMessageComponentCollector({ time: 60000 });

        collector.on("collect", (interaction) => {
          if (interaction.user.id !== message.author.id) {
            return interaction.reply({ content: "Você não pode usar esses botões.", ephemeral: true });
          }

          if (interaction.customId === "prev") {
            currentPage--;
          } else if (interaction.customId === "next") {
            currentPage++;
          }

          row.components[0].setDisabled(currentPage === 0);
          row.components[1].setDisabled(currentPage >= totalPages - 1);

          interaction.update({
            embeds: [generateEmbed(currentPage)],
            components: [row]
          });
        });

        collector.on("end", () => {
          row.components.forEach((btn) => btn.setDisabled(true));
          reply.edit({ components: [row] }).catch(() => {});
        });
      }
    );
  }
};
