const { PermissionsBitField } = require("discord.js");
const emojis = require("../../config/emojis.js");
const db = require("../../database/db");
const { generateCaseId } = require("../../utils/caseId.js");
const { sendModLog } = require("../../utils/sendModLog");

module.exports = {
  name: "kick",
  async execute(message, args, client) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply(`${emojis.errado} Você não tem permissão para expulsar membros.`);
    }

    const userId = args[0]?.replace(/[<@!>]/g, "");
    const user = message.mentions.members.first() || await message.guild.members.fetch(userId).catch(() => null);

    if (!user) {
      return message.reply(`${emojis.errado} Mencione um usuário válido ou forneça o ID corretamente.`);
    }

    if (!user.kickable) {
      return message.reply(`${emojis.errado} Não consigo expulsar este usuário. Verifique minha hierarquia ou permissões.`);
    }

    const reason = args.slice(1).join(" ") || "Sem motivo fornecido";

    try {
      await user.kick(reason);
      await message.channel.send(`${emojis.kick} ${user} foi expulso com sucesso.\n**Motivo:** \`${reason}\``);

      const caseId = await generateCaseId(message.guild.id);
      const date = new Date().toISOString();

      db.run(
        `INSERT INTO modlogs (case_id, guild_id, user_id, user_tag, moderator_id, moderator_tag, type, reason, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseId,
          message.guild.id,
          user.id,
          user.user.tag,
          message.author.id,
          message.author.tag,
          "Kick",
          reason,
          date
        ],
        err => {
          if (err) console.error("Erro ao registrar modlog:", err);
        }
      );

      sendModLog(client, message.guild.id, {
        type: "Kick",
        user: user.user,
        moderator: message.author,
        reason,
        caseId,
        date
      });

    } catch (err) {
      console.error(err);
      return message.reply(`${emojis.errado} Ocorreu um erro ao tentar expulsar o usuário.`);
    }
  }
};
