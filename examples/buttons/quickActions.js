import { Client, EmbedBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'Guilds'
    ]
});

client.on('interactionCreate', (interaction) => {
    // Quick actions
    new PagesBuilder(interaction)
        .setTitle('Global title')
        .setPages([
            new EmbedBuilder()
                .setDescription('First page'),
            new EmbedBuilder()
                .setDescription('Second page')
        ])
        // Add buttons with quick pagination actions, also you can customize it.
        // There is no need to set customId, the library does it for you.
        .setDefaultButtons(['first', {
            stop: new ButtonBuilder()
                .setLabel('Stop')
                .setStyle(ButtonStyle.Primary)
        }])
        .build();
});

client.login(process.env.TOKEN);
