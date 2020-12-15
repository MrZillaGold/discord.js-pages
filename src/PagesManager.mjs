import { PagesBuilder } from "./PagesBuilder";

class PagesManager {

    get middleware() {
        return (message) => {
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
