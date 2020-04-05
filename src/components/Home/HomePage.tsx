import React, { FC } from 'react';
import { useUser } from '../UserProvider/UserProvider';
import * as antd from 'antd';

export const HomePage: FC = () => {
    const { clearToken } = useUser();
    return (
        <antd.Layout>
            <h1>Главная</h1>
            <antd.Button onClick={() => clearToken()}>Logout</antd.Button>
        </antd.Layout>
    );
};
