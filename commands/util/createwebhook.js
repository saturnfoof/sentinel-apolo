const { WebhookClient, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "createwebhook",
    description: "Cria um webhook para a thread atual.",

    async execute(message, args, client) {
        const prefix = "s!";
        if (!message.content.startsWith(`${prefix}createwebhook`)) return;

        if (!message.channel.isThread()) {
            return message.reply("❌ Este comando só pode ser usado em uma thread de fórum.");
        }

        const thread = message.channel;
        const forumChannel = thread.parent;

        if (!forumChannel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.ManageWebhooks)) {
            return message.reply("❌ Eu não tenho permissão para gerenciar webhooks neste canal.");
        }

        try {
            const webhook = await forumChannel.createWebhook({
                name: "Webhook da Thread",
                avatar: client.user.displayAvatarURL(),
            });

            const webhookUrl = `${webhook.url}?thread_id=${thread.id}`;

            return message.reply(`✅ Webhook criado com sucesso! Aqui está o link: ${webhookUrl}`);
        } catch (error) {
            console.error(error);
            return message.reply("❌ Ocorreu um erro ao criar o webhook.");
        }
    }
};
