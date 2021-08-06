// @ts-ignore
import * as chunk from 'chunk';
import {
    ColorResolvable,
    CommandInteraction,
    GuildMember,
    InteractionCollector,
    Message,
    MessageActionRow, MessageActionRowComponent,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
    MessageOptions, MessageSelectMenu,
    TextBasedChannels,
    WebhookEditMessageOptions
} from 'discord.js';

import {
    Action,
    ActionLabel,
    ActionLabelUnion,
    ActionUnion,
    Button,
    EndMethod,
    EndMethodUnion,
    IAutoGeneratePagesOptions,
    IResetListenTimeoutOptions,
    ITrigger,
    Page,
    TriggersMap
} from './interfaces';
import { APIMessage } from 'discord-api-types/v9';

type Files = Exclude<MessageOptions['files'], undefined>;

export class PagesBuilder extends MessageEmbed {

    readonly interaction: CommandInteraction;
    private collector!: InteractionCollector<MessageComponentInteraction>;
    private messageComponent?: MessageComponentInteraction;
    private message!: Message;
    private messageId = '';

    /**
     * Pages
     */
    private pages: Page[] = [];
    private files: Files = [];
    private currentPage = 1;
    private paginationFormat = '%c / %m';
    private loop = true;

    private components: MessageActionRow[] = [];
    private defaultButtons: MessageActionRow[] = [];

    private listenTimeout: number = 5 * 60 * 1000;
    private listenUsers: GuildMember['id'][];
    private timeout!: NodeJS.Timeout;
    private autoResetTimeout = true;
    private endColor: ColorResolvable = 'GREY';
    private endMethod: EndMethod | EndMethodUnion = EndMethod.EDIT;

    private triggers: TriggersMap = new Map();

    constructor(interaction: CommandInteraction) {
        super();

        if (!interaction.isCommand()) {
            throw new TypeError(`${this.constructor.name} can only be initialized when calling the slash command`);
        }

        this.interaction = interaction;

        this.listenUsers = [(interaction.member as GuildMember).user.id];

        this.setDefaultButtons();
    }

    /**
     * Method for initial pages setup
     *
     * @example
     * ```
     * builder.setPages(
     *     new MessageEmbed()
     *         .setTitle('Hello World!')
     * );
     *
     * builder.setPages([
     *     new MessageEmbed()
     *         .setTitle('Hello World!'),
     *     () => (
     *         new MessageEmbed()
     *             .setTitle('Function page')
     *     )
     * ]);
     * ```
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
     * Method for initial files setup
     */
    setFiles(files: Files | Files[number]): this {
        if (!Array.isArray(files)) {
            files = [files];
        }

        this.files = files;

        return this;
    }

    /**
     * Method for adding files to the end
     */
    addFiles(files: Files | Files[number]): this {
        this.files = this.files.concat(files);

        return this;
    }

    /**
     * Method for auto generating pages
     *
     * @example
     * ```
     * builder.autoGeneratePages({
     *     items: [
     *         'Player 1',
     *         'Player 2',
     *         'Player 3'
     *     ],
     *     countPerPage: 2
     * });
     * ```
     */
    autoGeneratePages({ items, countPerPage = 10 }: IAutoGeneratePagesOptions): this {
        const chunks = chunk(items, countPerPage);

        this.setPages(
            chunks.map((chunk) => (
                new MessageEmbed()
                    .setDescription(
                        chunk.join('\n')
                    )
            ))
        );

        return this;
    }

    /**
     * Method for opening a specific page
     */
    async setPage(pageNumber: number): Promise<any | Message | APIMessage> {
        this.currentPage = pageNumber;

        const data: WebhookEditMessageOptions = {
            embeds: await this.getPage(pageNumber),
            components: this.simplifyKeyboard([...this.defaultButtons, ...this.components])
        };

        if (this.messageComponent) {
            if (this.messageComponent.replied) {
                return;
            }

            const response = await this.messageComponent[this.messageComponent.deferred ? 'editReply' : 'update'](data);

            this.messageComponent = undefined;

            return response;
        }

        return this.interaction.editReply(data);
    }

