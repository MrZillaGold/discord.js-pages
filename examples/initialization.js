import { Client, MessageEmbed } from 'discord.js';
import { PagesBuilder, PagesManager } from 'discord.js-pages';

const client = new Client({
    intents: [
        'GUILDS'
    ]
});

const pagesManager = new PagesManager();

// Middleware is useful in bots with modular commands
client.on('interactionCreate', (interaction) => {
    pagesManager.middleware(interaction);

    interaction.pagesBuilder()
        .setTitle('Global title')
        .setPages([
            new MessageEmbed()
                .setDescription('First page'),
            new MessageEmbed()
                .setDescription('Second page')
        ])
        .addField('Global field', 'discord.js-pages', true)
        .setColor('GREEN')
        .build();
});

// Also you can create PagesBuilder instance directly
client.on('interactionCreate', (interaction) => {
    new PagesBuilder(interaction)
        .setTitle('Global title')
        .setPages([
            new MessageEmbed()
                .setDescription('First page'),
            new MessageEmbed()
                .setDescription('Second page')
        ])
        .addField('Global field', 'discord.js-pages', true)
        .setColor('GREEN')
        .build();
});

client.login(process.env.TOKEN);