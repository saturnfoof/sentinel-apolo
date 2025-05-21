const { TextDisplayBuilder, ContainerBuilder, SeparatorBuilder, StringSelectMenuBuilder, ActionRowBuilder, MessageFlags, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("../../database/db.js");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "modstats",
  async execute(message, args, client) {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user) return message.reply(`${emojis.errado} Mencione um staff ou forneça um ID.`);

    db.all(
      `SELECT * FROM modlogs WHERE moderator_id = ? AND guild_id = ? ORDER BY date DESC`,
      [user.id, message.guild.id],
      async (err, rows) => {
        if (err) return message.reply(`${emojis.errado} Erro ao acessar os dados.`);
        if (!rows.length) return message.reply(`${emojis.errado} Este moderador não aplicou nenhuma punição.`);

        const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        const tipos = [...new Set(rows.map(row => capitalize(row.type)))];

        let filtro = null;
        let paginaAtual = 0;
        const itemsPorPagina = 5;

        const gerarContainer = async (pagina) => {
          const filtradas = filtro ? rows.filter(row => capitalize(row.type) === filtro) : rows;
          const totalPaginas = Math.ceil(filtradas.length / itemsPorPagina);

          const start = pagina * itemsPorPagina;
          const paginadas = filtradas.slice(start, start + itemsPorPagina);

          const textComponent = new TextDisplayBuilder().setContent(
            `## ${emojis.estatistica} Modstats de ${user.tag} (${user.id})\n` +
            `${emojis.mod} **Total de punições:** ${filtradas.length}\n` +
            `${emojis.martelo} **Última punição:** <t:${Math.floor(new Date(filtradas[0].date).getTime() / 1000)}:R>\n` +
            `${emojis.lista} **Página ${pagina + 1} de ${totalPaginas}**`
          );

          const textComponent2 = new TextDisplayBuilder().setContent(
            `## Últimas punições aplicadas:`
          );

          const container = new ContainerBuilder()
            .setAccentColor(0xFEE65C)
            .addTextDisplayComponents(textComponent)
            .addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(textComponent2);

          paginadas.forEach(row => {
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `**Case ID:** ${row.case_id}\n**${capitalize(row.type)}** para <@${row.user_id}> - <t:${Math.floor(new Date(row.date).getTime() / 1000)}:f>\n**Motivo:** ${row.reason || "Sem motivo"}\n`
            ));
          });

          return container;
        };

        const atualizarBotoes = () => new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("previous").setLabel("Página Anterior").setStyle(ButtonStyle.Primary).setDisabled(paginaAtual === 0),
          new ButtonBuilder().setCustomId("next").setLabel("Próxima Página").setStyle(ButtonStyle.Primary).setDisabled(paginaAtual >= Math.ceil((filtro ? rows.filter(row => capitalize(row.type) === filtro).length : rows.length) / itemsPorPagina) - 1)
        );

        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId("filter")
          .setPlaceholder("Filtrar por tipo de punição")
          .addOptions([{ label: "Todas", value: "todas" }, ...tipos.map(tipo => ({ label: tipo, value: tipo }))]);

        const rowSelect = new ActionRowBuilder().addComponents(selectMenu);

        const msg = await message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [await gerarContainer(paginaAtual), rowSelect, atualizarBotoes()]
        });

        const collector = msg.createMessageComponentCollector({ filter: (i) => i.user.id === message.author.id, time: 60000 });

        collector.on("collect", async (i) => {
          if (i.customId === "filter") {
            filtro = i.values[0] === "todas" ? null : i.values[0];
            paginaAtual = 0;
          }

          if (i.customId === "previous" && paginaAtual > 0) paginaAtual--;
          if (i.customId === "next") paginaAtual++;

          await i.update({ components: [await gerarContainer(paginaAtual), rowSelect, atualizarBotoes()] });
        });

        collector.on("end", () => msg.edit({ components: [] }).catch(() => {}));
      }
    );
  }
};
