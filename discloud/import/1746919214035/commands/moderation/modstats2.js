const { TextDisplayBuilder, ContainerBuilder, SeparatorBuilder, StringSelectMenuBuilder, ActionRowBuilder, MessageFlags, InteractionType } = require("discord.js");
const db = require("../../database/db");

module.exports = {
  name: "modstats2",
  async execute(message, args, client) {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user) return message.reply("Mencione um staff ou forneça um ID.");

    db.all(
      `SELECT * FROM modlogs WHERE moderator_id = ? AND guild_id = ? ORDER BY date DESC`,
      [user.id, message.guild.id],
      async (err, rows) => {
        if (err) {
          console.error(err);
          return message.reply("Erro ao acessar os dados.");
        }

        if (!rows.length) return message.reply("Este moderador não aplicou nenhuma punição.");

        const tipos = [...new Set(rows.map(row => row.type))];
        let filtro = null;

        const gerarContainer = async () => {
          const filtradas = filtro ? rows.filter(row => row.type === filtro) : rows;

          const textComponent = new TextDisplayBuilder().setContent(
            `# Modstats de ${user.tag} (${user.id})\n` +
            `**Total de punições:** ${filtradas.length}\n` +
            `**Última punição:** <t:${Math.floor(new Date(filtradas[0].date).getTime() / 1000)}:R>\n\n` +
            `## Últimas punições aplicadas`
          );

          const listaPunições = await Promise.all(filtradas.slice(0, 5).map(async row => {
            const targetUser = await client.users.fetch(row.user_id).catch(() => null);
            const punido = targetUser ? `<@${targetUser.id}>` : `ID: ${row.user_id}`;
            const dataPunição = `<t:${Math.floor(new Date(row.date).getTime() / 1000)}:f>`;
            return `**${row.type.toUpperCase()}** para ${punido} - ${dataPunição}\n**Motivo:** ${row.reason || "Sem motivo"}`;
          }));

          const container = new ContainerBuilder()
            .setAccentColor(0xFEE65C)
            .addTextDisplayComponents(textComponent)
            .addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(listaPunições.join("\n\n") || "Nenhuma punição encontrada."));

          return container;
        };

        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId("filter")
          .setPlaceholder("Filtrar por tipo de punição")
          .addOptions([
            { label: "Todas", value: "todas" },
            ...tipos.map(tipo => ({ label: tipo, value: tipo }))
          ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const msg = await message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [await gerarContainer()],
          componentsV2: [row]
        });

        const collector = msg.createMessageComponentCollector({
          time: 60000,
          filter: i => i.user.id === message.author.id
        });

        collector.on("collect", async (i) => {
          if (i.customId === "filter" && i.type === InteractionType.MessageComponent) {
            filtro = i.values[0] === "todas" ? null : i.values[0];
            await i.update({
              components: [await gerarContainer()],
              componentsV2: [row]
            });
          }
        });

        collector.on("end", () => {
          msg.edit({ components: [] }).catch(() => {});
        });
      }
    );
  }
};