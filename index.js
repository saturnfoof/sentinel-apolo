const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// Carregar comandos de todas as subpastas em "commands"
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach(folder => {
  const folderPath = path.join(commandsPath, folder);
  fs.readdirSync(folderPath).forEach(file => {
    if (file.endsWith(".js")) {
      const command = require(path.join(folderPath, file));
      if (command.name && typeof command.execute === "function") {
        client.commands.set(command.name, command);
      }
    }
  });
});

// Detectar mensagens
client.on("messageCreate", async message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply("Ocorreu um erro ao executar esse comando.");
  }
});

// Iniciar o bot
client.login(config.token);
