const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/database.sqlite");

db.run(`ALTER TABLE warns ADD COLUMN warn_number INTEGER`, (err) => {
  if (err) {
    if (err.message.includes("duplicate column name")) {
      console.log("A coluna 'warn_number' já existe.");
    } else {
      console.error("Erro ao adicionar a coluna:", err.message);
    }
  } else {
    console.log("Coluna 'warn_number' adicionada com sucesso!");
  }

  db.close();
});
