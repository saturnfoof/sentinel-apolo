// reset-database.js
const db = require("./database/db");

db.serialize(() => {
  db.run("DELETE FROM warns", [], function(err) {
    if (err) return console.error("Erro ao limpar warns:", err.message);
    console.log("✅ Tabela 'warns' limpa com sucesso.");
  });

  db.run("DELETE FROM modlogs", [], function(err) {
    if (err) return console.error("Erro ao limpar modlogs:", err.message);
    console.log("✅ Tabela 'modlogs' limpa com sucesso.");
  });

  db.run("DELETE FROM watchlist", [], function(err) {
    if (err) return console.error("Erro ao limpar watchlist:", err.message);
    console.log("✅ Tabela 'watchlist' limpa com sucesso.");
  });
});
