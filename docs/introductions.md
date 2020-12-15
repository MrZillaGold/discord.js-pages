# Introduction
### Install 📦
`npm i vk-io-pages`

### Documentation 📖
| 📖 [Methods](methods.md) | 🤖 [Examples](examples) |
| ------------------------ | ---------------------- |

### Usage 📦
#### Middleware

Middleware is useful in bots with modular commands

```js
import { PagesManager } from "discord.js-pages"; // ESM
// OR
const { PagesManager } = require("discord.js-pages"); // CommonJS

const { Client, MessageEmbed } = require("discord.js");

const client = new Client();
const pagesManager = new PagesManager();

client.on("message", (message) => {
    pagesManager.middleware(message);

    message.pagesBuilder()
        .setTitle("Global title")
        .setPages([
            new MessageEmbed()
                .setDescription("First page"),
            new MessageEmbed()
                .setDescription("Second page")
        ])
        .addField("Global field", "discord.js-pages", true)
        .setColor("GREEN")
        .build();
});

client.login(process.env.TOKEN);
```

#### Class

```js
import { PagesBuilder } from "discord.js-pages"; // ESM
// OR
const { PagesBuilder } = require("discord.js-pages"); // CommonJS

const { Client, MessageEmbed } = require("discord.js");

const client = new Client();

client.on("message", (message) => {
    new PagesBuilder(message)
        .setTitle("Global title")
        .setPages([
            new MessageEmbed()
                .setDescription("First page"),
            new MessageEmbed()
                .setDescription("Second page")
        ])
        .addField("Global field", "discord.js-pages", true)
        .setColor("GREEN")
        .build();
});

client.login(process.env.TOKEN);
```
