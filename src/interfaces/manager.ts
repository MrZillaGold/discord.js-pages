import { CommandInteraction } from 'discord.js';

import { PagesBuilder } from '../builder';

export interface IPagesInteraction extends CommandInteraction {
    pagesBuilder: () => PagesBuilder;
}

export type Middleware = (message: IPagesInteraction) => void;
