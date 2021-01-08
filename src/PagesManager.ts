import { PagesBuilder } from "./PagesBuilder";

import { IPagesMessage, Middleware } from "./interfaces/pageManager";

class PagesManager {

    get middleware(): Middleware {
        return (message: IPagesMessage) => {
            message.pagesBuilder = (options = {}) => new PagesBuilder({
                message,
                ...options
            });
        }
    }
}

export {
    PagesManager,
    PagesBuilder
}
