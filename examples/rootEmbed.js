import { Client, MessageEmbed } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'GUILDS'
    ]
});

client.on('interactionCreate', (interaction) => {
    // PagesBuilder extends the MessageEmbed class, it inherits all of its methods and properties.
    // You can add new properties using methods.
    //
    // When you add properties in this way,
    // they will be prioritized and will replace/supplement the properties of the child MessageEmbed
    // that are set via the setPages/addPages method.
    new PagesBuilder(interaction)
        .setTitle('Global title')
        .setPages([
            new MessageEmbed()
                .setDescription('First page'),
            new MessageEmbed()
                .setDescription('Second page')
        ])
        .addField('Global field', 'discord.js-pages', true)
        .setColor('GREEN')
        .build();
});

client.login(process.env.TOKEN);