import { EmojiIdentifierResolvable } from "discord.js";

export type DefaultButtonLabel = "⏪" | "◀️" | "⏹" | "▶️" | "⏩";

export type StringButton = "first" | "back" | "stop" | "next" | "last";
export type ObjectButton = {
    [key in StringButton]: EmojiIdentifierResolvable;
};

export type Button = StringButton | ObjectButton;

export type DefaultReactionsMap = Map<StringButton, DefaultButtonLabel>;
export type DefaultButtonsMap = Map<DefaultButtonLabel, StringButton>;
