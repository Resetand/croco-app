import React, { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { AuthContainer } from '../Auth/AuthContainer';
import { useUser } from '../UserProvider/UserProvider';
import * as antd from 'antd';

const PrivateRoute: FC<RouteProps> = ({ children, ...props }) => {
    const { user, accessToken } = useUser();
    const isLoggedIn = user && accessToken;

    return <Route {...props} render={() => (isLoggedIn ? children : <Redirect to="/auth" />)} />;
};

export const AppRedirect: FC = () => {
    const { clearToken } = useUser();
    return (
        <Router>
            <Switch>
                <PrivateRoute exact path="/">
                    <h1>Главная</h1>
                    <antd.Button onClick={() => clearToken()}>Logout</antd.Button>
                </PrivateRoute>
                <Route path="/auth">
                    <AuthContainer />
                </Route>
            </Switch>
        </Router>
    );
};
