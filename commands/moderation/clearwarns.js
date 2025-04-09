const db = require("../../database/db");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "clearwarns",
  async execute(message, args, client) {
    if (!message.member.permissions.has("KickMembers")) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Você não tem permissão para usar esse comando.");
    }

    const userId = args[0]?.replace(/[<@!>]/g, "");
    if (!userId) return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Mencione um usuário ou forneça o ID.");

    const user = await message.guild.members.fetch(userId).catch(() => null);
    if (!user) return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Usuário não encontrado.");

    const caseId = args[1];

    if (caseId) {
      // Limpar aviso específico com base no case_id
      db.get(
        `SELECT * FROM modlogs WHERE case_id = ? AND user_id = ? AND guild_id = ? AND type = 'WARN'`,
        [caseId, user.id, message.guild.id],
        (err, logRow) => {
          if (err) {
            console.error(err);
            return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Erro ao acessar o banco de dados.");
          }

          if (!logRow) {
            return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Nenhum aviso com esse ID foi encontrado para este usuário.");
          }

          db.run(
            `DELETE FROM warns WHERE user_id = ? AND guild_id = ? AND reason = ? AND moderator = ? AND date = ?`,
            [user.id, message.guild.id, logRow.reason, logRow.moderator_tag, logRow.date],
            function (err) {
              if (err) {
                console.error(err);
                return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Erro ao apagar o aviso.");
              }

              db.run(`DELETE FROM modlogs WHERE case_id = ?`, [caseId]);
              message.channel.send(`O aviso com ID \`${caseId}\` de ${user} foi apagado com sucesso.`);
            }
          );
        }
      );
    } else {
      // Limpar todos os avisos
      db.run(
        `DELETE FROM warns WHERE user_id = ? AND guild_id = ?`,
        [user.id, message.guild.id],
        function (err) {
          if (err) {
            console.error(err);
            return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Erro ao limpar os avisos.");
          }

          db.run(
            `DELETE FROM modlogs WHERE user_id = ? AND guild_id = ? AND type = 'WARN'`,
            [user.id, message.guild.id]
          );

          message.channel.send(`Todos os avisos de ${user} foram apagados com sucesso.`);
        }
      );
    }
  }
};
