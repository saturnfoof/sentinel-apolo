const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("../../database/db");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "warns",
  async execute(message, args, client) {
    const userArg = args[0];
    if (!userArg) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Mencione o usuário ou forneça o ID.");
    }

    let user;
    try {
      if (message.mentions.users.first()) {
        user = message.mentions.users.first();
      } else {
        user = await client.users.fetch(userArg);
      }
    } catch (err) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Não foi possível encontrar esse usuário.");
    }

    // JOIN entre warns e modlogs para pegar o case_id
    db.all(
      `SELECT w.*, m.case_id FROM warns w
       INNER JOIN modlogs m ON
         w.user_id = m.user_id AND
         w.guild_id = m.guild_id AND
         w.reason = m.reason AND
         w.date = m.date AND
         m.type = 'WARN'
       WHERE w.user_id = ? AND w.guild_id = ?`,
      [user.id, message.guild.id],
      async (err, rows) => {
        if (err) {
          console.error(err);
          return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Erro ao acessar o banco de dados.");
        }

        if (!rows.length) {
          return message.reply("Esse usuário não possui nenhum warn.");
        }

        const pageSize = 5;
        let page = 0;

        const generateEmbed = (page) => {
          const start = page * pageSize;
          const end = start + pageSize;
          const currentWarns = rows.slice(start, end);

          const embed = new EmbedBuilder()
            .setTitle(`<:Icon_Timeout:1358194363619999887> Lista de Warns - ${user.tag}`)
            .setColor(0xFFA500)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Página ${page + 1}/${Math.ceil(rows.length / pageSize)} • Total: ${rows.length} warn(s)` })
            .setTimestamp();

          currentWarns.forEach((warn, index) => {
            const timestamp = Math.floor(new Date(warn.date).getTime() / 1000);
            embed.addFields({
              name: `Warn #${start + index + 1} • ID: \`${warn.case_id}\``,
              value: `**Motivo:** ${warn.reason}\n<:gray_tempo:1358519332384276551> **Data:** <t:${timestamp}:f>`,
              inline: false
            });
          });

          return embed;
        };

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("prev").setLabel("⬅️").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("next").setLabel("➡️").setStyle(ButtonStyle.Secondary)
        );

        const msg = await message.channel.send({
          embeds: [generateEmbed(page)],
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({
          filter: (i) => i.user.id === message.author.id,
          time: 60000
        });

        collector.on("collect", (i) => {
          i.deferUpdate();
          if (i.customId === "prev") {
            page = page > 0 ? page - 1 : page;
          } else if (i.customId === "next") {
            page = page < Math.ceil(rows.length / pageSize) - 1 ? page + 1 : page;
          }

          msg.edit({
            embeds: [generateEmbed(page)],
            components: [row]
          });
        });

        collector.on("end", () => {
          msg.edit({ components: [] }).catch(() => {});
        });
      }
    );
  }
};
