require('dotenv/config');
const {
  Client,
  GatewayIntentBits,
  MessageFlags,
  TextDisplayBuilder,
  ContainerBuilder,
  SeparatorBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', (client) => {
  console.log(`${client.user.username} is online.`);
});

client.on('messageCreate', async (message) => {
  if (message.content === 'embed') {
    // Primeiro Container (Parte 1)
    const textComponent1 = new TextDisplayBuilder().setContent(
      `# Como agir em certas situações!
Nesta postagem, vamos falar sobre como lidar com situações difíceis e o que **não** fazer. Manter o controle é fundamental para garantir um ambiente saudável.`
    );

    const separator1 = new SeparatorBuilder();

    const textComponent2 = new TextDisplayBuilder().setContent(
      `## Como Lidar com Membros "Folgados" <\:apolo\_raiva:1320605677701562419>
* **Mantenha a Calma:** Ao lidar com membros folgados, o mais importante é manter a calma. Esses membros geralmente testam os limites da paciência, mas sua resposta precisa ser controlada. Respire fundo e mantenha uma linguagem neutra e educada.
* **Evite Discussões Desnecessárias:** Não se deixe levar por provocações. Se o membro estiver tentando discutir, não entre na mesma energia. Responda de forma objetiva, destacando as regras e deixando claro o que é esperado no servidor.
* **Explique as Regras de Forma Clara:** Quando perceber que o membro está sendo folgado, relembre as regras de maneira firme, mas educada. Frases como: *“Por favor, mantenha o respeito com todos aqui, isso faz parte das regras do servidor.”* podem ajudar.
* **Aplique Medidas se Necessário:** Caso o comportamento ultrapasse os limites e a conversa não traga resultado, aplique uma medida disciplinar, como um **mute** ou **warn**. Isso deixa claro que o servidor tem regras e elas serão aplicadas.
* **Informe um Superior se o Problema Persistir:** Se o membro continuar criando problemas, mesmo após uma advertência, informe um superior. Manter um histórico da situação ajuda na hora de aplicar punições mais sérias.`
    );

    const separator2 = new SeparatorBuilder();

    const textComponent3 = new TextDisplayBuilder().setContent(
      `## O Que Fazer Quando Não For Respeitado <\:apolo\_paz:1320604472598335509>
* **Seja Claro e Objetivo:** Caso um membro esteja sendo desrespeitoso, não ignore. Envie uma mensagem direta e educada lembrando as regras do servidor. Exemplo: *“Lembre-se de que o respeito é essencial aqui. Por favor, mantenha a educação nas conversas.”*
* **Evite Revidar ou Ser Sarcástico:** Mesmo que o membro esteja sendo rude, você deve manter sua postura como staff. Responder de forma agressiva apenas piora a situação.
* **Imponha Sua Autoridade de Forma Positiva:** Ao perceber que o membro não está respeitando sua orientação, deixe claro que está agindo em nome da equipe e que regras são para todos.
* **Registre a Situação:** Sempre que lidar com um membro desrespeitoso, considere registrar o ocorrido (print ou anotar) para manter um histórico, especialmente se o comportamento se repetir.
* **Aplique uma Punição se Necessário:** Se o desrespeito continuar mesmo após o aviso, aplique uma punição proporcional (mute, warn, ou outra). Não hesite em agir, mas sempre de maneira justa.`
    );

    const separator3 = new SeparatorBuilder();

    const textComponent4 = new TextDisplayBuilder().setContent(
      `## Lidando com Discussões entre Membros <\:apolo\_sla:1320611359897161821>
* **Identifique o Motivo da Discussão:** Antes de intervir, entenda o que está gerando o conflito. Pergunte de maneira neutra o que está acontecendo e ouça os dois lados.
* **Envie um Aviso para Acalmar os Ânimos:** Em chats mais ativos (ex: <#1148008571259338844> ou <#1064093723807453214>), envie uma mensagem pedindo que os envolvidos se acalmem e resolvam de maneira amigável.
* **Seja Impessoal:** Ao intervir, não tome partido. Seu papel é manter a paz, não decidir quem está certo. Use frases como: *“Pessoal, vamos manter o respeito e resolver isso de forma civilizada.”*
* **Punições se o Problema Continuar:** Caso os membros continuem discutindo mesmo após o aviso, analise o tom da conversa e, se necessário, aplique **mute**, **warn** ou outra punição adequada.
* **Informe um Superior em Casos Graves:** Se a discussão envolver ofensas graves ou comportamentos inaceitáveis, faça um registro e informe um superior para uma avaliação mais profunda.`
    );

    const separator4 = new SeparatorBuilder();

    const containerComponent1 = new ContainerBuilder()
      .setAccentColor(0xFEE65C)
      .addTextDisplayComponents(textComponent1)
      .addTextDisplayComponents(textComponent2)
      .addSeparatorComponents(separator2)
      .addTextDisplayComponents(textComponent3)
      .addSeparatorComponents(separator3)
      .addTextDisplayComponents(textComponent4);

    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [containerComponent1],
    });

    // Segundo Container (Parte 2)
    const textComponent5 = new TextDisplayBuilder().setContent(
      `## O Que Fazer Quando Você Errar <\:apolo\_piscando:1320611363189428306>
* **Reconheça o Erro Imediatamente:** Se perceber que agiu de maneira errada (seja uma fala, uma atitude ou uma punição equivocada), reconheça o erro o mais rápido possível.
* **Se Desculpe com o Membro Envolvido:** Se o erro foi ao lidar com um membro, peça desculpas diretamente. Uma frase como: *“Me desculpe, acredito que me expressei de forma inadequada. Vou corrigir isso.”* demonstra maturidade.
* **Corrija a Punição se Necessário:** Caso tenha aplicado uma punição incorreta, ajuste a situação rapidamente. Se foi um mute indevido, remova. Se foi um warn, remova e explique ao membro que o erro foi corrigido.
* **Comunique o Erro à Equipe:** Se o erro for mais grave ou se sentir inseguro, informe um superior. Isso demonstra transparência e evita problemas futuros.
* **Evite Justificativas Excessivas:** Assumir o erro é importante, mas não transforme em uma explicação longa. Seja direto e foque na solução.`
    );

    const separator5 = new SeparatorBuilder();

    const textComponent6 = new TextDisplayBuilder().setContent(
      `## Como Evitar Problemas Comuns <\:apolo\_ui:1320611355991998535>
* **Não Aja de Cabeça Quente:** Respire antes de responder a uma provocação ou tomar uma decisão em uma situação tensa.
* **Conheça as Regras do Servidor:** Antes de aplicar uma punição, tenha certeza de que a regra que você está aplicando está clara.
* **Peça Ajuda se Estiver em Dúvida:** Não há problema em pedir ajuda a outro membro da staff se não souber como agir. Isso evita decisões precipitadas.
* **Mantenha o Respeito Sempre:** Mesmo em situações difíceis, trate todos com educação. Sua postura é um reflexo da staff como um todo.
* **Não Passe Informações Incorretas:** Se não souber responder uma dúvida, diga que vai verificar e retorne com a resposta correta.`
    );

    const separator6 = new SeparatorBuilder();

    const textComponent7 = new TextDisplayBuilder().setContent(
      `## Comunicação Eficiente na Staff <\:apolo\_coffe:1320602645840265339>
* **Use os Canais Internos para Dúvidas:** Se estiver em dúvida sobre uma situação, pergunte nos canais internos antes de agir.
* **Mantenha os Superiores Informados:** Sempre que lidar com uma situação mais complicada, deixe um resumo para que os superiores saibam o que aconteceu.
* **Evite Resolver Tudo Sozinho:** Em situações mais complexas, peça uma segunda opinião. Isso evita decisões erradas.
* **Seja Transparente:** Se cometer um erro, informe o que aconteceu e como foi corrigido.
* **Mantenha um Ambiente Saudável:** A staff deve ser um time, e apoiar uns aos outros é essencial.`
    );

    const separator7 = new SeparatorBuilder();

    const textComponent8 = new TextDisplayBuilder().setContent(
      `## Importante <\:apolo\_foof:1320611358009458749>
* Sempre informe um superior sobre qualquer erro que não consiga corrigir.
* Tentar esconder um erro pode resultar em punições ou até remoção da staff.
* Manter uma boa comunicação e transparência é essencial para a confiança da equipe.`
    );

    const separator8 = new SeparatorBuilder();

    const textComponent9 = new TextDisplayBuilder().setContent(
      `## Lembre-se:
Errar é humano, mas assumir o erro e corrigi-lo é o que diferencia um bom staff!`
    );

    const containerComponent2 = new ContainerBuilder()
      .setAccentColor(0xFEE65C)
      .addTextDisplayComponents(textComponent5)
      .addSeparatorComponents(separator5)
      .addTextDisplayComponents(textComponent6)
      .addSeparatorComponents(separator6)
      .addTextDisplayComponents(textComponent7)
      .addSeparatorComponents(separator7)
      .addTextDisplayComponents(textComponent8)
      .addTextDisplayComponents(textComponent9);

    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [containerComponent2],
    });
  }
});

client.login(process.env.TOKEN);
