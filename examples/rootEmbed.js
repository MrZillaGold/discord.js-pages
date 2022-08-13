import { Client, EmbedBuilder } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'GUILDS'
    ]
});

client.on('interactionCreate', (interaction) => {
    /*
    PagesBuilder extends the MessageEmbed class, it inherits all of its methods and properties.
    You can add new properties using methods.

    When you add properties in this way,
    they will be prioritized and will replace/supplement the properties of the child MessageEmbed
    that are set via the setPages/addPages method.
    */
    new PagesBuilder(interaction)
        .setTitle('Global title')
        .setPages([
            new EmbedBuilder()
                .setDescription('First page'),
            new EmbedBuilder()
                .setDescription('Second page')
                .addFields([
                    {
                        name: 'Page field',
                        value: 'Page field',
                        inline: true
                    }
                ])
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
