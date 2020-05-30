import * as antd from 'antd';
import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useUser } from 'components/Auth/AuthProvider';
import { config } from 'config';
import { useCallback, useMemo } from 'react';
import * as requests from 'services/api/requests';
import { Caller, clients } from 'services/api/utils';
import { showError } from 'services/notifications';
import { Token } from 'types/common';
import { AsyncResult, isError } from 'utils/result';

type CreateAxiosPayload = {
    accessToken: Token;
    setAccessToken: (t: Token) => void;
};

export const createAxios = ({ setAccessToken, accessToken }: CreateAxiosPayload) => {
    const instance = Axios.create({ baseURL: config.apiUrl, validateStatus: () => true });

    const reqInterceptor = (req: AxiosRequestConfig) => {
        if (accessToken) {
            req.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return req;
    };

    const resInterceptor = (res: AxiosResponse) => {
        if (res.status === 401) {
            setAccessToken(null);
        }
        if (isError(res.data)) {
            showError(res.data);
        }
        return res;
    };

    const errorInterceptor = (error: AxiosError) => {
        if (error.response?.status === 401) {
            setAccessToken(null);
        }
        showError(error);
        return Promise.reject(error);
    };

    instance.interceptors.request.use(reqInterceptor, errorInterceptor);
    instance.interceptors.response.use(resInterceptor, errorInterceptor);

    return instance;
};

export const useAxiosInstance = () => {
    const { accessToken, setAccessToken } = useUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => createAxios({ accessToken, setAccessToken }), [accessToken]);
};

export function useApiCallback<T extends any, P extends any[]>(
    selector: (
        registry: typeof requests,
        requestClients: typeof clients
    ) => (...args: P) => Caller<AsyncResult<T>>
) {
    const axios = useAxiosInstance();
    const caller = selector(requests, clients);

    return useCallback((...args: P) => caller(...args)(axios), [axios, caller]);
}