    /**
     * Method for getting the page
     */
    async getPage(pageNumber: number = this.currentPage): Promise<MessageEmbed[]> {
        let page: Page = this.pages[pageNumber - 1];

        if (typeof page === 'function') {
            page = await page();
        }

        const clonedPage = new MessageEmbed(page);

        Object.keys(clonedPage)
            .forEach((pageKey) => {
                const key = pageKey as keyof MessageEmbed;

                switch (key) {
                    case 'fields':
                        clonedPage[key] = [...this[key], ...clonedPage[key]];

                        break;
                    case 'footer': {
                        const footer = this[key] ?? clonedPage[key];

                        if (this.paginationFormat) {
                            const pageNumber = this.paginationFormat.replace('%c', String(this.currentPage))
                                .replace('%m', String(this.pages.length));

                            if (footer) {
                                clonedPage[key] = {
                                    ...footer,
                                    text: `${pageNumber}${this.paginationFormat && footer.text ? ' • ' : ''}${footer.text}`
                                };
                            } else {
                                clonedPage.setFooter(pageNumber);
                            }
                        } else {
                            clonedPage.setFooter(footer?.text ?? '');
                        }

                        break;
                    }
                    default:
                        // @ts-ignore
                        clonedPage[key] = this[key] ?? clonedPage[key];

                        break;
                }
            });

        return [clonedPage];
    }

    /**
     * Method for setting the pagination format
     *
     * @example
     * %c - Current page
     * %m - Max page
     *
     * ```
     * builder.setPaginationFormat('Current page: %c, Max: %m');
     * ```
     */
    setPaginationFormat(format = '%c / %m'): this {
        this.paginationFormat = format;

        return this;
    }

    /**
     * Method for setting endless page switching when reaching the end
     */
    setLoop(status = true): this {
        this.loop = status;

        return this;
    }

    /**
     * Method for setting default buttons
     *
     * @example
     * ```
     * builder.setDefaultButtons(['first', {
     *   'stop': new MessageButton()
     *   .setLabel('Stop')
     *   .setStyle('PRIMARY')
     * }]);
     * ```
     */
    setDefaultButtons(buttons: Button[] = [Action.FIRST, Action.BACK, Action.STOP, Action.NEXT, Action.LAST]): this {
        const defaultActions = new Map<Action | ActionUnion, ActionLabel | ActionLabelUnion>([
            [Action.FIRST, ActionLabel.FIRST],
            [Action.BACK, ActionLabel.BACK],
            [Action.STOP, ActionLabel.STOP],
            [Action.NEXT, ActionLabel.NEXT],
            [Action.LAST, ActionLabel.LAST]
        ]);

        this.defaultButtons = buttons.length ?
            [
                new MessageActionRow()
                    .addComponents(
                        buttons.map((button: Button) => {
                            if (typeof button === 'string') {
                                return new MessageButton()
                                    .setCustomId(button)
                                    .setEmoji(defaultActions.get(button) as ActionUnion)
                                    .setStyle('SECONDARY');
                            }

                            const [[buttonAction, buttonComponent]] = Object.entries(button);

                            return buttonComponent
                                .setCustomId(buttonAction);
                        })
                    )
            ]
            :
            [];

        return this;
    }

    /**
     * Method for setting the time to listen for updates to switch pages
     */
    setListenTimeout(timeout = 5 * 60 * 1000): this {
        this.listenTimeout = timeout;

        return this;
    }

    /**
     * @description Method for resetting the current listening timer
     */
    resetListenTimeout({ isFirstBuild = false }: IResetListenTimeoutOptions = {}): void {
        if (this.timeout || isFirstBuild) {
            clearTimeout(this.timeout as NodeJS.Timeout);

            this.timeout = setTimeout(this.stopListen.bind(this), this.listenTimeout);
        }
    }

