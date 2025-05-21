const { TextDisplayBuilder, ContainerBuilder, ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require("discord.js");
const db = require("../../database/db");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "case",
  async execute(message, args) {
    const caseId = args[0];

    if (!caseId) return message.reply(`${emojis.errado} Forneça o ID do case.`);

    const gerarEmbed = async () => {
      return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM modlogs WHERE case_id = ?`, [caseId], (err, row) => {
          if (err) return reject(err);
          if (!row) return reject("Nenhum case encontrado.");

          const userTag = row.user_tag || "Usuário desconhecido";
          const moderatorTag = row.moderator_tag || "Moderador desconhecido";
          const reason = row.reason ? row.reason : "Não especificado";
          const caseType = row.type ? row.type.toUpperCase() : "Desconhecido";
          const caseDate = `<t:${Math.floor(new Date(row.date).getTime() / 1000)}:F>`;

          const textComponent = new TextDisplayBuilder().setContent(
            `## ${emojis.escudo} Detalhes do Case ${caseId}\n` +
            `**Usuário Punido:** ${userTag} (${row.user_id})\n` +
            `**Moderador:** ${moderatorTag} (${row.moderator_id})\n` +
            `**Tipo:** ${caseType}\n` +
            `**Motivo:** ${reason}\n` +
            `**Data:** ${caseDate}`
          );

          const container = new ContainerBuilder()
            .setAccentColor(0xFEE65C)
            .addTextDisplayComponents(textComponent)
            .addSeparatorComponents();

          resolve(container);
        });
      });
    };

    const container = await gerarEmbed();
    const deleteButton = new ButtonBuilder()
      .setCustomId(`delete_case_${caseId}`)
      .setLabel("❌ Deletar")
      .setStyle(ButtonStyle.Danger);

    const editButton = new ButtonBuilder()
      .setCustomId(`edit_case_${caseId}`)
      .setLabel("✏️ Editar Motivo")
      .setStyle(ButtonStyle.Primary);

    const msg = await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [container, actionRow]
    });

    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 60000
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === `delete_case_${caseId}`) {
        await db.run(`DELETE FROM modlogs WHERE case_id = ?`, [caseId]);
        await interaction.update({
          content: `${emojis.certo} Case ${caseId} deletado com sucesso.`,
          components: []
        });
      }


      if (interaction.customId === `edit_case_${caseId}`) {
        const modal = new ModalBuilder()
          .setCustomId(`edit_reason_${caseId}`)
          .setTitle("Editar Motivo");

        const motivoInput = new TextInputBuilder()
          .setCustomId("new_reason")
          .setLabel("Novo Motivo")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder("Digite o novo motivo aqui...")
          .setRequired(true);

        const modalRow = new ActionRowBuilder().addComponents(motivoInput);
        modal.addComponents(modalRow);
        await interaction.showModal(modal);
      }
    });

    // Coletor de Modais
    message.client.on("interactionCreate", async (interaction) => {
      if (interaction.type !== InteractionType.ModalSubmit) return;
      if (interaction.customId !== `edit_reason_${caseId}`) return;

      const newReason = interaction.fields.getTextInputValue("new_reason");

      await db.run(`UPDATE modlogs SET reason = ? WHERE case_id = ?`, [newReason, caseId]);
      await interaction.reply({ content: `${emojis.certo} Motivo atualizado com sucesso!`, ephemeral: true });

      const updatedContainer = await gerarEmbed();
      await msg.edit({ components: [updatedContainer, actionRow] }).catch(() => {});
    });

    collector.on("end", () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  }
};
