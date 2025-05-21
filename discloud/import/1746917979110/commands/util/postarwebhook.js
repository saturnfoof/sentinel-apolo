const { ChannelType, WebhookClient } = require('discord.js');

module.exports = {
  name: 'postarwebhook',
  description: 'Cria uma webhook e envia mensagem em uma postagem de fórum',
  usage: 's!postarwebhook <threadId|menção> <mensagem>',
  async execute(message, args, client) {
    if (!message.member.permissions.has('ManageWebhooks')) {
      return message.reply('❌ Você precisa da permissão **Gerenciar Webhooks** para usar este comando.');
    }

    const [threadId, ...mensagemArray] = args;
    const mensagem = mensagemArray.join(' ');
    if (!threadId || !mensagem) {
      return message.reply('❌ Uso correto: `s!postarwebhook <threadId> <mensagem>`');
    }

    let thread;
    try {
      thread = await message.guild.channels.fetch(threadId);
      if (!thread || !thread.isThread()) throw new Error();
    } catch {
      return message.reply('❌ ID de thread inválido ou não encontrei a postagem.');
    }

    const forumChannel = thread.parent;
    if (forumChannel.type !== ChannelType.GuildForum) {
      return message.reply('❌ Essa thread não pertence a um canal de fórum.');
    }

    try {
      // Verifica se já existe webhook do bot no canal
      const webhooks = await forumChannel.fetchWebhooks();
      let webhook = webhooks.find(w => w.owner.id === client.user.id);

      // Se não existir, cria
      if (!webhook) {
        webhook = await forumChannel.createWebhook({
          name: 'ForumBot',
          avatar: client.user.displayAvatarURL()
        });
      }

      // Envia mensagem via webhook na thread
      const msg = await webhook.send({
        content: mensagem,
        threadId: thread.id
      });

      return message.reply(`✅ Mensagem enviada!\n🔗 [Ver postagem](${msg.url})`);
    } catch (err) {
      console.error(err);
      return message.reply('❌ Ocorreu um erro ao tentar usar a webhook.');
    }
  }
};
