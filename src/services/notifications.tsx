import * as antd from 'antd';
import React from 'react';
import { error, isError, ResultError } from 'utils/result';

export const showError = (e: Error | ResultError<unknown>): ResultError<unknown> => {
    let resError = isError(e) ? e : error('UNKNOWN', 'unknown error occurred', 500, e.message);

    const message = (
        <React.Fragment>
            {resError.message}

            {resError.statusCode && (
                <antd.Tag style={{ marginLeft: 10 }} color="error">
                    {resError.statusCode}
                </antd.Tag>
            )}
        </React.Fragment>
    );

    antd.notification.error({
        message,
    });

    return resError;
};
