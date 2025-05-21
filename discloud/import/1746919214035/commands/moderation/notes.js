const { EmbedBuilder } = require("discord.js");
const db = require("../../database/db");
const emojis = require("../../config/emojis");

module.exports = {
  name: "notes",
  async execute(message, args, client) {
    const userArg = args[0];
    if (!userArg) {
      return message.reply(`${emojis.errado} Mencione um usuário ou forneça um ID.`);
    }

    let user;
    try {
      user = message.mentions.users.first() || await client.users.fetch(userArg);
    } catch {
      return message.reply(`${emojis.errado} Usuário não encontrado.`);
    }

    db.all(
      `SELECT * FROM modlogs WHERE user_id = ? AND guild_id = ? AND type = ? ORDER BY date DESC`,
      [user.id, message.guild.id, "Nota"],
      (err, rows) => {
        if (err) {
          console.error(err);
          return message.reply(`${emojis.errado} Erro ao acessar o banco de dados.`);
        }

        if (!rows.length) {
          return message.reply(`${emojis.errado} Esse usuário não possui nenhuma nota.`);
        }

        const embed = new EmbedBuilder()
          .setTitle(`${emojis.lista} Notas de ${user.tag}`)
          .setColor("Yellow")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: `Total: ${rows.length} nota(s)` })
          .setTimestamp();

        rows.forEach((note, index) => {
          embed.addFields({
            name: `Nota #${index + 1}`,
            value: `**Staff:** <@${note.moderator_id}>  |  <t:${Math.floor(new Date(note.date).getTime() / 1000)}:R>\n${emojis.caderno} **Motivo:** ${note.reason}`,
            inline: false
          });
        });

        message.channel.send({ embeds: [embed] });
      }
    );
  }
};
