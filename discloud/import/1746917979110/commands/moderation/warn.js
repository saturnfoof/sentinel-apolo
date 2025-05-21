const db = require("../../database/db");
const { generateCaseId } = require("../../utils/modlogs.js");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "warn",
  async execute(message, args, client) {

    if (!message.member.permissions.has("KickMembers")) {
      return message.reply(`${emojis.errado} Você não tem permissão para usar esse comando.`);
    }

    const userArg = args[0];
    if (!userArg) return message.reply(`${emojis.errado} Mencione um usuário válido ou forneça o ID.`);

    let user;
    try {
      if (message.mentions.users.first()) {
        user = message.mentions.users.first();
      } else {
        user = await client.users.fetch(userArg);
      }
    } catch (err) {
      return message.reply(`${emojis.errado} Não foi possível encontrar esse usuário.`);
    }

    const reason = args.slice(1).join(" ") || "Sem motivo";
    const fullDate = new Date().toISOString();

    db.run(
      `INSERT INTO warns (user_id, guild_id, reason, moderator, date) VALUES (?, ?, ?, ?, ?)`,
      [user.id, message.guild.id, reason, message.author.tag, fullDate]
    );

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

    message.channel.send(`${emojis.warn} O usuário ${user} recebeu um aviso com sucesso.\n**Motivo:** ${reason}`);

    // Verifica quantos warns o usuário tem
    db.all(
      `SELECT * FROM warns WHERE user_id = ? AND guild_id = ?`,
      [user.id, message.guild.id],
      async (err, warns) => {
        if (err) return;

        const warnCount = warns.length;

        db.all(
          `SELECT * FROM autopunishments WHERE guild_id = ? AND warn_count <= ? ORDER BY warn_count DESC LIMIT 1`,
          [message.guild.id, warnCount],
          async (err, punishments) => {
            if (err || !punishments || !punishments.length) return;

            const punishment = punishments[0];
            const member = await message.guild.members.fetch(user.id).catch(() => null);
            if (!member) return;

            if (punishment.action === "ban") {
              await message.guild.members.ban(user.id, { reason: "Punição automática por warns." }).catch(() => null);
              message.channel.send(`${emojis.marteloban} ${user} foi banido automaticamente por acumular ${warnCount} warns.`);
            } else if (punishment.action === "kick") {
              await member.kick("Punição automática por warns").catch(() => null);
              message.channel.send(`${emojis.kick} ${user} foi expulso automaticamente por acumular ${warnCount} warns.`);
            } else if (punishment.action === "mute") {
              if (member.moderatable) {
                const duration = punishment.duration || 10 * 60 * 1000; // padrão: 10 minutos
                await member.timeout(duration, "Punição automática por warns").catch(() => null);
                message.channel.send(`${emojis.timeout} ${user} foi silenciado automaticamente por acumular ${warnCount} warns.`);
              } else {
                message.channel.send(`${emojis.errado} Não foi possível silenciar automaticamente ${user}.`);
              }
            }
          }
        );
      }
    );
  }
};
