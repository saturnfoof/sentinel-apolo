const db = require("../database/db");

function generateCaseId() {
  const timestamp = Date.now(); // número único baseado no tempo
  const random = Math.floor(Math.random() * 1000); // 0 a 999
  return `CASE-${timestamp}-${random}`;
}

module.exports = { generateCaseId };
