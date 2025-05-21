const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unlock",
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply("<:Icon_SystemMessageCross:1358195382022045857> Você não tem permissão para usar esse comando.");
    }

    const channel = message.mentions.channels.first() || message.channel;

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: true
      });
      message.channel.send(`${emojis.certo} O canal ${channel} foi destrancado com sucesso.`);
    } catch (err) {
      console.error(err);
      message.reply("<:Icon_SystemMessageCross:1358195382022045857> Ocorreu um erro ao tentar destrancar o canal.");
    }
  }
};
