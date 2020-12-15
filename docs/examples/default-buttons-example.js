const { Client, MessageEmbed } = require("discord.js");
const { PagesBuilder } = require("discord.js-pages");

const client = new Client();

client.on("message", (message) => {
    new PagesBuilder(message)
        .setPages([
            new MessageEmbed()
                .setDescription("First page"),
            new MessageEmbed()
                .setDescription("Second page")
        ])
        .setDefaultButtons(["back", "stop", { "next": "👉" }])
        .build();
});

client.login(process.env.TOKEN);
