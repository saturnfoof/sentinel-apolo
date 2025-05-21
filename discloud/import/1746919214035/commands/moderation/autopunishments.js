const db = require("../../database/db");
const emojis = require("../../config/emojis");

function parseTempo(tempoStr) {
  if (!tempoStr) return null;

  const match = tempoStr.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;

  const valor = parseInt(match[1]);
  const unidade = match[2];

  const multiplicadores = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return valor * multiplicadores[unidade];
}

module.exports = {
  name: "autopunishments",
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) {
      return message.reply(`${emojis.errado} Você não tem permissão para usar esse comando.`);
    }

    const subcomando = args[0];

    if (!subcomando) {
      return message.reply(`${emojis.errado} Use: \`autopunishments <add|remove|list>\``);
    }

    if (subcomando === "add") {
      const warnCount = parseInt(args[1]);
      const action = args[2]?.toLowerCase();

      if (isNaN(warnCount) || warnCount < 1) {
        return message.reply(`${emojis.errado} Forneça um número válido de warns.`);
      }

      const acoesValidas = ["mute", "kick", "ban"];
      if (!acoesValidas.includes(action)) {
        return message.reply(`${emojis.errado} Ação inválida. Use: \`${acoesValidas.join(" | ")}\``);
      }

      let duration = null;
      if (action === "mute") {
        duration = parseTempo(args[3]);
        if (!duration) {
          return message.reply(`${emojis.errado} Forneça um tempo válido para mute (ex: \`10m\`, \`1h\`, \`2d\`).`);
        }
      }

      db.run(
        `INSERT OR REPLACE INTO autopunishments (guild_id, warn_count, action, duration) VALUES (?, ?, ?, ?)`,
        [message.guild.id, warnCount, action, duration],
        (err) => {
          if (err) {
            console.error(err);
            return message.reply(`${emojis.errado} Erro ao salvar punição automática.`);
          }

          let msg = `${emojis.certo} Punição automática configurada: **${warnCount} warns** → \`${action}\``;
          if (action === "mute") msg += ` por ${args[3]}`;
          message.reply(msg);
        }
      );
    }

    else if (subcomando === "remove") {
      const warnCount = parseInt(args[1]);

      if (isNaN(warnCount)) {
        return message.reply(`${emojis.errado} Forneça um número de warns válido.`);
      }

      db.run(
        `DELETE FROM autopunishments WHERE guild_id = ? AND warn_count = ?`,
        [message.guild.id, warnCount],
        function (err) {
          if (err) {
            console.error(err);
            return message.reply(`${emojis.errado} Erro ao remover punição automática.`);
          }

          if (this.changes === 0) {
            return message.reply(`${emojis.errado} Nenhuma punição automática encontrada com ${warnCount} warns.`);
          }

          message.reply(`${emojis.certo} Punição automática para ${warnCount} warns removida com sucesso.`);
        }
      );
    }

    else if (subcomando === "list") {
      db.all(
        `SELECT warn_count, action, duration FROM autopunishments WHERE guild_id = ? ORDER BY warn_count ASC`,
        [message.guild.id],
        (err, rows) => {
          if (err) {
            console.error(err);
            return message.reply(`${emojis.errado} Erro ao listar punições automáticas.`);
          }

          if (rows.length === 0) {
            return message.reply(`${emojis.tempo} Nenhuma punição automática configurada.`);
          }

          const lista = rows.map(row => {
            let linha = `• ${row.warn_count} warns → \`${row.action}\``;
            if (row.action === "mute" && row.duration) {
              const durMin = Math.floor(row.duration / 60000);
              linha += ` (${durMin} min)`;
            }
            return linha;
          }).join("\n");

          message.reply(`${emojis.engrenagem} **Punições Automáticas Configuradas:**\n${lista}`);
        }
      );
    }

    else {
      return message.reply(`${emojis.errado} Subcomando inválido. Use: \`add\`, \`remove\` ou \`list\`.`);
    }
  }
};
