import { Client, EmbedBuilder } from 'discord.js';
import { PagesBuilder, PagesManager } from 'discord.js-pages';

const client = new Client({
    intents: [
        'Guilds'
    ]
});

const pagesManager = new PagesManager();

// Middleware is useful in bots with modular commands
client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    pagesManager.middleware(interaction);

    interaction.pagesBuilder()
        .setTitle('Global title')
        .setPages([
            new EmbedBuilder()
                .setDescription('First page'),
            new EmbedBuilder()
                .setDescription('Second page')
        ])
        .addFields([
            {
                name: 'Global field',
                value: 'discord.js-pages',
                inline: true
            }
        ])
        .setColor('Green')
        .setPaginationFormat()
        .build();
});

// Also you can create PagesBuilder instance directly
client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    new PagesBuilder(interaction)
        .setTitle('Global title')
        .setPages([
            new EmbedBuilder()
                .setDescription('First page'),
            new EmbedBuilder()
                .setDescription('Second page')
        ])
        .addFields([
            {
                name: 'Global field',
                value: 'discord.js-pages',
                inline: true
            }
        ])
        .setColor('Green')
        .build();
});

client.login(process.env.TOKEN);
