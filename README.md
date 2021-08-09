<h1 align="center">
    <b>discord.js-pages</b>
</h1>
<p align="center">
  📦 Dynamic pages pagination module for <a href="https://github.com/discordjs/discord.js">discord.js</a>
  <br>
  <br>
  <a href="https://npmjs.com/package/discord.js-pages">
    <img src="https://badge.fury.io/js/discord.js-pages.svg" alt="npm version" height="18">
  </a>

| 📖 [Documentation](https://mrzillagold.github.io/discord.js-pages/index.html) | [🤖 Examples](https://github.com/MrZillaGold/discord.js-pages/tree/master/examples) |
| --- | --- |

</p>

### Install 📦
`npm i discord.js-pages`

### Usage 📦
```js
import { PagesBuilder, PagesManager } from 'discord.js-pages';
import { Client, MessageEmbed } from 'discord.js';

const client = new Client({
    intents: [
        'GUILDS'
    ]
});

const pagesManager = new PagesManager();

// Middleware is useful in bots with modular commands
client.on('interactionCreate', (interaction) => {
    pagesManager.middleware(interaction);

    message.pagesBuilder()
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

client.on('interactionCreate', (interaction) => {
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
```

### Demo 🎥
<img src="https://github.com/MrZillaGold/discord.js-pages/raw/master/.github/demo.gif" height="500">
