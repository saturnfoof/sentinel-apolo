const { EmbedBuilder } = require("discord.js");
const db = require("../database/db");

async function sendModLog(guild, embed) {
  db.get(`SELECT channel_id FROM logs WHERE guild_id = ?`, [guild.id], async (err, row) => {
    if (err || !row) return;
    const logChannel = guild.channels.cache.get(row.channel_id);
    if (logChannel && logChannel.isTextBased()) {
      logChannel.send({ embeds: [embed] }).catch(() => {});
    }
  });
}

module.exports = { sendModLog };
