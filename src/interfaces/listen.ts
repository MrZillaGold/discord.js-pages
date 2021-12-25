export interface IResetListenTimeoutOptions {
    isFirstBuild?: boolean;
}

export enum EndMethod {
    EDIT = 'edit',
    DELETE = 'delete',
    NONE = 'none',
    COMPONENTS_REMOVE = 'components_remove',
    EMBEDS_REMOVE = 'embeds_remove'
}
export type EndMethodUnion = `${EndMethod}`;
