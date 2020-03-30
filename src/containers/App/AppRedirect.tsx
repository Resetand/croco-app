import React, { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { SignIn } from '../SignIn/SignIn';
import { useUser } from '../UserProvider/UserProvider';

const PrivateRoute: FC<RouteProps> = ({ children, ...props }) => {
    const { user, accessToken } = useUser();
    const isLoggedIn = user && accessToken;

    return <Route {...props} render={() => (isLoggedIn ? children : <Redirect to="/auth" />)} />;
};

export const AppRedirect: FC = () => {
    return (
        <Router>
            <Switch>
                <PrivateRoute exact path="/">
                    <h1>Главная</h1>
                </PrivateRoute>
                <Route path="/auth">
                    <SignIn />
                </Route>
            </Switch>
        </Router>
    );
};
