const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'embedcreate',
  description: 'Crie um embed personalizado de forma interativa.',
  async execute(message, args, client) {
    const author = message.author;
    const channel = message.channel;

    const perguntas = [
      { chave: 'title', pergunta: '📝 Qual será o **título** do embed? (ou `cancelar` para sair)' },
      { chave: 'description', pergunta: '📃 Qual será a **descrição** do embed? (ou `cancelar`)' },
      { chave: 'color', pergunta: '🎨 Qual será a **cor** do embed? (hex: `#FF0000` ou `cancelar`)' },
      { chave: 'image', pergunta: '🖼️ Link da **imagem grande**? (ou `pular` / `cancelar`)' },
      { chave: 'thumbnail', pergunta: '📎 Link da **thumbnail**? (ou `pular` / `cancelar`)' }
    ];

    const respostas = {};

    const filtro = m => m.author.id === author.id;

    for (const p of perguntas) {
      await channel.send(p.pergunta);
      const coletada = await channel.awaitMessages({ filter: filtro, max: 1, time: 60000 });

      const resposta = coletada.first()?.content;

      if (!resposta) {
        return channel.send('⏰ Tempo esgotado. Comando cancelado.');
      }

      if (resposta.toLowerCase() === 'cancelar') {
        return channel.send('❌ Comando cancelado.');
      }
      
      if (resposta.toLowerCase() === 'pular' || resposta.trim() === '') continue;
      respostas[p.chave] = resposta;
    
    }

    // Cria o embed com as respostas
    const embed = new EmbedBuilder();

    if (respostas.title) embed.setTitle(respostas.title);
    if (respostas.description) embed.setDescription(respostas.description);
    if (respostas.color) embed.setColor(respostas.color);
    if (respostas.image) embed.setImage(respostas.image);
    if (respostas.thumbnail) embed.setThumbnail(respostas.thumbnail);

    embed.setFooter({ text: `Criado por ${author.tag}`, iconURL: author.displayAvatarURL() });

    await channel.send({ content: '✅ Embed criado com sucesso! Aqui está a prévia:', embeds: [embed] });
  }
};
