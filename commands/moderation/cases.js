const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("../../database/db");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "cases",
  async execute(message, args, client) {
    const userArg = args[0];
    if (!userArg) {
      return message.reply(`${emojis.errado} Mencione o usuário ou forneça o ID.`);
    }

    let user;
    try {
      if (message.mentions.users.first()) {
        user = message.mentions.users.first();
      } else {
        user = await client.users.fetch(userArg);
      }
    } catch (err) {
      return message.reply(`${emojis.errado} Não foi possível encontrar esse usuário.`);
    }

    db.all(
      `SELECT * FROM modlogs WHERE user_id = ? AND guild_id = ? ORDER BY date DESC`,
      [user.id, message.guild.id],
      async (err, rows) => {
        if (err) {
          console.error(err);
          return message.reply(`${emojis.errado} Erro ao acessar os dados.`);
        }

        if (!rows.length) return message.reply(`${emojis.errado} Esse usuário não possui punições registradas.`);

        const pages = [];
        const chunkSize = 5;

        for (let i = 0; i < rows.length; i += chunkSize) {
          const current = rows.slice(i, i + chunkSize);
          const embed = new EmbedBuilder()
            .setTitle(`${emojis.escudo} Histórico de Punições - ${user.tag}`)
            .setColor(0xFEE65C)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Página ${Math.floor(i / chunkSize) + 1} | Total: ${rows.length} punição(ões)` })
            .setTimestamp();

          current.forEach((log) => {
            const dataFormatada = `<t:${Math.floor(new Date(log.date).getTime() / 1000)}:f>`;
            embed.addFields({
              name: `Caso #${log.case_id}`,
              value: `**Tipo:** ${log.type}\n**Staff:** <@${log.moderator_id}>\n${emojis.caderno} **Motivo:** ${log.reason}\n<:gray_tempo:1358519332384276551> **Data:** ${dataFormatada}`,
              inline: false
            });
          });

          pages.push(embed);
        }

        let currentPage = 0;

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("⬅️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("➡️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(pages.length <= 1)
        );

        const msg = await message.channel.send({ embeds: [pages[currentPage]], components: [row] });

        const collector = msg.createMessageComponentCollector({
          filter: (i) => i.user.id === message.author.id,
          time: 60000
        });

        collector.on("collect", async (i) => {
          if (i.customId === "previous") currentPage--;
          if (i.customId === "next") currentPage++;

          await i.update({
            embeds: [pages[currentPage]],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("previous")
                  .setLabel("⬅️")
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(currentPage === 0),
                new ButtonBuilder()
                  .setCustomId("next")
                  .setLabel("➡️")
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(currentPage === pages.length - 1)
              )
            ]
          });
        });

        collector.on("end", async () => {
          msg.edit({ components: [] }).catch(() => {});
        });
      }
    );
  }
};
