const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('secret')
        .setDescription('Provides secret information.'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        if (interaction.guild.memberCount == 3) {
            await interaction.reply({ content: `Except you and me , ${interaction.guild.name} only has one idiot 😜`, ephemeral: true });
        }
        else if (interaction.guild.memberCount < 3) {
            await interaction.reply({ content: `Unfortunately , there are no other idiots in this group. Go make invite other people 🥲`, ephemeral: true });
        }
        else {
            await interaction.reply({ content: `Except you and me ,  ${interaction.guild.name} only has ${interaction.guild.memberCount} idiot 😜`, ephemeral: true });
        }
    },
};
