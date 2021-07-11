const { Client, MessageEmbed } = require("discord.js");
const { PagesBuilder } = require("discord.js-pages");

const client = new Client();

client.on("message", (message) => {
    if (message.author.bot) {
        return;
    }

    new PagesBuilder({ message })
        .setTitle("Global title")
        .setPages([
            new MessageEmbed()
                .setDescription("First page")
                .addField("Page field", "Hello world!", true)
                .setFooter("Page footer"),
            new MessageEmbed()
                .setDescription("Second page"),
            new MessageEmbed()
                .setDescription("Third page")
        ])
        .addTriggers([{
            emoji: "📌",
            callback: () => {
                message.channel.send("📌 Custom trigger");
            }
        }])
        .addField("Global field", "discord.js-pages", true)
        .setImage("https://discord.com/assets/ff41b628a47ef3141164bfedb04fb220.png")
        .setColor("GREEN")
        .build();
});

client.login(process.env.TOKEN);
