export interface IResetListenTimeoutOptions {
    isFirstBuild?: boolean;
}

export enum EndMethod {
    EDIT = 'edit',
    DELETE = 'delete'
}
export type EndMethodUnion = `${EndMethod}`;
