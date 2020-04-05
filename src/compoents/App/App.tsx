import React, { FC } from 'react';
import { UserProvider } from '../UserProvider/UserProvider';
import './App.scss';
import { AppRedirect } from './AppRedirect';

export const App: FC = () => {
    return (
        <UserProvider>
            <AppRedirect />
        </UserProvider>
    );
};
