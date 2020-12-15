const { Client, MessageEmbed } = require("discord.js");
const { PagesBuilder } = require("discord.js-pages");

const client = new Client();

client.on("message", (message) => {
    const builder = new PagesBuilder(message)
        .setTitle("Global title")
        .setPages([
            new MessageEmbed()
                .setDescription("First page"),
            new MessageEmbed()
                .setDescription("Second page")
        ]);

    builder.setTriggers([
        {
            emoji: "📌",
            callback: () => {
                message.channel.send("Stopping listen...");

                return builder.stopListen();
            }
        }
    ]);

    builder.build();
});

client.login(process.env.TOKEN);
