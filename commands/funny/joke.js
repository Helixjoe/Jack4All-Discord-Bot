const { SlashCommandBuilder } = require('discord.js');
const baseURL = "https://v2.jokeapi.dev";
const categories = ["Programming", "Misc", "Pun", "Spooky", "Christmas"];
const params = [
    "blacklistFlags=nsfw,religious,racist",
    "idRange=0-100"
];
const https = require('https');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Provides a joke.')
    // .addStringOption(option =>
    //     option.setName('input')
    //         .setDescription('The input to echo back'))
    ,
    async execute(interaction) {
        https.get(`${baseURL}/joke/${categories.join(",")}?${params.join("&")}`, res => {
            console.log("\n");
            res.on("data", async chunk => {
                let randomJoke = JSON.parse(chunk.toString());
                console.log(randomJoke);
                if (randomJoke.type == "single") {
                    await interaction.reply(randomJoke.joke);
                }
                else {
                    await interaction.reply(randomJoke.setup);
                    setTimeout(async () => {
                        await interaction.channel.send(randomJoke.delivery);
                    }, 3000);
                }
            });

            res.on("error", err => {
                console.error(`Error: ${err}`);
            });

        });
    }
};