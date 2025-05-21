const emojis = require("../../config/emojis.js"); // Caminho relativo ao comando

module.exports = {
  name: "clear",
  async execute(message, args, client) {

    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("Você não tem permissão para limpar mensagens.");
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("Forneça um número entre 1 e 100.");
    }

    message.channel.bulkDelete(amount + 1, true)
      .then(() => {
        message.channel.send(`${emojis.lixeira} ${amount} mensagens foram apagadas.`)
          .then(msg => setTimeout(() => msg.delete(), 5000));
      })
      .catch(err => {
        console.error(err);
        message.reply("Erro ao apagar mensagens.");
      });
  }
};
