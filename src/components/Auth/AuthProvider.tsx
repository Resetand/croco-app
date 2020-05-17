import Axios from 'axios';
import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { config } from 'config';
import { Token } from 'types/common';
import { OAUTH_TOKEN_KEY } from 'consts';
import { isSuccess, Result } from 'utils/result';

export type UserProfile = {
    id: string;
    username: string;
    email: string;
};

type AuthContextData = {
    user?: UserProfile;
    accessToken: Token;
    setAccessToken: (token: Token) => void;
};

export const AuthContext = createContext<AuthContextData>(null!);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem(OAUTH_TOKEN_KEY));
    const [user, setUser] = useState<UserProfile | undefined>();
    const [isLoading, setLoading] = useState(Boolean(accessToken));

    const updateUser = async () => {
        setLoading(true);
        await Axios.get<Result<UserProfile>>(`${config.apiUrl}/user`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }).then((res) => isSuccess(res.data) && setUser(res.data));
        setLoading(false);
    };

    useEffect(() => {
        accessToken ? updateUser() : setUser(undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    const setAccessTokenIml = (token: Token) => {
        setAccessToken(token);
        token
            ? localStorage.setItem(OAUTH_TOKEN_KEY, token)
            : localStorage.removeItem(OAUTH_TOKEN_KEY);
    };

    const ctx: AuthContextData = {
        user,
        setAccessToken: setAccessTokenIml,
        accessToken,
    };

    if (isLoading) {
        return null;
    }

    return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};
