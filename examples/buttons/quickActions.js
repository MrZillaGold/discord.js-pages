import { Client, MessageEmbed, MessageButton } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'GUILDS'
    ]
});

client.on('interactionCreate', (interaction) => {
    // Quick actions
    new PagesBuilder(interaction)
        .setTitle('Global title')
        .setPages([
            new MessageEmbed()
                .setDescription('First page'),
            new MessageEmbed()
                .setDescription('Second page')
        ])
        // Add buttons with quick pagination actions, also you can customize it.
        // There is no need to set customId, the library does it for you.
        .setDefaultButtons(['first', {
            stop: new MessageButton()
                .setLabel('Stop')
                .setStyle('PRIMARY')
        }])
        .build();
});

client.login(process.env.TOKEN);