
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "teste-botao",
  execute(message) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("testar")
        .setLabel("Clique aqui")
        .setStyle(ButtonStyle.Primary)
    );

    message.channel.send({
      content: "Testando botão...",
      components: [row]
    });
  }
};
