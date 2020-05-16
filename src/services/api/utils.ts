import { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import { AsyncResult } from 'utils/result';

export type Caller<T> = (axios: AxiosInstance) => T;

const createClient = (method: Method) => {
    return <T>(url: string, config: Partial<AxiosRequestConfig> = {}): Caller<AsyncResult<T>> => {
        return (axios) => axios.request({ method, url, ...config }).then((res) => res.data);
    };
};

export const clients = {
    get: createClient('get'),
    post: createClient('post'),
    patch: createClient('patch'),
};
