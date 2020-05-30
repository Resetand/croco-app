import { clients } from 'services/api/utils';
import { LobbyVm } from 'types/Lobby';
import { MessageVm } from 'types/Chat';

type RegistrationData = {
    username: string;
    password: string;
    email: string;
};

export const auth = {
    login: (data: { password: string; username: string }) => {
        return clients.post<{ accessToken: string }>('/auth/login', { data });
    },
    forgotPasswordConfirm: (token: string, password: string) => {
        return clients.post('/auth/forgot_password/confirm', { data: { token, password } });
    },
    forgotPasswordRequest: (usernameOrEmail: string) => {
        return clients.post('/auth/forgot_password', { data: { usernameOrEmail } });
    },
    register: (data: RegistrationData) => {
        return clients.post<{ accessToken: string }>('/auth/register', { data });
    },
};

export const lobbies = {
    create: (name: string) => clients.post('/lobbies', { data: { name } }),
    getLobbies: () => clients.get<LobbyVm[]>('/lobbies'),
};

export const chat = {
    getMessages: (lobby_id: string) => {
        return clients.get<MessageVm[]>('chat/messages', { params: { lobby_id } });
    },
};
