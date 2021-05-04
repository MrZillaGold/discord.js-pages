import { Message } from "discord.js";

import { PagesBuilder } from "../PagesBuilder";

export interface IPagesMessage extends Message {
    pagesBuilder: (options?: Record<string, unknown>) => PagesBuilder;
}

export type Middleware = (message: IPagesMessage) => void;
