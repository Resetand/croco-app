import * as antd from 'antd';
import React, { FC } from 'react';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    RouteProps,
    Switch,
    useHistory,
} from 'react-router-dom';
import { AuthContainer } from '../Auth/AuthContainer';
import { useUser } from '../UserProvider/UserProvider';
import { AppLayoutContainer } from './AppLayout';

const PrivateRoute: FC<RouteProps> = ({ children, ...props }) => {
    const { user, accessToken } = useUser();
    const isLoggedIn = Boolean(user && accessToken);

    return <Route {...props}>{isLoggedIn ? children : <Redirect to="/auth" />}</Route>;
};

export const AppRedirect: FC = () => (
    <Router>
        <Switch>
            <Route component={AuthContainer} path="/auth" />
            <PrivateRoute component={AppLayoutContainer} path="/" />
        </Switch>
    </Router>
);
