import * as antd from 'antd';
import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { RegistrationForm } from './RegistrationForm';

export const AuthContainer: FC = () => {
    return (
        <AuthPageLayout>
            <Switch>
                <Route path="/auth/login">
                    <LoginForm />
                </Route>
                <Route component={RegistrationForm} path="/auth/registration" />
                {/* <Route path="auth/reset" /> */}
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
