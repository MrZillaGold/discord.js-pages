const { Client, MessageEmbed } = require("discord.js");
const { PagesManager } = require("discord.js-pages");

const client = new Client();
const pagesManager = new PagesManager();

client.on("message", (message) => {
    pagesManager.middleware(message);
    // Middleware is useful in bots with modular commands
    message.pagesBuilder()
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
