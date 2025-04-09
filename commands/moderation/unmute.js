const db = require("../../database/db");
const { generateCaseId } = require("../../utils/modlogs.js");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "unmute",
  async execute(message, args, client) {
    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Você não tem permissão para desmutar membros.");
    }

    const userArg = args[0];
    if (!userArg) return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Mencione um membro ou forneça o ID.");

    let member;

    if (message.mentions.members.first()) {
      member = message.mentions.members.first();
    } else {
      try {
        member = await message.guild.members.fetch(userArg);
      } catch (err) {
        return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Não foi possível encontrar esse membro.");
      }
    }

    try {
      await member.timeout(null);

      message.channel.send(`<:Icon_Member_Unmute:1358192757561227264> ${member.user.tag} foi desmutado.`);

      const caseId = await generateCaseId(message.guild.id);
      const date = new Date().toISOString();

      db.run(
        `INSERT INTO modlogs (case_id, guild_id, user_id, action, reason, moderator_id, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [caseId, message.guild.id, member.id, "UNMUTE", "Remoção de mute", message.author.id, date]
      );
    } catch (err) {
      console.error(err);
      message.reply("<:Icon_SystemMessageCross:1358195382022045857> Erro ao remover o mute.");
    }
  }
};
