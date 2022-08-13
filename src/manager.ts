import { PagesBuilder } from './builder';

import { PagesInteraction, Middleware } from './types';

export class PagesManager {

    get middleware(): Middleware {
        return (interaction: PagesInteraction) => {
            interaction.pagesBuilder = () => (
                new PagesBuilder(interaction)
            );
        };
    }
}

export * from './types';
export * from './builder';
