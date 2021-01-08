import { EmojiIdentifierResolvable, Message, MessageReaction, User } from "discord.js";

export type TriggerCallback = (sent: Message, reaction: MessageReaction, user: User) => unknown;

export interface ITrigger {
    emoji: EmojiIdentifierResolvable;
    callback: TriggerCallback;
}

export type TriggersMap = Map<EmojiIdentifierResolvable, TriggerCallback>;
