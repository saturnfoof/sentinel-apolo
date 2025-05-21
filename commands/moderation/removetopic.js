const { PermissionsBitField } = require("discord.js");
const emojis = require("../../config/emojis.js");

module.exports = {
    name: "removetopic",
    async execute(message, args) {
        // Verifica se a mensagem está em um tópico
        if (!message.channel.isThread()) {
            return message.reply(`${emojis.errado} Este comando só pode ser usado dentro de um tópico.`);
        }

        // Verifica permissão de gerenciamento de tópicos
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageThreads)) {
            return message.reply(`${emojis.errado} Você não tem permissão para gerenciar este tópico.`);
        }

        // Obtém o usuário mencionado
        const userId = args[0]?.replace(/[<@!>]/g, "");
        const user = message.mentions.members.first() || await message.guild.members.fetch(userId).catch(() => null);

        if (!user) {
            return message.reply(`${emojis.errado} Mencione um usuário válido ou forneça o ID corretamente.`);
        }

        try {
            // Remove o usuário do tópico
            await message.channel.members.remove(user.id);
            message.reply(`${emojis.certo} ${user} foi removido do tópico com sucesso.`);
        } catch (err) {
            console.error("Erro ao remover usuário do tópico:", err);
            message.reply(`${emojis.errado} Não foi possível remover o usuário do tópico. Verifique minhas permissões.`);
        }
    }
};
