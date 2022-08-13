import { ChatInputCommandInteraction } from 'discord.js';

import { PagesBuilder } from '../builder';

export interface PagesInteraction extends ChatInputCommandInteraction {
    pagesBuilder: () => PagesBuilder;
}

export type Middleware = (message: PagesInteraction) => void;
