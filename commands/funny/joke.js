const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const baseURL = "https://v2.jokeapi.dev";
const params = [
    "blacklistFlags=nsfw,religious,racist",
    "idRange=0-100"
];
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
                )),
    // .addStringOption(option =>
    //     option.setName('input')
    //         .setDescription('The input to echo back'))

    async execute(interaction) {
        const category = interaction.options.getString("category");
        https.get(`${baseURL}/joke/${category}?${params.join("&")}`, res => {
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