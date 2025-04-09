module.exports = {
    name: "ping",
    description: "Mostra a latência do bot.",
    
    async execute(message, args, client) {
      const msg = await message.channel.send("🏓 Pongando...");
      const latency = msg.createdTimestamp - message.createdTimestamp;
      const apiLatency = Math.round(client.ws.ping);
  
      msg.edit(`🏓 Pong! Latência: **${latency}ms**, API: **${apiLatency}ms**`);
    }
  };
  