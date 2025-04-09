const db = require("../../database/db");
const { generateCaseId } = require("../../utils/modlogs.js");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "warn",
  async execute(message, args, client) {

    if (!message.member.permissions.has("KickMembers")) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Você não tem permissão para usar esse comando.");
    }

    const userArg = args[0];
    if (!userArg) return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Mencione um usuário válido ou forneça o ID.");

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

    const reason = args.slice(1).join(" ") || "Sem motivo";
    const fullDate = new Date().toISOString();

    // Registro na tabela de warns
    db.run(
      `INSERT INTO warns (user_id, guild_id, reason, moderator, date) VALUES (?, ?, ?, ?, ?)`,
      [user.id, message.guild.id, reason, message.author.tag, fullDate]
    );

    // Registro na tabela modlogs
    const caseId = await generateCaseId(message.guild.id);
    db.run(
      `INSERT INTO modlogs (case_id, guild_id, user_id, user_tag, moderator_id, moderator_tag, type, reason, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caseId,
        message.guild.id,
        user.id,
        user.tag,
        message.author.id,
        message.author.tag,
        "WARN",
        reason,
        fullDate
      ]
    );

    message.channel.send(`<:Icon_Member_Warn:1358194396075524327> O usuário ${user} recebeu um aviso com sucesso.\nMotivo: ${reason}`);
  }
};
