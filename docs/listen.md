# Listen
<dl>
<dt><a href="#setListenTime">setListenTime(time)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for setting the time to listen for updates to switch pages</p></dd>

<dt><a href="#resetListenTimeout">resetListenTimeout()</a>;</dt>
<dd><p>Method for resetting the current listening timer</p></dd>

<dt><a href="#setListenEndColor">setListenEndColor(color)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for setting color at the end of listening to reactions</p></dd>

<dt><a href="#setListenEndMethod">setListenEndMethod(method)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for setting the method of working with a message when you finish listening for reactions</p></dd>

<dt><a href="#setListenUsers">setListenUsers(users)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for setting listening to specific users</p></dd>

<dt><a href="#addListenUsers">addListenUsers(users)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for adding listening to specific users</p></dd>

<dt><a href="#autoResetTimeout">autoResetTimeout(status)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Method for setting the timer to automatically reset when switching between pages</p></dd>

<dt><a href="#stopListen">stopListen()</a>;</dt>
<dd><p>Method for early stopping listening to new messages</p></dd>
</dl>

<a name="setListenTime"></a>

## setListenTime(time) ⇒ <code>PagesBuilder</code>;
Method for setting the time to listen for updates to switch pages

**Returns**: `PagesBuilder`

| Params | Type     | Default         | Description                    |
| ------ | -------- | --------------- | ------------------------------ |
| time   | `number` | `5 * 60 * 1000` | Listening time in milliseconds |

**Example**:

```js
const builder = message.pagesBuilder();

builder.setListenTime(2 * 60 * 1000);
```

<a name="resetListenTimeout"></a>

## resetListenTimeout();
Method for resetting the current listening timer

**Example**:

```js
const builder = message.pagesBuilder()
    .build();

builder.resetListenTimeout();
```

<a name="setListenEndColor"></a>

## setListenEndColor(color) ⇒ <code>PagesBuilder</code>;
Method for setting color at the end of listening to reactions

**Returns**: `PagesBuilder`

| Params | Type                                                                                   | Default  | Description |
| ------ | -------------------------------------------------------------------------------------- | -------- | ----------- |
| color  | [`ColorResolvable`](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable) | `"GREY"` | Color       |

**Example**:

```js
const builder = message.pagesBuilder();

builder.setListenEndColor("RED");
```

<a name="setListenEndMethod"></a>

## setListenEndMethod(method) ⇒ <code>PagesBuilder</code>;
Method for setting the method of working with a message when you finish listening for reactions

**Returns**: `PagesBuilder`

| Params | Type                | Default  | Description |
| ------ | ------------------- | -------- | ----------- |
| method | `"delete"` `"edit"` | `"edit"` | Method      |

**Example**:

```js
const builder = message.pagesBuilder();

builder.setListenEndMethod("delete");
```

<a name="setListenUsers"></a>

## setListenUsers(users) ⇒ <code>PagesBuilder</code>;
Method for setting listening to specific users

**Returns**: `PagesBuilder`

| Params | Type                | Default                       | Description      |
| ------ | ------------------- | ----------------------------- | ---------------- |
| users  | `[number]` `number` | `[Current message author id]` | Users for listen |

**Example**:

```js
const builder = message.pagesBuilder();

builder.setListenUsers([342146975065702400, 269250266455474176]);
```

<a name="addListenUsers"></a>

## addListenUsers(users) ⇒ <code>PagesBuilder</code>;
Method for adding listening to specific users

**Returns**: `PagesBuilder`

| Params | Type                | Default                       | Description      |
| ------ | ------------------- | ----------------------------- | ---------------- |
| users  | `[number]` `number` | `[Current message author id]` | Users for listen |

**Example**:

```js
const builder = message.pagesBuilder();

builder.addListenUsers([342146975065702400]);
```

<a name="autoResetTimeout"></a>

## autoResetTimeout(status) ⇒ <code>PagesBuilder</code>;
Method for setting the timer to automatically reset when switching between pages

**Returns**: `PagesBuilder`

| Params  | Type      | Default | Description            |
| ------- | --------- | ------- | ---------------------- |
| status  | `boolean` | `true`  | Timer auto reset value |

**Example**:

```js
const builder = message.pagesBuilder();

builder.autoResetTimeout(false);
```

<a name="stopListen"></a>

## stopListen();
Method for early stopping listening to new messages

**Example**:

```js
const builder = message.pagesBuilder()
    .build();

builder.stopListen();
```
