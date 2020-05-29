export type MessageVm = {
    id: string;
    author: { id: string; username: string };
    content: string;
    createdAt: Date | string;
};
