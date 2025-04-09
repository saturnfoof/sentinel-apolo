const db = require("../database/migrations/modlogs");
const { randomUUID } = require("crypto");

module.exports = function registerPunishment({ user, moderator, guildId, type, reason, category = "Outros" }) {
  const caseId = randomUUID();
  const date = new Date().toISOString();

  db.run(
    `INSERT INTO modlogs (case_id, user_id, user_tag, moderator_id, moderator_tag, guild_id, type, reason, date, category)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      caseId,
      user.id,
      user.tag,
      moderator.id,
      moderator.tag,
      guildId,
      type,
      reason,
      date,
      category
    ]
  );
};
