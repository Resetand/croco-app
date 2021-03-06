import { OAUTH_TOKEN_KEY } from 'consts';
import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { createAxios } from 'services/api/hooks';
import { Token } from 'types/common';
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
export const useUser = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem(OAUTH_TOKEN_KEY));
    const [user, setUser] = useState<UserProfile | undefined>();
    const [isLoading, setLoading] = useState(Boolean(accessToken));

    const setAccessTokenIml = (token: Token) => {
        setAccessToken(token);
        token
            ? localStorage.setItem(OAUTH_TOKEN_KEY, token)
            : localStorage.removeItem(OAUTH_TOKEN_KEY);
    };

    const updateUser = async () => {
        setLoading(true);
        const axios = createAxios({ accessToken, setAccessToken: setAccessTokenIml });
        await axios
            .get<Result<UserProfile>>(`/user`)
            .then((res) => isSuccess(res.data) && setUser(res.data));
        setLoading(false);
    };

    useEffect(() => {
        accessToken ? updateUser() : setUser(undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

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
