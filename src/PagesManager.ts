import { PagesBuilder } from "./PagesBuilder";

import { IPagesInteraction, IPagesMessage, Middleware } from "./interfaces/pageManager";

class PagesManager {

    get middleware(): Middleware {
        return (message: IPagesMessage | IPagesInteraction) => {
            message.pagesBuilder = (options = {}) => new PagesBuilder({
                message,
                ...options
            });
        };
    }
}

export {
    PagesManager,
    PagesBuilder
};
