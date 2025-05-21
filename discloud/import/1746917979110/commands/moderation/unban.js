const db = require("../../database/db");
const { generateCaseId } = require("../../utils/modlogs.js");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "unban",
  async execute(message, args, client) {

    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Você não tem permissão para desbanir membros.");
    }

    const userId = args[0];
    if (!userId) return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Forneça o ID do usuário.");

    try {
      const bans = await message.guild.bans.fetch();

      if (!bans.has(userId)) {
        return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Este usuário não está banido.");
      }

      await message.guild.members.unban(userId);

      message.channel.send(`<:Icon_Member_Unban:1358192758209605723> Usuário com ID \`${userId}\` foi desbanido.`);

      const caseId = await generateCaseId(message.guild.id);
      const date = new Date().toISOString();

      db.run(
        `INSERT INTO modlogs (case_id, guild_id, user_id, action, reason, moderator_id, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [caseId, message.guild.id, userId, "UNBAN", "Desbanido", message.author.id, date]
      );

    } catch (err) {
      console.error(err);
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Ocorreu um erro ao tentar desbanir o usuário.");
    }
  }
};
