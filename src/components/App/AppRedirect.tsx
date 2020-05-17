import * as antd from 'antd';
import { Lobby, HomePage, LobbyList, CreateLobbyModal } from 'components/Home/HomePage';
import React, { FC } from 'react';
import { Redirect, Route, RouteProps, Switch, useHistory } from 'react-router-dom';
import { AuthContainer } from 'components/Auth/AuthContainer';
import { useAuth } from 'components/Auth/AuthProvider';

export const AppRedirect: FC = () => (
    <Switch>
        <Route component={AuthContainer} path="/auth" />
        <PrivateRoute exact component={HomePage} path="/" />
        <PrivateRoute exact component={LobbyList} path="/lobbies" />
        <PrivateRoute exact component={Lobby} path="/lobbies/:lobbyId" />
        <PrivateRoute exact component={CreateLobbyModal} path="/lobbies/create" />
        <Route component={NotFoundPage} />
    </Switch>
);

const PrivateRoute: FC<RouteProps> = ({ children, ...props }) => {
    const { user, accessToken } = useAuth();
    const isLoggedIn = Boolean(user && accessToken);

    return <Route {...props}>{isLoggedIn ? children : <Redirect to="/auth" />}</Route>;
};

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
