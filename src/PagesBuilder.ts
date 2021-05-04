import chunk from "chunk";
import { ColorResolvable, Message, MessageEmbed, MessageReaction, ReactionCollector, User } from "discord.js";

import { IPagesBuilderOptions, ITrigger, IResetListenTimeoutOptions, Button, DefaultButtonLabel, DefaultReactionsMap, Page, StringButton, DefaultButtonsMap, EndMethod, SetListenUsersOptions, ListenUser, TriggersMap, IAutoGeneratePagesOptions } from "./interfaces";

export class PagesBuilder extends MessageEmbed {

    message: Message | null;
    sent: Message | null = null;
    collection: ReactionCollector | null = null;

    pages: Page[] = [];
    currentPage = 1;
    pagesNumberFormat = "%c / %m";
    infinityLoop = true;

    defaultButtons: DefaultButtonsMap = new Map();

    listenTime: number = 5 * 60 * 1000;
    listenUsers: ListenUser[];
    private _listenTimeout: NodeJS.Timeout | null = null;
    resetTimeout = true;
    endColor: ColorResolvable = "GREY";
    endMethod: EndMethod = "edit";

    triggers: TriggersMap = new Map();

    constructor({ message }: IPagesBuilderOptions) {
        super();

        this.message = message;

        this.listenUsers = [message.author.id];

        this.setDefaultButtons();
    }

    /**
     * Method for initial pages setup
     */
    setPages(pages: Page | Page[]): this {
        if (!Array.isArray(pages)) {
            pages = [pages];
        }

        this.pages = pages;

        return this;
    }

    /**
     * Method for adding pages to the end
     */
    addPages(pages: Page | Page[]): this {
        this.pages = this.pages.concat(pages);

        return this;
    }

    /**
     * Method for auto generating pages
     */
    autoGeneratePages({ items, countPerPage = 10 }: IAutoGeneratePagesOptions): this {
        const chunks = chunk(items, countPerPage);

        this.setPages(
            chunks.map((chunk) => (
                new MessageEmbed()
                    .setDescription(chunk)
            ))
        );

        return this;
    }

    /**
     * Method for opening a specific page
     */
    async setPage(pageNumber: number): Promise<Message | void> {
        if (this.sent) {
            this.currentPage = pageNumber;

            if (this.resetTimeout) {
                this.resetListenTimeout();
            }

            return this.sent.edit({
                embed: await this.getPage(pageNumber)
            })
                .then((message: Message) => {
                    this.sent = message;

                    return message;
                });
        }
    }

    /**
     * Method for getting the page
     */
    async getPage(pageNumber: number = this.currentPage): Promise<MessageEmbed> {
        let page: Page = this.pages[pageNumber - 1];

        if (typeof page === "function") {
            page = await page();
        }

        const clonedPage = new MessageEmbed(page);

        Object.keys(clonedPage)
            .forEach((pageKey) => {
                const key = pageKey as keyof MessageEmbed;

                switch (key) {
                    case "fields":
                        clonedPage[key] = [...this[key], ...clonedPage[key]];

                        break;
                    case "footer": {
                        const footer = this[key] ?? clonedPage[key];

                        if (this.pagesNumberFormat) {
                            const pageNumber = this.pagesNumberFormat.replace("%c", String(this.currentPage))
                                .replace("%m", String(this.pages.length));

                            if (footer) {
                                clonedPage[key] = {
                                    ...footer,
                                    text: `${pageNumber}${this.pagesNumberFormat && footer.text ? " • " : ""}${footer.text}`
                                };
                            } else {
                                clonedPage.setFooter(pageNumber);
                            }
                        } else {
                            clonedPage.setFooter(footer?.text ?? "");
                        }

                        break;
                    }
                    case "files":
                        clonedPage[key] = this[key].length ? this[key] : clonedPage[key];

                        break;
                    default:
                        // @ts-ignore
                        clonedPage[key] = this[key] ?? clonedPage[key];

                        break;
                }
            });

        return clonedPage;
    }

    /**
     * Method for setting the pagination format
     */
    setPagesNumberFormat(format = "%c / %m"): this {
        this.pagesNumberFormat = format;

        return this;
    }

    /**
     * Method for setting endless page switching when reaching the end
     */
    setInfinityLoop(status = true): this {
        this.infinityLoop = status;

        return this;
    }

