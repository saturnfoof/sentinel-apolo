const db = require("../../database/db");
const { generateCaseId } = require("../../utils/modlogs");
const emojis = require("../../config/emojis");

module.exports = {
  name: "note",
  async execute(message, args) {
    if (!message.member.permissions.has("KickMembers")) {
      return message.reply(`${emojis.errado} Você não tem permissão para usar esse comando.`);
    }

    const userId = args[0]?.replace(/[<@!>]/g, "");
    const noteContent = args.slice(1).join(" ");
    if (!userId || !noteContent) {
      return message.reply(`${emojis.errado} Use: \`s!note <usuário> <nota>\``);
    }

    const user = await message.guild.members.fetch(userId).catch(() => null);
    if (!user) return message.reply(`${emojis.errado} Usuário não encontrado.`);

    const caseId = generateCaseId();
    const date = new Date().toISOString();

    db.run(`INSERT INTO modlogs (case_id, guild_id, user_id, user_tag, moderator_id, moderator_tag, type, reason, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caseId,
        message.guild.id,
        user.id,
        user.user?.tag || user.tag || "Desconhecido",
        message.author.id,
        message.author.tag,
        "Nota",
        noteContent,
        date
      ], (err) => {
        if (err) {
          console.error(err);
          return message.reply(`${emojis.errado} Erro ao adicionar a nota.`);
        }

        message.reply(`${emojis.certo} Nota registrada para ${user.user?.tag || user.tag}.`);
      });
  }
};
