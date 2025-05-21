const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/database.sqlite");

db.serialize(() => {
  db.all("SELECT DISTINCT user_id, guild_id FROM warns", [], (err, users) => {
    if (err) return console.error("Erro ao buscar usuários:", err.message);

    users.forEach(({ user_id, guild_id }) => {
      db.all(
        "SELECT id FROM warns WHERE user_id = ? AND guild_id = ? ORDER BY id ASC",
        [user_id, guild_id],
        (err, warns) => {
          if (err) return console.error("Erro ao buscar warns:", err.message);

          warns.forEach((warn, index) => {
            const warn_number = index + 1;
            db.run(
              "UPDATE warns SET warn_number = ? WHERE id = ?",
              [warn_number, warn.id],
              (err) => {
                if (err) console.error("Erro ao atualizar warn_number:", err.message);
              }
            );
          });
        }
      );
    });
  });
});

process.on("exit", () => {
  db.close();
  console.log("Atualização de warn_number concluída.");
});
