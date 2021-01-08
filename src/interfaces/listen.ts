export interface IResetListenTimeoutOptions {
    isFirstBuild?: boolean;
}

export type EndMethod = "edit" | "delete";

export type ListenUser = string;

export type SetListenUsersOptions = ListenUser | ListenUser[];
