import { Client, MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'GUILDS'
    ]
});

client.on('interactionCreate', (interaction) => {
    // Custom buttons & select
    new PagesBuilder(interaction)
        .setTitle('Global title')
        .setPages([
            new MessageEmbed()
                .setDescription('First page'),
            new MessageEmbed()
                .setDescription('Second page')
        ])
        .setComponents([
            new MessageActionRow()
                .setComponents(
                    new MessageButton()
                        .setCustomId('custom')
                        .setLabel('Custom button')
                        .setStyle('PRIMARY')
                )
        ])
        // You can add buttons/selects to the end of the list.
        // The library itself will find the component in which there is a place or create new for the element and add it.
        // Support array.
        .addComponents(
            new MessageButton()
                .setCustomId('awesome')
                .setLabel('Awesome button')
                .setStyle('SECONDARY')
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