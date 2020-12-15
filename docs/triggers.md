# Triggers
<dl>
<dt><a href="#setTriggers">setTriggers(triggers)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for initial setting of triggers</p></dd>

<dt><a href="#addTriggers">addTriggers(triggers)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for adding triggers</p></dd>
</dl>

<a name="setTriggers"></a>

## setTriggers(triggers) ⇒ <code>PagesBuilder</code>;
Method for initial setting of triggers

**Returns**: `PagesBuilder`

| Params   | Type                                                                                                                | Description |
| -------- | ------------------------------------------------------------------------------------------------------------------- | ----------- |
| triggers | `[Trigger]` [`Trigger`](https://github.com/MrZillaGold/discord.js-pages/blob/master/src/PagesBuilder.mjs#L283-L288) | Triggers    |

**Example**:

```js
const builder = message.pagesBuilder();

builder.setTriggers({ 
    emoji: "📌",
    callback: () => console.log("📌 Trigger executed")
});
builder.setTriggers([
    {
        emoji: "👌",
        callback: () => console.log("👌 Trigger executed")
    }
]);
```

<a name="addTriggers"></a>

## addTriggers(triggers) ⇒ <code>PagesBuilder</code>;
Method for initial setting of triggers

**Returns**: `PagesBuilder`

| Params   | Type                                                                                                                | Description |
| -------- | ------------------------------------------------------------------------------------------------------------------- | ----------- |
| triggers | `[Trigger]` [`Trigger`](https://github.com/MrZillaGold/discord.js-pages/blob/master/src/PagesBuilder.mjs#L283-L288) | Triggers    |
