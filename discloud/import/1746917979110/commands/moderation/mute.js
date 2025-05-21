const ms = require("ms");
const db = require("../../database/db");
const { generateCaseId } = require("../../utils/modlogs.js");
const emojis = require("../../config/emojis.js");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "mute",
  async execute(message, args, client) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Você não tem permissão para silenciar membros.");
    }

    const userId = args[0]?.replace(/[<@!>]/g, "");
    const member = message.mentions.members.first() || await message.guild.members.fetch(userId).catch(() => null);

    if (!member) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Mencione um membro válido ou forneça um ID correto.");
    }

    if (!member.moderatable) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Não consigo silenciar este usuário. Verifique minha hierarquia ou permissões.");
    }

    const time = args[1];
    if (!time || !ms(time)) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Especifique um tempo válido. Exemplo: `10m`, `1h`, `2d`.");
    }

    const reason = args.slice(2).join(" ") || "Sem motivo fornecido";

    try {
      await member.timeout(ms(time), reason);
      await message.channel.send(`<:Icon_Member_Mute:1358192753980164106> ${member.user.tag} foi silenciado por \`${time}\`\n**Motivo:** \`${reason}\``);

      const caseId = await generateCaseId(message.guild.id);
      const date = new Date().toISOString();

      db.run(
        `INSERT INTO modlogs (case_id, guild_id, user_id, user_tag, moderator_id, moderator_tag, type, reason, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseId,
          message.guild.id,
          member.id,
          member.user.tag,
          message.author.id,
          message.author.tag,
          "Mute",
          reason,
          date
        ],
        err => {
          if (err) console.error("Erro ao registrar modlog:", err);
        }
      );

    } catch (err) {
      console.error(err);
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Ocorreu um erro ao tentar silenciar o usuário.");
    }
  }
};
