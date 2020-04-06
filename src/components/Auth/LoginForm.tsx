import React, { Fragment } from 'react';
import * as antd from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { isSuccess } from '../../utils/result';
import { useUser } from '../UserProvider/UserProvider';

type LoginValues = {
    username: string;
    password: string;
    remember: boolean;
};

export const LoginForm = () => {
    const { post } = useApi();
    const { setAccessToken } = useUser();
    const history = useHistory();

    const onFinish = async (values: LoginValues) => {
        const res = await post<{ accessToken: string }>('/auth/login', {
            password: values.password,
            username: values.username,
        });

        if (isSuccess(res)) {
            setAccessToken(res.accessToken, values.remember);
            history.replace('/');
        }
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
                            <antd.Checkbox>Remember me</antd.Checkbox>
                        </antd.Form.Item>
                        <Link style={{ float: 'right' }} to="/auth/forgot">
                            Forgot password?
                        </Link>
                    </antd.Form.Item>

                    <antd.Form.Item>
                        <antd.Button htmlType="submit" type="primary">
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
