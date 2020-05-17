export const errorCodes = [
    'NOT_FOUND',
    'BAD_REQUEST',
    'FORBIDDEN',
    'INVALID_OPERATION',
    'INTERNAL_ERROR',
    'UNAUTHORIZED',
    'TOO_MANY_REQUESTS',
    'EXPIRED',
    'UNKNOWN',
] as const;

export type ErrorCode = typeof errorCodes[number];

export type ResultError<T> = {
    __error: boolean;
    code: ErrorCode;
    statusCode: number;
    message: string;
    payload?: T;
};

export type Result<T, P = undefined> = T | ResultError<P>;

export type AsyncResult<T = unknown, P = unknown> = Promise<Result<T, P>>;

export const map = <T, R>(fn: (res: T) => R) => {
    return (res: Result<T, unknown>) => {
        if (isSuccess(res)) {
            return fn(res);
        }

        return res;
    };
};

export const ifSuccess = <T, P, R>(map: (res: T) => R | Promise<R>) => {
    return (res: Result<T, P>) => {
        if (isSuccess(res)) {
            return map(res);
        }

        return res;
    };
};

export const resultFromPromise = async <T>(
    promise: Promise<T>,
    errorCode: ErrorCode = 'INTERNAL_ERROR'
): AsyncResult<T> => {
    try {
        return await promise;
    } catch (e) {
        return error(errorCode, e.message, 400);
    }
};

export function isError<T, P>(result: Result<T, P>): result is ResultError<P> {
    return typeof result === 'object' && result !== null && '__error' in result;
}

export function throwIfError<T, P>(result: T | ResultError<P>) {
    if (isError(result)) {
        throw new Error(result.message);
    }

    return result;
}

export function isSuccess<T, P>(result: T | ResultError<P>): result is T {
    return !isError(result);
}

const createFactory = <T extends ErrorCode>(code: T, statusCode: number) => <P>(
    message: string,
    payload?: P
) => ({
    __error: true,
    code,
    message,
    statusCode,
    payload,
});

export const notFound = createFactory('NOT_FOUND', 400);
export const badRequest = createFactory('BAD_REQUEST', 400);
export const forbidden = createFactory('FORBIDDEN', 400);
export const tooManyRequests = createFactory('TOO_MANY_REQUESTS', 400);
export const expired = createFactory('EXPIRED', 400);
export const unauthorized = createFactory('UNAUTHORIZED', 401);
export const missingPermission = (permission: string) =>
    forbidden(`missing required permission: ${permission}`);
export const invalidOperation = createFactory('INVALID_OPERATION', 400);
export const internalError = createFactory('INTERNAL_ERROR', 500);
export const okResult: Result<OkResult> = { ok: true };
export type OkResult = { ok: true };

export const error = <P>(
    code: ErrorCode,
    message: string,
    httpStatusCode: number,
    payload?: P
): ResultError<P> => ({
    __error: true,
    code,
    message,
    statusCode: httpStatusCode,
    payload,
});
