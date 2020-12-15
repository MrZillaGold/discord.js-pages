const { Client, MessageEmbed } = require("discord.js");
const { PagesBuilder } = require("discord.js-pages");

const client = new Client();

client.on("message", (message) => {
    new PagesBuilder(message)
        .setTitle("Global title")
        .setPages([
            new MessageEmbed()
                .setDescription("First page"),
            new MessageEmbed()
                .setDescription("Second page")
        ])
        .addField("Global field", "discord.js-pages", true)
        .setColor("GREEN")
        .build();
});

client.login(process.env.TOKEN);
