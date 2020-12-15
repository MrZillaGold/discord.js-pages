import { MessageEmbed } from "discord.js";

export class PagesBuilder extends MessageEmbed {

    constructor({ message }) {
        super();

        this.message = message;
        this.sent = null;
        this.collection = null;

        this.pages = [];
        this.currentPage = 1;
        this.pagesNumberFormat = "%c / %m";
        this.infinityLoop = true;

        this.defaultButtons = new Map();

        this.listenTime = 5 * 60 * 1000;
        this.listenUsers = [message.author.id];
        this.resetTimeout = true;
        this.endColor = "GREY";
        this.endMethod = "edit";

        this.triggers = new Map();

        this.setDefaultButtons();
    }

    /**
     * Builder page
     * @typedef {function|MessageEmbed} Page
     */

    /**
     * @description Method for initial pages setup
     * @param {[Page]|Page} pages - Pages for setup
     * @return {PagesBuilder}
     */
    setPages(pages) {
        if (!Array.isArray(pages)) {
            pages = [pages];
        }

        this.pages = pages;

        return this;
    }

    /**
     * @description Method for adding pages to the end
     * @param {[Page]|Page} pages - Pages to add
     * @return {PagesBuilder}
     */
    addPages(pages) {
        this.pages = this.pages.concat(pages);

        return this;
    }

    /**
     * @description Method for opening a specific page
     * @param {number} pageNumber - Page number
     * @return {Promise<Message>} - Message editing result
     */
    async setPage(pageNumber) {
        if (this.sent) {
            this.currentPage = pageNumber;

            if (this.resetTimeout) {
                this.resetListenTimeout();
            }

            return this.sent.edit({
                embed: await this.getPage(pageNumber)
            })
                .then((message) => {
                    this.sent = message;
                });
        }
    }

    /**
     * @description Method for getting the page
     * @param {number} [pageNumber=this.currentPage] - Page for receiving
     * @return Promise<MessageEmbed>
     */
    async getPage(pageNumber = this.currentPage) {
        let page = this.pages[pageNumber - 1];

        if (typeof page === "function") {
            page = await page();
        }

        page = new MessageEmbed(page);

        Object.keys(page)
            .forEach((key) => {
                switch (key) {
                    case "fields":
                        page[key] = [...this[key], ...page[key]];

                        break;
                    case "footer":
                        const footer = this[key] ?? page[key];

                        if (this.pagesNumberFormat) {
                            const pageNumber = this.pagesNumberFormat.replace("%c", this.currentPage)
                                .replace("%m", this.pages.length);

                            if (footer) {
                                page[key] = {
                                    ...footer,
                                    text: `${pageNumber}${this.pagesNumberFormat && footer.text ? " • " : ""}${footer.text}`
                                };
                            } else {
                                page.setFooter(pageNumber);
                            }
                        } else {
                            page.setFooter(footer?.text ?? "");
                        }

                        break;
                    default:
                        page[key] = this[key] ?? page[key];

                        break;
                }
            });

        return page;
    }

    /**
     * @description Method for setting the pagination format
     * @param {string} format="%c / %m" - Pagination format
     * @return {PagesBuilder}
     */
    setPagesNumberFormat(format = "%c / %m") {
        this.pagesNumberFormat = format;

        return this;
    }

    /**
     * @description Method for setting endless page switching when reaching the end
     * @param {Boolean} status=true - Value for endless switching between pages
     * @return {PagesBuilder}
     */
    setInfinityLoop(status = true) {
        this.infinityLoop = status;

        return this;
    }

    /**
     * @description Method for setting default buttons
     * @param {["first", "back", "stop", "next", "last"]|[{"first": EmojiIdentifierResolvable}, {"back": EmojiIdentifierResolvable}, {"stop": EmojiIdentifierResolvable}, {"next": EmojiIdentifierResolvable}, {"last": EmojiIdentifierResolvable}]} [buttons] - Default buttons
     * @return {PagesBuilder}
     */
    setDefaultButtons(buttons = ["first", "back", "stop", "next", "last"]) {
        const defaultButtons = new Map([
            ["first", "⏪"],
            ["back", "◀️"],
            ["stop", "⏹"],
            ["next", "▶️"],
            ["last", "⏩"]
        ]);

        this.defaultButtons = new Map(
            buttons.map((button) => {
                if (typeof button === "string") {
                    const buttonReaction = defaultButtons.get(button);

                    if (buttonReaction) {
                        return [buttonReaction, button];
                    }
                }

                if (typeof button === "object") {
                    const [[buttonAction, buttonReaction]] = Object.entries(button);

                    if (defaultButtons.get(buttonAction)) {
                        return [buttonReaction, buttonAction];
                    }
                }
            })
        );

        return this;
    }

    /**
     * @description Method for setting the time to listen for updates to switch pages
     * @param {number} time=5*60*1000 - Listening time in milliseconds
     * @return {PagesBuilder}
     */
    setListenTime(time = 5 * 60 * 1000) {
        this.listenTime = time;

        return this;
    }

    /**
     * @description Method for resetting the current listening timer
     */
    resetListenTimeout() {
        clearTimeout(this._listenTimeout);

        this._listenTimeout = setTimeout(this.stopListen.bind(this), this.listenTime);
    }

