const { PermissionFlagsBits } = require("discord.js");
const emojis = require("../../config/emojis.js");

module.exports = {
  name: "lock",
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply(`${emojis.errado} Você não tem permissão para usar esse comando.`);
    }

    const channel = message.mentions.channels.first() || message.channel;

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false
      });
      message.channel.send(`<:canal:1360296598655074534>O canal ${channel} foi trancado com sucesso.`);
    } catch (err) {
      console.error(err);
      message.reply(`${emojis.errado} Ocorreu um erro ao tentar trancar o canal.`);
    }
  }
};
