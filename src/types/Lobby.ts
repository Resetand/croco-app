import { UserVm } from 'types/User';

export type LobbyVm = {
    id: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};

export type TermsCategoryVm = {
    name: string;
    id: string;
};

export type TermVm = {
    id: string;
    content: string;
};

export type GameSession = {
    deadlineAt: string | Date;
    player: UserVm;
    term?: TermVm;
};
