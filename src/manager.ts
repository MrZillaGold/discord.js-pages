import { PagesBuilder } from './builder';

import { IPagesInteraction, Middleware } from './interfaces';

export class PagesManager {

    get middleware(): Middleware {
        return (interaction: IPagesInteraction) => {
            interaction.pagesBuilder = () => (
                new PagesBuilder(interaction)
            );
        };
    }
}

export * from './interfaces';
export * from './builder';
