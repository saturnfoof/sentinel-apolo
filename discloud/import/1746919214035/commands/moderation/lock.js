const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "lock",
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Você não tem permissão para usar esse comando.");
    }

    const channel = message.mentions.channels.first() || message.channel;

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false
      });
      message.channel.send(`<:canal:1360296598655074534>O canal ${channel} foi trancado com sucesso.`);
    } catch (err) {
      console.error(err);
      message.reply("<:Icon_SystemMessageCross:1358195382022045857> Ocorreu um erro ao tentar trancar o canal.");
    }
  }
};
