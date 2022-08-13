import { Client, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'Guilds'
    ]
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    // Custom buttons & select
    new PagesBuilder(interaction)
        .setTitle('Global title')
        .setPages([
            new EmbedBuilder()
                .setDescription('First page'),
            new EmbedBuilder()
                .setDescription('Second page')
        ])
        .setComponents([
            new ActionRowBuilder()
                .setComponents(
                    new ButtonBuilder()
                        .setCustomId('custom')
                        .setLabel('Custom button')
                        .setStyle(ButtonStyle.Primary)
                )
        ])
        // You can add buttons/selects to the end of the list.
        // The library itself will find the component in which there is a place or create new for the element and add it.
        // Support array.
        .addComponents(
            new ButtonBuilder()
                .setCustomId('awesome')
                .setLabel('Awesome button')
                .setStyle(ButtonStyle.Secondary)
        )
        // Add triggers for handling interactions with buttons/selects.
        // Support array.
        .setTriggers({
            name: 'custom',
            callback(interactionCallback, button) {
                button.setDisabled(true);

                interaction.followUp({
                    content: 'Custom button callback!'
                });
            }
        })
        .addTriggers({
            name: 'awesome',
            callback(interactionCallback, button) {
                button.setDisabled(true)
                    .setLabel('¯\\_(ツ)_/¯');

                interaction.followUp({
                    content: 'Awesome button callback!'
                });
            }
        })
        .build();
});

client.login(process.env.TOKEN);
