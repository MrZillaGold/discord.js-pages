# Pages
<dl>
<dt><a href="#setPages">setPages(pages)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for initial pages setup</p></dd>

<dt><a href="#addPages">addPages(pages)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for adding pages to the end</p></dd>

<dt><a href="#setPage">setPage(pageNumber)</a> ⇒ <code>Promise<<a href="https://discord.js.org/#/docs/main/stable/class/Message">Message</a>></code>;</dt>
<dd><p>Method for opening a specific page</p></dd>

<dt><a href="#getPage">getPage(pageNumber)</a> ⇒ <code>Promise<<a href="https://discord.js.org/#/docs/main/stable/class/MessageEmbed">MessageEmbed</a>></code>;</dt>
<dd><p>Method for getting the page</p></dd>

<dt><a href="#setPagesNumberFormat">setPagesNumberFormat(format)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for setting the pagination format</p></dd>

<dt><a href="#setInfinityLoop">setInfinityLoop(status)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for setting endless page switching when reaching the end</p></dd>

<dt><a href="#setDefaultButtons">setDefaultButtons(buttons)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for setting default buttons</p></dd>

<dt><a href="#build">build()</a> ⇒ <code>Promise<<a href="https://discord.js.org/#/docs/main/stable/class/Message">Message</a>|Error></code>;</dt>
<dd><p>Method for build and send pages</p></dd>
</dl>

💡 PagesBuilder also support all methods of the [MessageEmbed](https://discord.js.org/#/docs/main/stable/class/MessageEmbed) class, when used, priority will be given to the root Embed.

**Example**:
```js
const builder = message.pagesBuilder();

builder.setColor("RED");
```

<a name="setPages"></a>

## setPages(pages) ⇒ <code>PagesBuilder</code>;
Method for initial pages setup

**Returns**: `PagesBuilder`

| Params | Type                                                                                                                      | Description     |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | --------------- |
| pages  | `Array[function, MessageEmbed]` `function` [`MessageEmbed`](https://discord.js.org/#/docs/main/stable/class/MessageEmbed) | Pages for setup |

**Example**:

```js
const builder = message.pagesBuilder();

builder.setPages(
    new MessageEmbed()
        .setDescription("Test page")
);
builder.setPages([
    new MessageEmbed()
        .setDescription("Test page")
]);
builder.setPages(async () => {
    const data = await Promise((resolve) => {
        setTimeout(() => resolve("Some data"), 4000);
    });

    return new MessageEmbed()
        .setDescription(data);
});
```

<a name="addPages"></a>

## addPages(pages) ⇒ <code>PagesBuilder</code>;
Method for adding pages to the end

**Returns**: `PagesBuilder`

| Params | Type                                                                                                                      | Description  |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | ------------ |
| pages  | `Array[function, MessageEmbed]` `function` [`MessageEmbed`](https://discord.js.org/#/docs/main/stable/class/MessageEmbed) | Pages to add |

**Example**:

```js
const builder = message.pagesBuilder();

builder.addPages(
    new MessageEmbed()
        .setDescription("Test page")
);
```

<a name="setPage"></a>

## setPage(pageNumber) ⇒ <code>Promise<<a href="https://discord.js.org/#/docs/main/stable/class/Message">Message</a>></code>;
Method for opening a specific page

**Returns**: <code>Promise<<a href="https://discord.js.org/#/docs/main/stable/class/Message">Message</a>></code>

| Params      | Type     | Description |
| ----------- | -------- | ----------- |
| pageNumber  | `number` | Page number |

**Example**:

```js
const builder = message.pagesBuilder()
    .build();

builder.setPage(2);
```

<a name="getPage"></a>

## getPage(pageNumber) ⇒ <code>Promise<<a href="https://discord.js.org/#/docs/main/stable/class/MessageEmbed">MessageEmbed</a>></code>;
Method for getting the page

**Returns**: <code>Promise<<a href="https://discord.js.org/#/docs/main/stable/class/MessageEmbed">MessageEmbed</a>></code>

| Params      | Type     | Default      |  Description |
| ----------- | -------- | ------------ | ----------- |
| pageNumber  | `number` | Current page | Page number |

**Example**:

```js
const builder = message.pagesBuilder();

builder.getPage(2);
```

<a name="setPagesNumberFormat"></a>

## setPagesNumberFormat(format) ⇒ <code>PagesBuilder</code>;
Method for setting the pagination format

**Returns**: `PagesBuilder`

| Params  | Type     | Default     | Description       |
| ------- | -------- | ----------- | ----------------- |
| format  | `string` | `"%c / %m"` | Pagination format |

**Example**:

```js
const builder = message.pagesBuilder();

builder.setPagesNumberFormat("Current page: %c");
```

<a name="setInfinityLoop"></a>

## setInfinityLoop(status) ⇒ <code>PagesBuilder</code>;
Method for setting endless page switching when reaching the end

**Returns**: `PagesBuilder`

| Params  | Type      | Default | Description                               |
| ------- | --------- | ------- | ----------------------------------------- |
| status  | `boolean` | `true`  | Value for endless switching between pages |

**Example**:

```js
const builder = message.pagesBuilder();

builder.setInfinityLoop(false);
```

<a name="setDefaultButtons"></a>

## setDefaultButtons(buttons) ⇒ <code>PagesBuilder</code>;
Method for setting default buttons

**Returns**: `PagesBuilder`

| Params   | Type                                                                                                                                                                                                                                     | Default                                      | Description     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------- |
| buttons  | `["first", "back", "stop", "next", "last"]` `[{"first": EmojiIdentifierResolvable}, {"back": EmojiIdentifierResolvable}, {"stop": EmojiIdentifierResolvable}, {"next": EmojiIdentifierResolvable}, {"last": EmojiIdentifierResolvable}]` | `["first", "back", "stop", "next", "last"]`  | Default buttons |

**Example**:

```js
const builder = message.pagesBuilder();

builder.setDefaultButtons(["first", "last"]);
```

<a name="build"></a>

## build() ⇒ <code>Promise<<a href="https://discord.js.org/#/docs/main/stable/class/Message">Message</a>|Error></code>;
Method for build and send pages

**Returns**: <code>Promise<<a href="https://discord.js.org/#/docs/main/stable/class/Message">Message</a>|Error></code>

**Example**:

```js
const builder = message.pagesBuilder();

builder.build();
```
