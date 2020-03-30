import { makeUseAxios, Options, ResponseValues, RefetchOptions } from 'axios-hooks';
import * as antd from 'antd';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import React, { Fragment, useEffect } from 'react';
import { AsyncResult, error, isError, ResultError } from '../utils/result';
import { useUser } from '../containers/UserProvider/UserProvider';

export const useApi = (args: { token?: string | null } = {}) => {
    const user = useUser();
    const headers: Record<string, string> = {};
    if (args.token) {
        headers['Authorization'] = `Bearer ${args.token}`;
    } else if (args.token !== null && user?.accessToken) {
        headers['Authorization'] = `Bearer ${user.accessToken}`;
    }

    // FIXME
    const instance = axios.create({
        baseURL: 'http://localhost:4001',
        headers
    });

    const useAxios = makeUseAxios({ axios: instance });

    return {
        post: function<T>(url: string, data?: any, config?: AxiosRequestConfig): AsyncResult<T> {
            return instance
                .post<T>(url, data, config)
                .then(x => x.data)
                .catch(handleError);
        },
        get: function<T>(url: string, config?: AxiosRequestConfig): AsyncResult<T> {
            return instance
                .get<T>(url, config)
                .then(x => x.data)
                .catch(handleError);
        },
        useAxios: function<T = any>(
            config: AxiosRequestConfig | string,
            options?: Options
        ): [
            ResponseValues<T>,
            (config?: AxiosRequestConfig, options?: RefetchOptions) => AxiosPromise<T>
        ] {
            const [{ data, loading, error, response }, refetch] = useAxios(config, options);
            useEffect(() => {
                if (error) {
                    handleError(error);
                }
            }, [error]);

            return [{ data, loading, error, response }, refetch];
        }
    };
};

const handleError = (e: any): ResultError<unknown> => {
    console.error(e);

    let resError: ResultError<unknown>;
    if (isError(e.response?.data)) {
        resError = e.response.data;
    } else {
        resError = error('UNKNOWN', 'Произшла неизвестная ошибка', e.status, e.response);
    }

    antd.notification.open({
        message: (
            <Fragment>
                <antd.Tag color="red">{resError.statusCode || e.message}</antd.Tag>
                Произошла ошибка
            </Fragment>
        ),
        description: (
            <antd.Collapse>
                <antd.Collapse.Panel header={resError.message} key="0">
                    <antd.Alert
                        type="error"
                        message={<pre>{JSON.stringify(resError.payload, null, 2)}</pre>}
                    />
                </antd.Collapse.Panel>
            </antd.Collapse>
        )
    });

    return resError;
};
