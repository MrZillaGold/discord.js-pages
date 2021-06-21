import { CommandInteraction, Message } from "discord.js";

export interface IPagesBuilderOptions {
    message: Message | CommandInteraction;
}
