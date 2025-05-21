const { EmbedBuilder } = require('discord.js'); 

module.exports = {
    name: 'webhook',
    description: 'Envia uma embed com informações sobre venda de unban',
    async execute(message, args) {

        const embed = new EmbedBuilder()
            .setColor(16705372)
            .setTitle("Venda de unban <:apolo_money:1112025333949026304>")
            .setDescription(`
                Atualmente, contamos com alguns métodos para que um usuário seja desbanido, sendo um deles, a **venda de unban**. E nessa postagem, irão ser retratados os valores e casos que o unban não é possível de ser vendidos;

                **Motivos que o unban é vendido** <:apolo_money:1112025333949026304>
                - **Evasão de banimento (do bot)**  
                  **Valor:** 40$ por conta  
                - **Uso de contas alternativas**  
                  **Valor:** 35$ por conta  
                - **Comércio de raios**  
                  **Valor:** Definido de acordo com o valor da loja  
                - **Calote de vip x raios**  
                  **Valor:** Definido conforme o valor do vip  

                **Motivos de ban que não são vendidos** <:apolo_raiva:1112025840553820251>
                - Quebra de ToS;
                - Troca de raios ou vips por itens com valor monetário;
                - Calotes em excesso;
                - Racismo, preconceito, homofobia e afins;

                **Para onde o dinheiro deve ser enviado?**
                O valor de todas vendas deve ser enviado apenas para a respectiva chave-pix: **sac@panitech.com.br**
            `)
            .setFooter({ text: "Caso você solicite que o usuário envie o dinheiro para você sem autorização, de acordo com as regras, você será desligado de suas funções na staff." });

        try {
            await message.channel.send({ embeds: [embed] });
            await message.reply('✅ Mensagem enviada com sucesso!');
        } catch (error) {
            console.error(error);
            await message.reply('❌ Ocorreu um erro ao enviar a mensagem.');
        }
    }
};
