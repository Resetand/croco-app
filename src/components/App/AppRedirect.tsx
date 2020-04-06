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
import { HomePage } from '../Home/HomePage';
import { useUser } from '../UserProvider/UserProvider';
import * as antd from 'antd';

const PrivateRoute: FC<RouteProps> = ({ children, ...props }) => {
    const { user, accessToken } = useUser();
    const isLoggedIn = Boolean(user && accessToken);

    return <Route {...props}>{isLoggedIn ? children : <Redirect to="/auth" />}</Route>;
};

export const AppRedirect: FC = () => (
    <Router>
        <Switch>
            <PrivateRoute component={HomePage} exact path="/" />
            <Route component={AuthContainer} path="/auth" />
            <Route component={NotFoundPage} />
        </Switch>
    </Router>
);

const NotFoundPage: FC = () => {
    const { goBack } = useHistory();
    const extra = (
        <antd.Button type="primary" size="large" onClick={goBack}>
            Go back?
        </antd.Button>
    );

    return (
        <antd.Row justify="center" align="middle" style={{ height: '100vh' }}>
            <antd.Result status="404" title="404. Page not found :(" extra={extra} />
        </antd.Row>
    );
};
