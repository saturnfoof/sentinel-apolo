module.exports = function generateCaseId() {
    const now = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString();
    return `CASE-${now.slice(-5)}-${random.padStart(4, "0")}`;
  };
  