import React from 'react';
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
        console.log({ res });

        if (isSuccess(res)) {
            setAccessToken(res.accessToken);
            history.replace('/');
        }
    };

    return (
        <antd.Form
            initialValues={{ remember: true }}
            onFinish={(values) => onFinish(values as LoginValues)}
        >
            <antd.Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
            >
                <antd.Input prefix={<UserOutlined />} placeholder="Username" />
            </antd.Form.Item>
            <antd.Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <antd.Input prefix={<LockOutlined />} type="password" placeholder="Password" />
            </antd.Form.Item>
            <antd.Form.Item>
                <antd.Form.Item name="remember" valuePropName="checked" noStyle>
                    <antd.Checkbox>Remember me</antd.Checkbox>
                </antd.Form.Item>
            </antd.Form.Item>

            <antd.Form.Item>
                <antd.Button htmlType="submit" type="primary">
                    Log in
                </antd.Button>
                <antd.Button type="link">
                    <Link to="/auth/registration">Register now!</Link>
                </antd.Button>
            </antd.Form.Item>
        </antd.Form>
    );
};
