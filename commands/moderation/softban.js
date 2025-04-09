const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("../../database/db");
const { generateCaseId } = require("../../utils/modlogs");
const emojis = require("../../config/emojis");

module.exports = {
  name: "softban",
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply(`${emojis.errado} Você não tem permissão para usar esse comando.`);
    }

    const userId = args[0]?.replace(/[<@!>]/g, "");
    const reason = args.slice(1).join(" ") || "Sem motivo";
    if (!userId) return message.reply(`${emojis.errado} Mencione um usuário ou forneça o ID.`);

    const user = await client.users.fetch(userId).catch(() => null);
    if (!user) return message.reply(`${emojis.errado} Usuário não encontrado.`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("confirmar")
        .setLabel("Confirmar Softban")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("cancelar")
        .setLabel("Cancelar")
        .setStyle(ButtonStyle.Secondary)
    );

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`Deseja realmente aplicar um **softban** em ${user.tag}?\n${emojis.caderno} Motivo: \`${reason}\``);

    const msg = await message.reply({ embeds: [embed], components: [row] });

    const filtro = i => i.user.id === message.author.id;
    const coletor = msg.createMessageComponentCollector({ filter: filtro, time: 15000, max: 1 });

    coletor.on("collect", async interaction => {
      if (interaction.customId === "confirmar") {
        await interaction.deferUpdate();

        const membro = await message.guild.members.fetch(user.id).catch(() => null);
        if (!membro) return message.reply(`${emojis.errado} O usuário não está mais no servidor.`);

        await membro.ban({ reason, deleteMessageDays: 7 }).catch(() => null);
        await message.guild.members.unban(user.id, "Softban (unban automático)").catch(() => null);

        const caseId = generateCaseId();
        const date = new Date().toISOString();

        db.run(`INSERT INTO modlogs (case_id, guild_id, user_id, user_tag, moderator_id, moderator_tag, type, reason, date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [caseId, message.guild.id, user.id, user.tag, message.author.id, message.author.tag, "Softban", reason, date]);

        await msg.edit({ content: `${emojis.certo} Softban aplicado em ${user} com sucesso!`, embeds: [], components: [] });
      } else {
        await interaction.update({ content: `${emojis.errado} Softban cancelado.`, embeds: [], components: [] });
      }
    });

    coletor.on("end", collected => {
      if (collected.size === 0) {
        msg.edit({ content: `${emojis.tempo} Tempo esgotado. Nenhuma ação foi tomada.`, embeds: [], components: [] });
      }
    });
  }
};
