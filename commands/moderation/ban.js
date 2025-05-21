const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const db = require("../../database/db");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "ban",
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply(`${emojis.errado} Você não tem permissão para banir membros.`);
    }

    const targetId = args[0];
    const user = message.mentions.members.first() || await message.guild.members.fetch(targetId).catch(() => null);

    if (!user) return message.reply(`${emojis.errado} Usuário não encontrado. Verifique se mencionou corretamente ou se o ID está correto.`);

    const reason = args.slice(1).join(" ") || "Sem motivo fornecido";

    const embed = new EmbedBuilder()
     .setTitle("Confirmação de banimento")
     .setDescription(`Tem certeza que deseja banir ${user}?\n**Motivo:** \`${reason}\``)
     .setThumbnail(user.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setColor(0xFEE65C);

    const confirmButton = new ButtonBuilder()
      .setCustomId("confirm_ban")
      .setLabel("Confirmar")
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId("cancel_ban")
      .setLabel("Cancelar")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

    const msg = await message.channel.send({
      embeds: [embed],
      components: [row]
    });

    const collector = msg.createMessageComponentCollector({
      time: 15_000,
      max: 1
    });

    collector.on("collect", async interaction => {
      if (interaction.user.id !== message.author.id)
        return interaction.reply({ content: `${emojis.errado} Apenas quem usou o comando pode interagir com ele!`, ephemeral: true });

      if (interaction.customId === "confirm_ban") {
        try {
          await user.ban({ reason });

          // Registra no banco de dados
          const date = new Date().toISOString();
          db.get(`SELECT COUNT(*) AS count FROM modlogs WHERE guild_id = ?`, [message.guild.id], (err, row) => {
            if (err) return console.error("Erro ao contar cases:", err);

            const caseId = row.count + 1;

            db.run(
              `INSERT INTO modlogs (case_id, guild_id, user_id, user_tag, moderator_id, moderator_tag, type, reason, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                caseId,
                message.guild.id,
                user.id,
                user.user.tag,
                message.author.id,
                message.author.tag,
                "Ban",
                reason,
                date
              ],
              err => {
                if (err) console.error("Erro ao registrar modlog:", err);
              }
            );
          });

          await interaction.update({
            content: `<:Icon_Member_Kick:1358192756333350933> O usuário ${user} foi banido com sucesso.`,
            embeds: [],
            components: []
          });
        } catch (err) {
          console.error(err);
          await interaction.update({
            content: `${emojis.errado} Ocorreu um erro ao tentar banir o usuário.`,
            embeds: [],
            components: []
          });
        }
      } else {
        await interaction.update({
          content: `${emojis.errado} Banimento cancelado.`,
          embeds: [],
          components: []
        });
      }
    });

    collector.on("end", collected => {
      if (collected.size === 0) {
        msg.edit({
          content: `<:gray_tempo:1358519332384276551> Tempo expirado. Nenhuma ação foi tomada.`,
          embeds: [],
          components: []
        }).catch(() => {});
      }
    });
  }
};
