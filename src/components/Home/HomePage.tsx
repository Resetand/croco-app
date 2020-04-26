import * as antd from 'antd';
import React, { FC, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useMediaSession } from '../../hooks/useMedia';
import { UserVideo } from '../Media/UserVideo';

export const HomePage: FC = () => {
    return (
        <antd.Row>
            <antd.Typography.Title>Croco app</antd.Typography.Title>
        </antd.Row>
    );
};

export const Rooms: FC = () => {
    const rooms = [{ id: 'default', name: 'default' }];
    const columns = [{ title: 'Name', dataIndex: 'name' }];
    const { push } = useHistory();

    return (
        <antd.Row style={{ padding: 16 }}>
            <antd.Typography.Title>Rooms</antd.Typography.Title>
            <antd.Col xs={24}>
                <antd.Table
                    onRow={({ id }) => ({
                        onClick: () => push(`/conference/${id}`),
                    })}
                    columns={columns}
                    dataSource={rooms}
                />
            </antd.Col>
        </antd.Row>
    );
};

export const Conference: FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const { joinSession, streamManager, subscribers } = useMediaSession(roomId);

    useEffect(() => joinSession(), []);

    return (
        <antd.Row>
            <antd.Col lg={18}>
                {streamManager !== undefined && <UserVideo streamManager={streamManager} />}
            </antd.Col>
            <antd.Col lg={6}>
                {subscribers.map((sub, i) => (
                    <div style={{ width: 300, height: 140, backgroundColor: '#ccc' }} key={i}>
                        <UserVideo streamManager={sub} />
                    </div>
                ))}
            </antd.Col>
        </antd.Row>
    );
};
