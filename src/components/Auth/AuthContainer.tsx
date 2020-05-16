import * as antd from 'antd';
import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LoginForm } from 'components/Auth/LoginForm';
import { RegistrationForm } from 'components/Auth/RegistrationForm';
import { ForgotPasswordRequestForm, RecoveryPasswordForm } from 'components/Auth/ForgotPassword';

export const AuthContainer: FC = () => {
    return (
        <AuthPageLayout>
            <Switch>
                <Route component={LoginForm} path="/auth/login" />
                <Route component={RegistrationForm} path="/auth/registration" />
                <Route component={ForgotPasswordRequestForm} path="/auth/forgot" exact />
                <Route component={RecoveryPasswordForm} path="/auth/forgot/:token" />
                <Redirect to="/auth/login" />
            </Switch>
        </AuthPageLayout>
    );
};

const AuthPageLayout: FC = ({ children }) => {
    return (
        <antd.Layout>
            <antd.Layout.Content style={{ height: '100vh' }}>
                <antd.Row style={{ height: '100%' }} justify="center" align="middle">
                    <antd.Col lg={12} xxl={5} span={24}>
                        {children}
                    </antd.Col>
                </antd.Row>
            </antd.Layout.Content>
        </antd.Layout>
    );
};
