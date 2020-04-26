import { LogoutOutlined, OrderedListOutlined } from '@ant-design/icons';
import * as antd from 'antd';
import React, { FC, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { Conference, HomePage, Rooms } from '../Home/HomePage';
import { useUser } from '../UserProvider/UserProvider';

export const AppLayoutContainer: FC = () => {
    const [siderVisible, setSiderVisible] = useState(false);
    const { push } = useHistory();
    const { clearToken } = useUser();

    return (
        <antd.Layout style={{ minHeight: '100vh' }}>
            <antd.Layout.Sider
                theme="dark"
                collapsible
                collapsed={!siderVisible}
                onCollapse={() => setSiderVisible(false)}
            >
                <antd.Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <div
                        onClick={() => push('/')}
                        style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}
                    >
                        <Logo style={{ width: 50 }} />
                    </div>
                    <antd.Menu.Item onClick={() => push('/rooms')}>
                        <OrderedListOutlined />
                        <antd.Typography.Text>Rooms</antd.Typography.Text>
                    </antd.Menu.Item>
                    <antd.Menu.Item onClick={clearToken}>
                        <LogoutOutlined />
                        <antd.Typography.Text>Logout</antd.Typography.Text>
                    </antd.Menu.Item>
                </antd.Menu>
            </antd.Layout.Sider>
            <antd.Layout>
                {/* <antd.Layout.Header style={{ padding: 0 }} /> */}
                <antd.Layout.Content style={{ margin: '0', backgroundColor: '#fff' }}>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/rooms" component={Rooms} />
                        <Route path="/conference/:roomId" component={Conference} />
                        <Route component={NotFoundPage} />
                    </Switch>
                </antd.Layout.Content>
                <antd.Layout.Footer style={{ textAlign: 'center' }}>
                    Croco app ©2020
                </antd.Layout.Footer>
            </antd.Layout>
        </antd.Layout>
    );
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
