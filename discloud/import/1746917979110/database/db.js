const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/database.sqlite");

db.serialize(() => {
  // Tabela de warns
  db.run(`CREATE TABLE IF NOT EXISTS warns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    guild_id TEXT,
    reason TEXT,
    moderator TEXT,
    date TEXT
  )`);

  // Tabela de modlogs
  db.run(`CREATE TABLE IF NOT EXISTS modlogs (
    case_id TEXT PRIMARY KEY,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_tag TEXT,
    moderator_id TEXT NOT NULL,
    moderator_tag TEXT,
    type TEXT NOT NULL,
    reason TEXT NOT NULL,
    date TEXT NOT NULL
  )`);
});

module.exports = db;

// watchlist
db.run(`CREATE TABLE IF NOT EXISTS watchlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_tag TEXT,
  reason TEXT NOT NULL,
  added_by TEXT,
  date TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS auto_punishments (
  guild_id TEXT,
  warns INTEGER,
  action TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS logs (
  guild_id TEXT PRIMARY KEY,
  channel_id TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS autopunishments (
  guild_id TEXT,
  warn_count INTEGER,
  action TEXT
)`);
