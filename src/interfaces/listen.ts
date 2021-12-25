export interface IResetListenTimeoutOptions {
    isFirstBuild?: boolean;
}

export enum EndMethod {
    EDIT = 'edit',
    DELETE = 'delete',
    NONE = 'none'
}
export type EndMethodUnion = `${EndMethod}`;
