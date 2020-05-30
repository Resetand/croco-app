import { UserVm } from 'types/User';

export type MessageVm = {
    id: string;
    author: UserVm;
    content: string;
    createdAt: Date | string;
};
