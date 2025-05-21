const config = require("../config.json");

module.exports = (client) => {
  client.on("messageCreate", async message => {
    if (message.author.bot) return;

    // Substitua 'someUserId' pelo ID do usuário
    const someUserId = '1072608696129028146';

    // Verifica se a mensagem menciona o usuário específico e contém "DROP" ou "drops"
    if (message.mentions.has(someUserId) && /drop(s)?/i.test(message.content)) {
      try {
        await message.delete();
        
        // Envia uma mensagem de aviso e apaga após 10 segundos
        const warningMessage = await message.channel.send(
          '<:Icon_Required:1373339477505867927> **AVISO:** Não mencione a staff cobrando, pedindo, ou perguntando se haverá drops. Caso venha ter, será avisado no canal de drops!\n-# Caso continue com tais atos, será devidamente punido, então cuidado!'
        );

        setTimeout(() => warningMessage.delete(), 10000); // Apaga a mensagem após 10 segundos
      } catch (error) {
        console.error("Erro ao tentar apagar a mensagem ou enviar o aviso:", error);
      }
    }
  });
};