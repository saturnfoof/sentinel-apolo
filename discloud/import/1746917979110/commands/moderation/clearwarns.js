const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const db = require("../../database/db");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "clearwarns",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply(`${emojis.errado} Você não tem permissão para usar esse comando.`);
    }

    const userId = args[0]?.replace(/[<@!>]/g, "");
    if (!userId) return message.reply(`${emojis.errado} Mencione um usuário ou forneça o ID.`);

    const user = await message.guild.members.fetch(userId).catch(() => null);
    if (!user) return message.reply(`${emojis.errado} Usuário não encontrado.`);

    const caseId = args[1];

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("confirmar")
        .setLabel("Confirmar")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("cancelar")
        .setLabel("Cancelar")
        .setStyle(ButtonStyle.Secondary)
    );

    const avisoTipo = caseId ? `o aviso com ID \`${caseId}\`` : "todos os avisos";
    const msg = await message.reply({
      content: `Você realmente deseja apagar ${avisoTipo} de ${user}?`,
      components: [row]
    });

    const filtro = i => i.user.id === message.author.id;
    const coletor = msg.createMessageComponentCollector({ filter: filtro, time: 15000, max: 1 });

    coletor.on("collect", async interaction => {
      if (interaction.customId === "confirmar") {
        await interaction.deferUpdate();

        if (caseId) {
          db.get(
            `SELECT * FROM modlogs WHERE case_id = ? AND user_id = ? AND guild_id = ? AND type = 'WARN'`,
            [caseId, user.id, message.guild.id],
            (err, logRow) => {
              if (err) {
                console.error(err);
                return msg.edit({ content: `${emojis.errado} Erro ao acessar o banco de dados.`, components: [] });
              }

              if (!logRow) {
                return msg.edit({ content: `${emojis.errado} Nenhum aviso com esse ID foi encontrado para este usuário.`, components: [] });
              }

              db.run(
                `DELETE FROM warns WHERE user_id = ? AND guild_id = ? AND reason = ? AND moderator = ? AND date = ?`,
                [user.id, message.guild.id, logRow.reason, logRow.moderator_tag, logRow.date],
                function (err) {
                  if (err) {
                    console.error(err);
                    return msg.edit({ content: `${emojis.errado} Erro ao apagar o aviso.`, components: [] });
                  }

                  db.run(`DELETE FROM modlogs WHERE case_id = ?`, [caseId]);
                  msg.edit({ content: `${emojis.certo} O aviso com ID \`${caseId}\` de ${user} foi apagado com sucesso.`, components: [] });
                }
              );
            }
          );
        } else {
          db.run(
            `DELETE FROM warns WHERE user_id = ? AND guild_id = ?`,
            [user.id, message.guild.id],
            function (err) {
              if (err) {
                console.error(err);
                return msg.edit({ content: `${emojis.errado} Erro ao limpar os avisos.`, components: [] });
              }

              db.run(
                `DELETE FROM modlogs WHERE user_id = ? AND guild_id = ? AND type = 'WARN'`,
                [user.id, message.guild.id]
              );

              msg.edit({ content: `${emojis.certo} Todos os avisos de ${user} foram apagados com sucesso.`, components: [] });
            }
          );
        }
      } else {
        await interaction.update({ content: `${emojis.errado} Ação cancelada.`, components: [] });
      }
    });

    coletor.on("end", collected => {
      if (collected.size === 0) {
        msg.edit({ content: `${emojis.tempo} Tempo esgotado. Nenhuma ação foi tomada.`, components: [] });
      }
    });
  }
};
