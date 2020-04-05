import React, { FC } from 'react';
import { UserProvider } from '../UserProvider/UserProvider';
import { AppRedirect } from './AppRedirect';

export const App: FC = () => (
    <UserProvider>
        <AppRedirect />
    </UserProvider>
);
