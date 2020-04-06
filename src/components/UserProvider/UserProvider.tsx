import * as antd from 'antd';
import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { ifSuccess } from '../../utils/result';

export type AppUser = {
    id: string;
    login: string;
    email: string;
};

type UserContextData = {
    user?: AppUser;
    accessToken?: string;
    setAccessToken: (token: string, persist?: boolean) => void;
    clearToken: () => void;
};

const OAUTH_TOKEN = 'OAUTH_TOKEN';

export const UserContext = createContext<UserContextData>(null!);
export const useUser = () => useContext(UserContext);

export const UserProvider: FC = ({ children }) => {
    const [token, setToken] = useState<string | undefined>(
        localStorage.getItem(OAUTH_TOKEN) || undefined
    );
    const [user, setUser] = useState<AppUser | undefined>();
    const [isLoading, setLoading] = useState(Boolean(token));
    const api = useApi({ token });

    const getUser = async () => {
        setLoading(true);
        await api.get<AppUser>('/user').then(ifSuccess(setUser));
        setLoading(false);
    };

    useEffect(() => {
        if (token) {
            getUser();
        } else {
            setUser(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    if (isLoading) {
        return <antd.Spin />;
    }

    const setAccessTokenIml = (token: string | undefined, persistToken = true) => {
        setToken(token);
        if (!persistToken) {
            return;
        }
        if (token) {
            localStorage.setItem(OAUTH_TOKEN, token);
        } else {
            localStorage.removeItem(OAUTH_TOKEN);
        }
    };

    const ctx: UserContextData = {
        user,
        setAccessToken: setAccessTokenIml,
        accessToken: token,
        clearToken: () => setAccessTokenIml(undefined, true),
    };

    return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>;
};
