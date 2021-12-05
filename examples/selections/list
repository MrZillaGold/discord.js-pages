import { Client, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'GUILDS'
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

    const sendListButton = new MessageButton()
        .setCustomId('send')
        .setLabel('Send Players List')
        .setStyle('PRIMARY');

    const builder = new PagesBuilder(interaction)
        .setTitle('Global title')
        .setDefaultButtons([]);

    builder.setPages([
        () => {
            sendListButton.setDisabled(!selected.length);

            builder.setComponents([
                new MessageActionRow()
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId('players')
                            .setPlaceholder('Select Players')
                            .setOptions(
                                generateOptions()
                            )
                            .setMaxValues(players.length)
                    ),
                new MessageActionRow()
                    .setComponents(sendListButton)
            ]);

            return new MessageEmbed()
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
