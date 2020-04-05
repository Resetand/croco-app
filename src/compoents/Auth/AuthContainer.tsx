import React, { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import * as antd from 'antd';
import { RegistrationForm } from './RegistrationForm';

export const AuthContainer: FC = () => {
    return (
        <Switch>
            <Route path="/auth/login">
                <AuthPageContainer>
                    <LoginForm />
                </AuthPageContainer>
            </Route>
            <Route path="/auth/registration">
                <AuthPageContainer>
                    <RegistrationForm />
                </AuthPageContainer>
            </Route>
            <Redirect to="/auth/login" />
        </Switch>
    );
};

const AuthPageContainer: FC = ({ children }) => {
    return (
        <antd.Row style={{ height: '100vh' }} justify="center" align="middle">
            <antd.Col span={5}>{children}</antd.Col>
        </antd.Row>
    );
};
