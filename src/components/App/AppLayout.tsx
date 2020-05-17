import * as icons from '@ant-design/icons';
import * as antd from 'antd';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { useAuth } from '../Auth/AuthProvider';

export const AppLayout: FC = ({ children }) => {
    const { push } = useHistory();
    const { setAccessToken } = useAuth();

    return (
        <antd.Layout style={{ minHeight: '100vh' }}>
            <antd.Layout.Sider theme="dark" collapsed>
                <antd.Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <div className={'logo-container'} onClick={() => push('/')}>
                        <Logo style={{ width: 50 }} />
                    </div>
                    <antd.Menu.Item onClick={() => push('/lobbies/create')}>
                        <icons.PlusOutlined />
                        <antd.Typography.Text>Create lobby</antd.Typography.Text>
                    </antd.Menu.Item>

                    <antd.Menu.Item onClick={() => push('/lobbies')}>
                        <icons.OrderedListOutlined />
                        <antd.Typography.Text>Lobbies</antd.Typography.Text>
                    </antd.Menu.Item>

                    <antd.Menu.Item onClick={() => setAccessToken(null)}>
                        <icons.LogoutOutlined />
                        <antd.Typography.Text>Logout</antd.Typography.Text>
                    </antd.Menu.Item>
                </antd.Menu>
            </antd.Layout.Sider>
            <antd.Layout>
                <antd.Layout.Content className="app-content">{children}</antd.Layout.Content>
                <antd.Layout.Footer style={{ textAlign: 'center' }}>
                    Croco app ©2020
                </antd.Layout.Footer>
            </antd.Layout>
        </antd.Layout>
    );
};
