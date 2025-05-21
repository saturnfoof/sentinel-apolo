const { PermissionsBitField } = require("discord.js");
const db = require("../../database/db");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "editwarn",
  async execute(message, args, client) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply(`${emojis.errado} Você não tem permissão para editar warns.`);
    }

    const userId = args[0]?.replace(/[<@!>]/g, "");
    if (!userId) return message.reply(`${emojis.errado} Mencione o usuário ou forneça o ID.`);

    const user = await message.guild.members.fetch(userId).catch(() => null);
    if (!user) return message.reply(`${emojis.errado} Usuário não encontrado.`);

    const warnId = parseInt(args[1]);
    if (isNaN(warnId)) return message.reply(`${emojis.errado} ID do warn inválido. Exemplo: \`s!editwarn @usuário 1 Novo motivo aqui\``);

    const newReason = args.slice(2).join(" ");
    if (!newReason) return message.reply(`${emojis.errado} Forneça o novo motivo.`);

    db.all(`SELECT * FROM warns WHERE user_id = ? AND guild_id = ?`, [user.id, message.guild.id], async (err, rows) => {
      if (err) {
        console.error(err);
        return message.reply(`${emojis.errado} Erro ao acessar o banco de dados.`);
      }

      if (!rows.length) {
        return message.reply(`${emojis.errado} Esse usuário não possui nenhum warn.`);
      }

      const warn = rows[warnId - 1];
      if (!warn) return message.reply(`${emojis.errado} Não existe warn de ID \`${warnId}\` para este usuário.`);

      db.run(`UPDATE warns SET reason = ? WHERE id = ?`, [newReason, warn.id], (err) => {
        if (err) {
          console.error(err);
          return message.reply(`${emojis.errado} Erro ao atualizar o warn.`);
        }

        message.reply(`O **Warn #${warnId}** do usuário ${user} foi atualizado para: "**${newReason}**" com sucesso!`);
      });
    });
  }
};
