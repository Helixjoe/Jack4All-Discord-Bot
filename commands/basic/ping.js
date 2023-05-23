const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Current Ping value of User!'),
    async execute(interaction) {
        if (interaction.commandName === 'ping') {
            const userPing = Math.round(interaction.user.client.ws.ping);
            await interaction.reply(`Your ping is ${userPing}ms.`);
        }
    }
};