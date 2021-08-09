import { Client, MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'GUILDS'
    ]
});

client.on('interactionCreate', (interaction) => {
    const link = new MessageButton()
        .setLabel('Dynamic link')
        .setStyle('LINK');

    // Dynamic buttons update
    const builder = new PagesBuilder(interaction)
        .setTitle('Global title');

    builder.setPages([
        () => {
            link.setURL('https://google.com/');

            builder.setComponents(
                new MessageActionRow()
                    .addComponents(link)
            );

            return new MessageEmbed()
                .setDescription('First page');
        },
        () => {
            link.setURL('https://discord.com/');

            builder.setComponents(
                new MessageActionRow()
                    .addComponents(link)
            );

            return new MessageEmbed()
                .setDescription('Second page');
        }
    ]);
});

client.login(process.env.TOKEN);