    /**
     * Method for setting default buttons
     */
    setDefaultButtons(buttons: Button[] = ["first", "back", "stop", "next", "last"]): this {
        const defaultReactions: DefaultReactionsMap = new Map([
            ["first", "⏪"],
            ["back", "◀️"],
            ["stop", "⏹"],
            ["next", "▶️"],
            ["last", "⏩"]
        ]);

        const defaultButtons = buttons.map((button: Button) => {
            if (typeof button === "string") {
                const buttonReaction = defaultReactions.get(button);

                if (buttonReaction) {
                    return [buttonReaction, button];
                }
            }

            if (typeof button === "object") {
                const [[buttonAction, buttonReaction]] = Object.entries(button);

                if (defaultReactions.get(buttonAction as StringButton)) {
                    return [buttonReaction, buttonAction];
                }
            }
        }) as [DefaultButtonLabel, StringButton][];

        this.defaultButtons = new Map(
            defaultButtons
        );

        return this;
    }

    /**
     * Method for setting the time to listen for updates to switch pages
     */
    setListenTime(time: number = 5 * 60 * 1000): this {
        this.listenTime = time;

        return this;
    }

    /**
     * @description Method for resetting the current listening timer
     */
    resetListenTimeout({ isFirstBuild = false }: IResetListenTimeoutOptions = {}): void {
        if (this._listenTimeout || isFirstBuild) {
            clearTimeout(this._listenTimeout as NodeJS.Timeout);

            this._listenTimeout = setTimeout(this.stopListen.bind(this), this.listenTime);
        }
    }

    /**
     * Method for setting color at the end of listening to reactions
     */
    setListenEndColor(color: ColorResolvable = "GREY"): this {
        this.endColor = color;

        return this;
    }

    /**
     * Method for setting the method of working with a message when you finish listening for reactions
     */
    setListenEndMethod(method: EndMethod = "edit"): this {
        this.endMethod = method;

        return this;
    }

    /**
     * Method for setting listening to specific users
     */
    setListenUsers(users: SetListenUsersOptions = []): this {
        this.listenUsers = !Array.isArray(users) ? [users] : users;

        return this;
    }

    /**
     * Method for adding listening to specific users
     */
    addListenUsers(users: SetListenUsersOptions = []): this {
        this.listenUsers = this.listenUsers.concat(users);

        return this;
    }

    /**
     * Method for setting the timer to automatically reset when switching between pages
     */
    autoResetTimeout(status = true): this {
        this.resetTimeout = status;

        return this;
    }

    /**
     * Method for early stopping listening to new messages
     */
    stopListen(): void {
        if (this._listenTimeout && this.collection) {
            clearTimeout(this._listenTimeout);

            this.collection.stop();

            this.collection = null;
        }
    }

    /**
     * Method for initial setting of triggers
     */
    setTriggers(triggers: ITrigger | ITrigger[]): this {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        this.triggers = new Map(
            triggers.map(({ emoji, callback }) => [emoji, callback])
        );

        return this;
    }

    /**
     * Method for adding triggers
     */
    addTriggers(triggers: ITrigger | ITrigger[]): this {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        triggers.forEach(({ emoji, callback }) => (
            this.triggers.set(emoji, callback)
        ));

        return this;
    }

    /**
     * Method for build and send pages
     */
    async build(sent: Message | null = null): Promise<Message> {
        if (this.pages.length === 0) {
            throw new Error("Pages not set");
        }

        if (!this.message) {
            throw new Error("Message not passed");
        }

        // @ts-ignore
        return (
            sent ?
                sent.edit.bind(sent)
                :
                this.message.channel.send.bind(this.message.channel)
        )({
            embed: await this.getPage()
        })
            .then(async (message: Message) => {
                this.sent = message;

                this._startCollection();
                this.resetListenTimeout({ isFirstBuild: true });

                for (const [buttonReaction] of [...(this.pages.length > 1 ? this.defaultButtons : []), ...this.triggers]) {
                    if (this.collection) {
                        await message.react(buttonReaction);
                    }
                }

                return message;
            });
    }

    private _startCollection(): void {
        const message = this.sent;

        if (message) {
            this.collection = message.createReactionCollector((_: MessageReaction, user: User) => (
                user.id !== message.author.id &&
                (this.listenUsers.length ? this.listenUsers.includes(user.id) : true)
            ))
                .on("collect", (reaction: MessageReaction, user: User) => {
                    reaction.users.remove(user);

                    const emoji = reaction.emoji.id || reaction.emoji.name;

                    const action = this.defaultButtons.get(emoji as DefaultButtonLabel);
                    const trigger = this.triggers.get(emoji);

                    if (action) {
                        this._executeAction(action);
                    } else if (trigger) {
                        trigger(message, reaction, user);
                    }
                })
                .on("end", async () => {
                    switch (this.endMethod) {
                        case "edit":
                            message.edit({
                                embed: (await this.getPage())
                                    .setColor(this.endColor)
                            })
                                .catch(() => null);

                            return message.reactions.removeAll()
                                .catch(() => null);
                        case "delete":
                            return message.delete()
                                .then(() => this.sent = null)
                                .catch(() => null);
                    }
                });
        }
    }

    private _executeAction(action: StringButton): void {
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
