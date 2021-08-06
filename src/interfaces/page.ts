import { MessageEmbed } from 'discord.js';

export type EmbedPage = MessageEmbed;
export type FunctionPage = () => MessageEmbed | Promise<MessageEmbed>;

export type Page = EmbedPage | FunctionPage;

export interface IAutoGeneratePagesOptions {
    items: string[];
    countPerPage?: number;
}
