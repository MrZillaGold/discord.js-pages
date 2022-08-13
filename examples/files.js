import { Client,  AttachmentBuilder, EmbedBuilder  } from 'discord.js';
import { PagesBuilder } from 'discord.js-pages';

const client = new Client({
    intents: [
        'Guilds'
    ]
});

client.on('interactionCreate', (interaction) => {
    // To start using the files, you must add them to PagesBuilder, after adding you can use them on each page.
    if (!interaction.isCommand()) {
        return;
    }

    new PagesBuilder(interaction)
        .setPages([
            new EmbedBuilder()
                .setDescription('First page')
                .setThumbnail('attachment://discord.png'),
            new EmbedBuilder()
                .setDescription('Second page')
        ])
        // Supports array.
        .setFiles(
            new AttachmentBuilder(
                'test.png',
                {
                    name: 'discord.png'
                }
            )
        )
        .build();
});

client.login(process.env.TOKEN);