    /**
     * Method for setting embed color at the end of listening
     */
    setListenEndColor(color: ColorResolvable = 'GREY'): this {
        this.endColor = color;

        return this;
    }

    /**
     * Method for setting the method of working with a message when you finish listening for reactions
     */
    setListenEndMethod(method: EndMethod | EndMethodUnion): this {
        this.endMethod = method;

        return this;
    }

    /**
     * Method for setting listening to specific users
     */
    setListenUsers(users: GuildMember['id'] | GuildMember['id'][] = []): this {
        this.listenUsers = !Array.isArray(users) ? [users] : users;

        return this;
    }

    /**
     * Method for adding listening to specific users
     */
    addListenUsers(users: GuildMember['id'] | GuildMember['id'][]): this {
        this.listenUsers = this.listenUsers.concat(users);

        return this;
    }

    /**
     * Method for setting the timer to automatically reset when switching between pages
     */
    setAutoResetTimeout(status = true): this {
        this.autoResetTimeout = status;

        return this;
    }

    /**
     * Method for early stopping listening
     */
    stopListen(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);

            this.collector.stop();
        }
    }

    /**
     * Method for setting components rows
     */
    setComponents(components: MessageActionRow | MessageActionRow[]): this {
        if (!Array.isArray(components)) {
            components = [components];
        }

        this.components = components;

        return this;
    }

    /**
     * Method for adding components to available row
     */
    addComponents(components: MessageActionRow | MessageActionRowComponent | (MessageActionRow | MessageActionRowComponent)[]): this {
        if (!Array.isArray(components)) {
            components = [components];
        }

        components.forEach((component) => {
            if (component instanceof MessageActionRow) {
                return this.components.push(component);
            }

            let length = this.components.length;

            if (!length) {
                this.components.push(
                    new MessageActionRow()
                );

                length++;
            }

            const row = this.components[length - 1];

            if (
                component.type !== 'SELECT_MENU' &&
                row.components.length < 5 &&
                row.components.findIndex(({ type }) => type === 'SELECT_MENU') === -1
            ) {
                row.addComponents(component);
            } else {
                this.components.push(
                    new MessageActionRow()
                        .addComponents(component)
                );
            }
        });

        return this;
    }

    /**
     * Method for initial setting of triggers
     */
    setTriggers<T extends MessageButton | MessageSelectMenu>(triggers: ITrigger<T> | ITrigger<T>[] = []): this {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        this.triggers = new Map(
            triggers.map(({ name, callback }) => [name, callback])
        );

        return this;
    }

    /**
     * Method for adding triggers
     */
    addTriggers<T extends MessageButton | MessageSelectMenu>(triggers: ITrigger<T> | ITrigger<T>[]): this {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        triggers.forEach(({ name, callback }) => (
            this.triggers.set(name, callback)
        ));

        return this;
    }

    /**
     * Rerender current page
     */
    rerender(): Promise<any> {
        return this.setPage(this.currentPage);
    }

    /**
     * Build method
     */
    async build(): Promise<void | Message | APIMessage> {
        if (this.pages.length === 0) {
            throw new TypeError('Pages not set');
        }

        const method = this.interaction.replied ?
            'followUp'
            :
            this.interaction.deferred ?
                'editReply'
                :
                'reply';

        const response = await this.interaction[method]({
            embeds: await this.getPage(),
            files: this.files,
            components: this.simplifyKeyboard([...this.defaultButtons, ...this.components])
        })
            .then((message) => {
                if (message) {
                    this.messageId = message.id;
                    this.message = message as Message;
                }
            });

        if (!this.messageId) {
            await this.interaction.fetchReply()
                .then((message) => {
                    this.messageId = message.id;
                    this.message = message as Message;
                });
        }

        this.startCollector();
        this.resetListenTimeout({
            isFirstBuild: true
        });

        return response;
    }

    /**
     * @hidden
     */
    private simplifyKeyboard(rows: MessageActionRow[]): MessageActionRow[] {
        if (this.loop && this.pages.length > 1) {
            return rows;
        }

        return rows.map((row) => {
            row = new MessageActionRow(row);

            row.components = row.components.filter(({ type, customId }) => (
                type === 'BUTTON' ?
                    (this.currentPage !== 1 || this.pages.length !== 1 || (customId !== Action.FIRST && customId !== Action.BACK)) &&
                    (this.currentPage !== this.pages.length || this.pages.length !== 1 || (customId !== Action.LAST && customId !== Action.NEXT))
                    :
                    true
            ));

            return row;
        })
            .filter((row) => row.components.length);
    }

    /**
     * @hidden
     */
    private startCollector(): void {
        this.collector = (this.interaction.channel as TextBasedChannels).createMessageComponentCollector()
            .on('collect', (interaction) => {
                if (interaction.message.id !== this.messageId) {
                    return;
                }

                if (this.listenUsers.length) {
                    if (!this.listenUsers.includes(interaction.member?.user.id as GuildMember['id'])) {
                        return;
                    }
                }

                if (this.autoResetTimeout) {
                    this.resetListenTimeout();
                }

                this.messageComponent = interaction;
                this.message = interaction.message as Message;

                if (interaction.isButton()) {
                    this.handleButton(interaction);
                }

                if (interaction.isSelectMenu()) {
                    this.handleSelectMenu(interaction);
                }
            })
            .on('end', async () => {
                switch (this.endMethod) {
                    case EndMethod.EDIT: {
                        const embeds = await this.getPage();

                        const [embed] = embeds;

                        embed.setColor(this.endColor);

                        this.message.edit({
                            embeds,
                            components: []
                        })
                            .catch(() => null);

                        break;
                    }
                    case EndMethod.DELETE:
                        this.message.delete()
                            .catch(() => null);

                        break;
                }
            });
    }

    /**
     * @hidden
     */
    private async handleButton(interaction: MessageComponentInteraction): Promise<void> {
        const { customId } = interaction;

        this.executeAction(customId);

        const trigger = this.triggers.get(customId);
        const buttons: MessageButton[] = [];

        if (trigger) {
            this.components.forEach((component) => {
                component.components.forEach((button) => {
                    if (button.customId === customId) {
                        buttons.push(button as MessageButton);
                    }
                });
            });

            await interaction.deferUpdate();

            await trigger(interaction, ...buttons);

            this.rerender();
        }
    }

    /**
     * @hidden
     */
    private async handleSelectMenu(interaction: MessageComponentInteraction): Promise<void> {
        const { customId } = interaction;

        const trigger = this.triggers.get(customId);
        const menu: MessageSelectMenu[] = [];

        if (trigger) {
            this.components.forEach((component) => {
                component.components.forEach((component) => {
                    if (component.customId === customId) {
                        menu.push(component as MessageSelectMenu);
                    }
                });
            });

            await interaction.deferUpdate();

            await trigger(interaction, ...menu);
        }
    }

    /**
     * Method for invoking quick actions
     */
    executeAction(action: Action | ActionUnion | string): void {
        switch (action) {
            case Action.FIRST:
                if (this.currentPage === 1) {
                    if (this.loop) {
                        this.setPage(this.pages.length);
                    }

                    return;
                }

                this.setPage(1);

                break;
            case Action.BACK:
                if (this.currentPage === 1) {
                    if (this.loop) {
                        this.setPage(this.pages.length);
                    }

                    return;
                }

                this.setPage(this.currentPage - 1);

                break;
            case Action.STOP:
                this.stopListen();

                break;
            case Action.NEXT:
                if (this.currentPage === this.pages.length) {
                    if (this.loop) {
                        this.setPage(1);
                    }

                    return;
                }

                this.setPage(this.currentPage + 1);

                break;
            case Action.LAST:
                if (this.currentPage === this.pages.length) {
                    if (this.loop) {
                        this.setPage(1);
                    }

                    return;
                }

                this.setPage(this.pages.length);

                break;
        }
    }
}