    /**
     * @description Method for setting color at the end of listening to reactions
     * @param {ColorResolvable} color="GREY" - Color
     * @return {PagesBuilder}
     */
    setListenEndColor(color = "GREY") {
        this.endColor = color;

        return this;
    }

    /**
     * @description Method for setting the method of working with a message when you finish listening for reactions
     * @param {"edit"|"delete"} method="edit" - Method
     * @return {PagesBuilder}
     */
    setListenEndMethod(method = "edit") {
        this.endMethod = method;

        return this;
    }

    /**
     * @description Method for setting listening to specific users
     * @param {[number]|number} users=[] - Users for listen
     * @return {PagesBuilder}
     */
    setListenUsers(users = []) {
        if (!Array.isArray(users)) {
            users = [users];
        }

        this.listenUsers = users;

        return this;
    }

    /**
     * @description Method for adding listening to specific users
     * @param {[number]|number} users=[] - Users for listen
     * @return {PagesBuilder}
     */
    addListenUsers(users = []) {
        this.listenUsers = this.listenUsers.concat(users);

        return this;
    }

    /**
     * @description Method for setting the timer to automatically reset when switching between pages
     * @param {boolean} status=true - Timer auto reset value
     * @return {PagesBuilder}
     */
    autoResetTimeout(status = true) {
        this.resetTimeout = status;

        return this;
    }

    /**
     * @description Method for early stopping listening to new messages
     */
    async stopListen() {
        clearTimeout(this._listenTimeout);

        this.collection.stop();

        this.collection = null;
    }

    /**
     * Builder trigger
     * @typedef {object} Trigger
     * @property {EmojiIdentifierResolvable} emoji - Emoji for trigger reaction
     * @property {function} callback - Trigger callback
     */

    /**
     * @description Method for initial setting of triggers
     * @param {Trigger[]|Trigger} triggers - Triggers
     * @return {PagesBuilder}
     */
    setTriggers(triggers) {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        triggers.forEach(({ emoji, callback }) => this.triggers.set(emoji, callback));

        return this;
    }

    /**
     * @description Method for adding triggers
     * @param {Trigger[]|Trigger} triggers - Triggers
     * @return {PagesBuilder}
     */
    addTriggers(triggers) {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        triggers.forEach(({ emoji, callback }) =>
            this.triggers.set(emoji, callback)
        );

        return this;
    }

    /**
     * @description Method for build and send pages
     * @return {Promise<Error|Message>}
     */
    async build() {
        if (this.pages.length === 0) {
            return new Error("Pages not set");
        }

        if (!this.message) {
            return new Error("Message not passed");
        }

        return this.message.channel.send({
            embed: await this.getPage()
        })
            .then(async (message) => {
                this.sent = message;

                this._startCollection();
                this.resetListenTimeout();

                for (const [buttonReaction] of [...(this.pages.length > 1 ? this.defaultButtons : []), ...this.triggers]) {
                    if (this.collection) {
                        await message.react(buttonReaction);
                    }
                }
            })
            .catch((error) => console.log(error));
    }

    /**
     * @private
     */
    _startCollection() {
        const message = this.sent;

        this.collection = message.createReactionCollector((reaction, user) =>
            user.id !== message.author.id &&
            (this.listenUsers.length ? this.listenUsers.includes(user.id) : true)
        )
            .on("collect", (reaction, user) => {
                reaction.users.remove(user);

                const emoji = reaction.emoji.id || reaction.emoji.name;

                const action = this.defaultButtons.get(emoji);
                const trigger = this.triggers.get(emoji)

                if (action) {
                    this._executeAction(action);
                } else if (trigger) {
                    trigger(this.sent, reaction, user);
                }
            })
            .on("end", async () => {
                switch (this.endMethod) {
                    case "edit":
                        message.edit({
                            embed: (await this.getPage())
                                .setColor(this.endColor)
                        })
                            .catch(() => {});

                        return message.reactions.removeAll()
                            .catch(() => {});
                    case "delete":
                        return message.delete()
                            .then(() => this.sent = null)
                            .catch(() => {});
                }
            });
    }

    /**
     * @private
     */
    _executeAction(action) {
        switch (action) {
            case "first":
                if (this.currentPage === 1) {
                    if (this.infinityLoop) {
                        this.setPage(this.pages.length);
                    }

                    return;
                }

                this.setPage(1);

                break;
            case "back":
                if (this.currentPage === 1) {
                    if (this.infinityLoop) {
                        this.setPage(this.pages.length);
                    }

                    return;
                }

                this.setPage(this.currentPage - 1);

                break;
            case "stop":
                this.stopListen();
                break;
            case "next":
                if (this.currentPage === this.pages.length) {
                    if (this.infinityLoop) {
                        this.setPage(1);
                    }

                    return;
                }

                this.setPage(this.currentPage + 1);

                break;
            case "last":
                if (this.currentPage === this.pages.length) {
                    if (this.infinityLoop) {
                        this.setPage(1);
                    }

                    return;
                }

                this.setPage(this.pages.length);

                break;
        }
    }
}
