import { Client, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'Guilds'
    ]
});

client.on('interactionCreate', (interaction) => {
    const link = new ButtonBuilder()
        .setLabel('Dynamic link')
        .setStyle(ButtonStyle.Link);

    // Dynamic buttons update
    const builder = new PagesBuilder(interaction)
        .setTitle('Global title');

    builder.setPages([
        () => {
            link.setURL('https://google.com/');

            builder.setComponents(
                new ActionRowBuilder()
                    .addComponents(link)
            );

            return new EmbedBuilder()
                .setDescription('First page');
        },
        () => {
            link.setURL('https://discord.com/');

            builder.setComponents(
                new ActionRowBuilder()
                    .addComponents(link)
            );

            return new EmbedBuilder()
                .setDescription('Second page');
        }
    ]);
});

client.login(process.env.TOKEN);
