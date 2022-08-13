import { Client, ButtonBuilder, ButtonStyle, SelectMenuBuilder, EmbedBuilder, ActionRowBuilder } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'Guilds'
    ]
});

const players = ['MrZillaGold', 'Twennnn'];

client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    let selected = [];

    const generateOptions = () => (
        players.map((player) => ({
            label: player,
            value: player,
            default: selected.includes(player)
        }))
    );

    const sendListButton = new ButtonBuilder()
        .setCustomId('send')
        .setLabel('Send Players List')
        .setStyle(ButtonStyle.Primary);

    const builder = new PagesBuilder(interaction)
        .setTitle('Global title')
        .setDefaultButtons([]);

    builder.setPages([
        () => {
            sendListButton.setDisabled(!selected.length);

            builder.setComponents([
                new ActionRowBuilder()
                    .setComponents(
                        new SelectMenuBuilder()
                            .setCustomId('players')
                            .setPlaceholder('Select Players')
                            .setOptions(
                                generateOptions()
                            )
                            .setMaxValues(players.length)
                    ),
                new ActionRowBuilder()
                    .setComponents(sendListButton)
            ]);

            return new EmbedBuilder()
                .setDescription(`Your selection: ${selected}`);
        }
    ])
        .setTriggers([
            {
                name: 'players',
                callback({ values }) {
                    selected = values;

                    builder.rerender();
                }
            },
            {
                name: 'send',
                callback() {
                    interaction.followUp(`Your selection: ${selected}`);
                }
            }
        ]);

    builder.build();
});

client.login(process.env.TOKEN);
