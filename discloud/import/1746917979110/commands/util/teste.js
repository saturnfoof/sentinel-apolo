module.exports = {
  name: "teste",
  async execute(message) {
    const db = require("../../database/db");

    if (!message.member.permissions.has("Administrator")) return;

    db.run(`ALTER TABLE autopunishments ADD COLUMN duration INTEGER`, (err) => {
      if (err) {
        if (err.message.includes("duplicate column name")) {
          return message.reply("🟡 A coluna `duration` já existe.");
        }
        return message.reply("❌ Erro ao atualizar o banco: " + err.message);
      }

      message.reply("✅ Banco de dados atualizado com sucesso! Coluna `duration` adicionada.");
    });
  }
};
