const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  async execute(message, args, client) {
    const categories = fs.readdirSync(path.join(__dirname, "..")).filter(file =>
      fs.statSync(path.join(__dirname, "..", file)).isDirectory()
    );

    const friendlyNames = {
      util: "Utilitários",
      info: "Informações",
      moderation: "Moderação"
    };

    const menu = new StringSelectMenuBuilder()
      .setCustomId("help-menu")
      .setPlaceholder("Escolha uma categoria")
      .addOptions(
        categories.map(category => ({
          label: friendlyNames[category] || category.charAt(0).toUpperCase() + category.slice(1),
          value: category
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);

    const embed = new EmbedBuilder()
      .setTitle("<:lista:1358845681086759042> Lista de comandos")
      .setDescription("Use o menu abaixo para selecionar uma categoria de comandos.")
      .setColor(0x5865F2)
      .setFooter({ text: "Sentinel • Administração com excelência" });

    const sentMsg = await message.channel.send({ embeds: [embed], components: [row] });

    const collector = sentMsg.createMessageComponentCollector({
      componentType: 3,
      time: 60_000
    });

    collector.on("collect", async interaction => {
      if (interaction.user.id !== message.author.id)
        return interaction.reply({ content: "Apenas quem usou o comando pode interagir com esse menu.", ephemeral: true });

      const selectedCategory = interaction.values[0];
      const commandsPath = path.join(__dirname, "..", selectedCategory);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

      const commandList = commandFiles.map(file => {
        const command = require(path.join(commandsPath, file));
        return `\`s!${command.name}\``;
      });

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`📂 Categoria: ${friendlyNames[selectedCategory] || selectedCategory}`)
        .setDescription(commandList.join("\n") || "Nenhum comando encontrado.")
        .setColor(0x5865F2)
        .setFooter({ text: "Sentinel • Administração com excelência" });

      await interaction.update({ embeds: [categoryEmbed], components: [row] });
    });

    collector.on("end", () => {
      sentMsg.edit({ components: [] }).catch(() => {});
    });
  }
};
