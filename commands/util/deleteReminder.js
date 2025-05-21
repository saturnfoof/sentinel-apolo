module.exports = {
  name: 'deletereminder',
  description: 'Deleta mensagens de um usuário específico contendo "lembrete".',
  execute(client) {
    client.on("messageCreate", async message => {
      if (message.author.bot) return;

      // Substitua 'userIdAlvo' pelo ID do usuário específico
      const userIdAlvo = '1066094883573600307';

      // Verifica se o autor da mensagem é o usuário específico e contém "lembrete"
      if (message.author.id === userIdAlvo && /lembrete/i.test(message.content)) {
        try {
          await message.delete();
          console.log("Mensagem deletada: contem 'lembrete'.");
        } catch (error) {
          console.error("Erro ao tentar apagar a mensagem:", error);
        }
      }
    });
  }
};