import { MessageEmbed } from "discord.js";

export type EmbedPage = MessageEmbed;
export type FunctionPage = () => MessageEmbed;

export type Page = EmbedPage | FunctionPage;
