import * as icons from '@ant-design/icons';
import * as antd from 'antd';
import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuth } from 'components/Auth/AuthProvider';
import { config } from 'config';
import React, { useMemo, useCallback } from 'react';
import { Caller, clients } from 'services/api/utils';
import { Token } from 'types/common';
import { AsyncResult, error, ResultError, isError } from 'utils/result';
import * as requests from 'services/api/requests';

type CreateAxiosPayload = {
    accessToken: Token;
    setAccessToken: (t: Token) => void;
};

const handleError = (e: Error | ResultError<unknown>): ResultError<unknown> => {
    console.error(e);
    let resError: ResultError<unknown>;

    if (e instanceof Error) {
        resError = error('UNKNOWN', 'unknown error occurred', 500, e.message);
    } else {
        resError = e;
    }

    antd.notification.open({
        message: (
            <antd.Tag icon={<icons.CloseCircleOutlined />} color="error">
                Error: {resError.statusCode || e.message}
            </antd.Tag>
        ),
        description: (
            <antd.Alert type="error" message={<pre>{JSON.stringify(resError, null, 2)}</pre>} />
        ),
    });

    return resError;
};

const createAxios = ({ setAccessToken, accessToken }: CreateAxiosPayload) => {
    const instance = Axios.create({ baseURL: config.apiUrl });

    const reqInterceptor = (req: AxiosRequestConfig) => {
        console.log(JSON.stringify({ req, accessToken }));
        if (accessToken) {
            req.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return req;
    };

    const resInterceptor = (res: AxiosResponse) => {
        if (isError(res.data)) {
            handleError(res.data);
        }
        return res;
    };

    const errorInterceptor = (error: AxiosError) => {
        alert('errorInterceptor');

        if (error.response?.status === 401) {
            setAccessToken(null);
        }
        handleError(error);
        return Promise.reject(error);
    };

    instance.interceptors.request.use(reqInterceptor, errorInterceptor);
    instance.interceptors.response.use(resInterceptor, errorInterceptor);

    return instance;
};

export const useAxiosInstance = () => {
    const { accessToken, setAccessToken } = useAuth();
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
