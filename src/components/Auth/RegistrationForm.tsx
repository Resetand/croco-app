import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import * as antd from 'antd';
import React, { FC, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from 'components/Auth/AuthProvider';
import { useApiCallback } from 'services/api/hooks';
import { ifSuccess } from 'utils/result';

type RegistrationValues = {
    username: string;
    password: string;
    email: string;
    remember: boolean;
};

export const RegistrationForm: FC = () => {
    const { setAccessToken } = useAuth();
    const history = useHistory();
    const registerReq = useApiCallback((x) => x.auth.register);

    const onFinish = async (values: RegistrationValues) => {
        await registerReq(values).then(
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
                title="Create an account"
                bordered={false}
            >
                <antd.Form
                    initialValues={{ remember: true }}
                    onFinish={(values) => onFinish(values as RegistrationValues)}
                >
                    <antd.Form.Item name="username" rules={[{ required: true }]}>
                        <antd.Input prefix={<UserOutlined />} placeholder="Username" />
                    </antd.Form.Item>
                    <antd.Form.Item name="email" rules={[{ required: true }]}>
                        <antd.Input prefix={<MailOutlined />} placeholder="Email" />
                    </antd.Form.Item>
                    <antd.Form.Item name="password" rules={[{ required: true }]}>
                        <antd.Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                        />
                    </antd.Form.Item>
                    <antd.Form.Item>
                        <antd.Form.Item name="remember" valuePropName="checked" noStyle>
                            <antd.Checkbox>Remember me</antd.Checkbox>
                        </antd.Form.Item>
                    </antd.Form.Item>

                    <antd.Form.Item>
                        <antd.Button htmlType="submit" type="primary">
                            Register
                        </antd.Button>
                    </antd.Form.Item>
                </antd.Form>
            </antd.Card>
            <antd.Row style={{ marginTop: 20 }} justify="center">
                Do you already have account?
            </antd.Row>
            <antd.Row justify="center">
                <Link to="/auth/login">Login</Link>
            </antd.Row>
        </Fragment>
    );
};
