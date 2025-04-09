const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho para o banco de dados principal
const dbPath = path.resolve(__dirname, "../db.sqlite");
const db = new sqlite3.Database(dbPath);

// Criação da tabela modlogs, se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS modlogs (
      case_id TEXT PRIMARY KEY,
      user_id TEXT,
      user_tag TEXT,
      moderator_id TEXT,
      moderator_tag TEXT,
      guild_id TEXT,
      type TEXT,
      reason TEXT,
      date TEXT,
      category TEXT
    )
  `);
});

module.exports = db;
