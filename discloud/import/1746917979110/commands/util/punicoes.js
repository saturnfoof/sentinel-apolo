const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "punicoes",
  description: "Mostra as diretrizes de punições da staff.",
  async execute(message, args, client) {
    const embeds = [];

    // Embed 1 - Introdução
    embeds.push(
      new EmbedBuilder()
        .setColor("#3498db")
        .setTitle(`<:Icon_ModView:1369429749486846084> Dúvidas sobre punições? Entenda como aplicar corretamente!`)
        .setDescription(
          `Se você faz parte da staff, é essencial saber **qual punição aplicar para cada infração**. Este guia foi criado para garantir que as decisões sejam **justas, coerentes e padronizadas**, mantendo o ambiente organizado e saudável para todos.\n\n` +
          `## **Classificação das punições:**\n` +
          `🟢 - **Aviso Verbal** (*Alerta educativo para infrações leves*)\n` +
          `🟡 -  **Warn** (*Registro formal de infração, podendo levar a punições acumulativas*)\n` +
          `🟠 - **Mute** (*Restrição temporária de comunicação em chat e/ou voz*)\n` +
          `🔴 - **Ban** (*Expulsão definitiva do servidor, podendo ser irreversível*)\n` +
          `⚫ - **Banimento de funcionalidades** (*Proibição de usar comandos e interações do BOT*)\n\n` +
          `Cada infração deve ser avaliada com **bom senso**, levando em consideração **a gravidade do ato, a reincidência e o impacto no servidor**.`
        )
    );

    // Embed 2 - Nível 1
    embeds.push(
      new EmbedBuilder()
        .setColor("#2ecc71")
        .setTitle("🟢 Nível 1 - Aviso Verbal *(Infração leve, passível de correção sem penalidade formal)*")
        .setDescription(
          `Um **aviso verbal** é uma **advertência informal**, usada para corrigir comportamentos inadequados de forma educativa, sem aplicar uma punição direta.\n\n` +
          `**Casos onde o aviso verbal é recomendado:**\n` +
          `- **Menção desnecessária à staff em tickets ou canais** → *"Evite pingar a equipe sem necessidade. Todos serão atendidos na ordem."*\n` +
          `- **Nickname com excesso de emojis, caracteres ou caps lock** → *"Seu nome está poluído visualmente, por favor, altere."*\n` +
          `- **Avatar impróprio (mas não explícito ou ofensivo)** → *"Sua foto pode ser considerada inadequada para o ambiente do servidor. Troque-a, por favor."*\n` +
          `- **Comentários inapropriados (leve teor ofensivo, mas sem gravidade)** → *"Evite esse tipo de linguagem para manter um ambiente amigável."*\n` +
          `- **Dispersão de tópicos em canais errados (off-topic esporádico)** → *"Este canal não é para esse assunto. Por favor, utilize o local adequado."*\n\n` +
          `<:Icon_BanMember:1369430082506199191> **Se o usuário persistir no comportamento após o aviso verbal, aplique um WARN.**`
        )
    );

    // Embed 3 - Nível 2
    embeds.push(
      new EmbedBuilder()
        .setColor("#f1c40f")
        .setTitle(":yellow_circle: Nível 2 - Warn *(Infração moderada que exige punição registrada via comando)*")
        .setDescription(
          `O **warn** serve para documentar infrações **mais graves ou reincidentes**, além de alertar o usuário que, ao acumular warns, poderá ser mutado ou banido.\n\n` +
          `## **Casos que exigem WARN:**\n` +
          `- **Ofensas graves contra membros** → *"Desrespeito não é tolerado. Mantenha um diálogo civilizado."*\n` +
          `- **Linguagem chula/excessiva (com teor sexual, mas não explícito)** → *"Evite comentários de cunho sexual. Manteremos um ambiente adequado para todos."*\n` +
          `- **Tentativa de divulgação indireta (nickname, status, bio)** → *"Alterar o nome para divulgar algo não autorizado pode resultar em punições maiores."*\n` +
          `- **Compartilhamento de imagens/memes ridicularizando membros** → *"Expor outros usuários sem consentimento pode causar problemas. Respeite a comunidade."*\n` +
          `- **Abertura de ticket sem necessidade ou sem explicação** → *"Se não há um motivo válido para o ticket, ele será fechado."*\n` +
          `- **Burla de AutoMod (tentativa de driblar filtros do servidor)** → *"Evite tentar contornar as regras do AutoMod. O sistema está configurado para manter o ambiente seguro e organizado."*\n\n` +
          `<:Icon_Timeout:1358194363619999887> **Acúmulo de warns gera punições automáticas:**\n` +
          `- **2 warns** → *Mute de 1 hora*\n` +
          `- **3 warns** → *Mute de 4 horas*\n` +
          `- **4 warns** → *Mute de 6 horas*\n` +
          `- **5 warns** → *Banimento (reversível apenas mediante pagamento ou apelo)*`
        )
    );

    // Embed 4 - Nível 3
    embeds.push(
      new EmbedBuilder()
        .setColor("#e67e22")
        .setTitle(":orange_circle: Nível 3 - Mute *(Restrição temporária para casos mais graves ou reincidência de infrações moderadas)*")
        .setDescription(
          `O **mute** impede o usuário de enviar mensagens e/ou falar em canais de voz, sendo aplicado para infrações recorrentes ou graves.\n\n` +
          `## **Casos e prazos sugeridos:**\n` +
          `- **Flood, spam ou uso excessivo de caps lock** → *Mute de 30 minutos a 3 horas*\n` +
          `- **Ofensas severas, insultos pessoais ou ataques diretos** → *Mute de 1 a 12 horas*\n` +
          `- **Linguagem inapropriada com conotação sexual explícita** → *Mute de 3 a 24 horas*\n` +
          `- **Apologia a crimes, preconceito ou discurso de ódio leve** → *Mute de 12 horas a 3 dias*\n` +
          `- **Comércio/divulgação direta (sem insistência)** → *Mute de 7 horas a 2 dias*\n` +
          `- **Incitação ao caos ou desordem (organização de flood, spams coletivos, etc.)** → *Mute de 3 a 8 horas*\n\n` +
          `<:Icon_BanMember:1369430082506199191> **Se o usuário continuar a violar regras após o mute, ele poderá ser banido.**`
        )
    );

    // Embed 5 - Nível 4
    embeds.push(
      new EmbedBuilder()
        .setColor("#e74c3c")
        .setTitle(":red_circle: Nível 4 - Ban *(Expulsão definitiva do servidor para infrações graves)*")
        .setDescription(
          `O **banimento** é aplicado em casos de **grande impacto negativo**, onde a presença do usuário é prejudicial para o servidor.\n\n` +
          `### **Motivos que levam ao banimento:**\n` +
          `- **Apologia a crimes (nazismo, racismo, homofobia, etc.)**  *(banimento sem direito a compra e apelo)*\n` +
          `- **Compartilhamento de gore, pornografia ou material ilegal** *(ban sem revogação!)*\n` +
          `- **Assédio moral, sexual ou perseguição contra membros/staff**\n` +
          `- **Ameaças reais contra membros (exposição de dados, doxxing, etc.)**\n` +
          `- **Tentativa de hack, phish ou roubo de contas**\n` +
          `- **Infração grave às ToS do Discord (ban sem possibilidade de retorno)**\n\n` +
          `<:Icon_Member_Warn:1358194396075524327> *Dependendo do caso, o usuário pode ter direito a um apelo ou pagamento para retorno ao servidor.*`
        )
    );

    // Embed 6 - Nível 5
    embeds.push(
      new EmbedBuilder()
        .setColor("#2c3e50")
        .setTitle(":black_circle: Nível 5 - Banimento de Funcionalidades do BOT")
        .setDescription(
          `**Motivos válidos para essa punição:**\n` +
          `- Evasão de banimento (uso de contas alternativas) (ban do servidor igualmente)\n` +
          `- Abuso de bugs ou exploits (revogação possível via pagamento)\n` +
          `- Plágio de comandos ou design do BOT (ban definitivo do servidor e do BOT)\n` +
          `- Calote em transações com moeda do BOT (revogação mediante pagamento)\n` +
          `- Ofensas direcionadas ao BOT (banimento do bot, em casos externos)`
        )
    );

    // Embed 7 - Voz e Considerações
    embeds.push(
      new EmbedBuilder()
        .setColor("#95a5a6")
        .setTitle("<:Icon_Channel_Voice:1369430383761948852> Punições em Canais de Voz")
        .setDescription(
          `**Ferramentas disponíveis:**\n` +
          `Desconectar → Remove o usuário da call (ele pode retornar).\n` +
          `Silenciar → O usuário permanece na call, mas sem falar.\n` +
          `Desativar áudio → O usuário não consegue ouvir ninguém.\n\n` +
          `**Essas opções são úteis quando o moderador está presente. Caso contrário, use o Mute (Classificação N°3)**.\n\n` +
          `**Considerações Finais**\n` +
          `Sempre avalie o contexto antes de aplicar uma punição.\n` +
          `Se houver dúvida sobre a severidade da infração, consulte a equipe.\n` +
          `Nosso objetivo não é punir excessivamente, mas manter um ambiente justo e agradável.\n` +
          `Dúvidas? Procure um supervisor da staff <:apolo_piscando:1320611363189428306> !`
        )
    );

    // Envia cada embed separadamente
    for (const embed of embeds) {
      await message.channel.send({ embeds: [embed] });
    }
  },
};
