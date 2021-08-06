import { PagesBuilder } from './PagesBuilder';

import { IPagesInteraction, Middleware, EndMethod, Action, ActionLabel } from './interfaces';

class PagesManager {

    get middleware(): Middleware {
        return (interaction: IPagesInteraction) => {
            interaction.pagesBuilder = () => new PagesBuilder(interaction);
        };
    }
}

export {
    PagesManager,
    PagesBuilder,

    EndMethod,
    Action,
    ActionLabel
};
