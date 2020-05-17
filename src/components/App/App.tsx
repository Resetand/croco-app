import { AppLayout } from 'components/App/AppLayout';
import { AppRedirect } from 'components/App/AppRedirect';
import { AuthProvider } from 'components/Auth/AuthProvider';
import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss';

export const App: FC = () => (
    <AuthProvider>
        <Router>
            <AppLayout>
                <AppRedirect />
            </AppLayout>
        </Router>
    </AuthProvider>
);
