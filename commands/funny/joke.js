const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Provides a joke.')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The joke category')
                .setRequired(true)
                .addChoices(
                    { name: 'Any 🤪', value: 'Any' },
                    { name: 'Programming 🤖', value: 'Programming' },
                    { name: 'Misc 😂', value: 'Misc' },
                    { name: 'Pun 😆', value: 'Pun' },
                    { name: 'Dark 💀', value: 'Dark' },
                ))
        .addIntegerOption(option =>
            option.setName('restrict')
                .setDescription('Type of jokes to be removed')
                .setRequired(true)
                .addChoices(
                    { name: 'Restrict nsfw, religious, political, racist, sexist, explicit ', value: 6 },
                    { name: 'Restrict religious, political, racist, sexist, explicit ', value: 5 },
                    { name: 'Restrict political, racist, sexist, explicit ', value: 4 },
                    { name: 'Restrict racist, sexist, explicit ', value: 3 },
                    { name: 'Restrict sexist, explicit ', value: 2 },
                    { name: 'Restrict explicit ', value: 1 },
                    { name: 'No Restrictions 😈', value: 0 }
                )),

    async execute(interaction) {
        const baseURL = "https://v2.jokeapi.dev";
        const category = interaction.options.getString("category");
        const choiceValue = interaction.options.getInteger("restrict");
        const backList = ['nsfw', 'religious', 'political', 'racist', 'sexist', 'explicit'];
        const bListChoices = [];
        let param;
        for (let i = 0; i < choiceValue; i++) {
            if (choiceValue === 1) {
                bListChoices.push(backList[i]);
            }
            else if (choiceValue > 1) {
                bListChoices.push(backList[i] + ",");
            }
        }
        if (bListChoices.length === 0) {
            param = 'blacklistFlags=""';
        }
        else {
            param = 'blacklistFlags="' + bListChoices.join('') + '"';
        }
        https.get(`${baseURL}/joke/${category}?${param}`, res => {
            console.log("\n");
            res.on("data", async chunk => {
                let randomJoke = JSON.parse(chunk.toString());
                if (randomJoke.type == "single") {
                    const embed = new EmbedBuilder()
                        .setTitle(randomJoke.joke).setColor("#000066");
                    await interaction.reply({ embeds: [embed] });
                }
                else {
                    const embedSetup = new EmbedBuilder()
                        .setTitle(randomJoke.setup)
                        .setColor("#000066");
                    await interaction.reply({ embeds: [embedSetup] });
                    const embedDrum = new EmbedBuilder()
                        .setTitle("🥁")
                        .setColor("#cc0000");
                    setTimeout(async () => {
                        await interaction.channel.send({ embeds: [embedDrum] });
                    }, 1000);
                    const embedDelivery = new EmbedBuilder()
                        .setTitle(randomJoke.delivery).setColor("#009933");
                    setTimeout(async () => {
                        await interaction.channel.send({ embeds: [embedDelivery] });
                    }, 3500);
                }
            });

            res.on("error", err => {
                console.error(`Error: ${err}`);
            });
        });
    }
};