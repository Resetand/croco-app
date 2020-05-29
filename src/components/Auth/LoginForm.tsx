import { LockOutlined, UserOutlined } from '@ant-design/icons';
import * as antd from 'antd';
import React, { Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ifSuccess } from 'utils/result';
import { useApiCallback } from 'services/api/hooks';
import { useUser } from 'components/Auth/AuthProvider';

type LoginValues = {
    username: string;
    password: string;
    remember: boolean;
};

export const LoginForm = () => {
    const { setAccessToken } = useUser();
    const history = useHistory();
    const login = useApiCallback((x) => x.auth.login);

    const onFinish = async (values: LoginValues) => {
        login(values).then(
            ifSuccess((res) => {
                setAccessToken(res.accessToken);
                history.replace('/');
            })
        );
    };

    return (
        <Fragment>
            <antd.Card
                headStyle={{ fontSize: 25, textAlign: 'center' }}
                title="Login"
                bordered={false}
            >
                <antd.Form
                    initialValues={{ remember: true }}
                    onFinish={(values) => onFinish(values as LoginValues)}
                >
                    <antd.Form.Item name="username" rules={[{ required: true }]}>
                        <antd.Input prefix={<UserOutlined />} placeholder="Username" />
                    </antd.Form.Item>
                    <antd.Form.Item name="password" rules={[{ required: true }]}>
                        <antd.Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </antd.Form.Item>
                    <antd.Form.Item>
                        <antd.Form.Item name="remember" valuePropName="checked" noStyle>
                            <antd.Checkbox value={true}>Remember me</antd.Checkbox>
                        </antd.Form.Item>
                        <Link style={{ float: 'right' }} to="/auth/forgot">
                            Forgot password?
                        </Link>
                    </antd.Form.Item>

                    <antd.Form.Item>
                        <antd.Button block htmlType="submit" type="primary">
                            Login
                        </antd.Button>
                    </antd.Form.Item>
                </antd.Form>
            </antd.Card>

            <antd.Row style={{ marginTop: 20 }} justify="center">
                Do not have account?
            </antd.Row>
            <antd.Row justify="center">
                <Link to="/auth/registration">Register now!</Link>
            </antd.Row>
        </Fragment>
    );
};
