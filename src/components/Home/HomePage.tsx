import * as antd from 'antd';
import React, { FC, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useMediaSession } from '../../hooks/useMedia';
import { UserVideo } from '../Media/UserVideo';

export const HomePage: FC = () => {
    return (
        <antd.Row style={{ padding: 16 }}>
            <antd.Typography.Title>Croco app</antd.Typography.Title>
            <antd.Col xs={24}>
                <antd.Typography.Title level={2}>How to play</antd.Typography.Title>
            </antd.Col>
            <antd.Col xs={16}>
                <antd.Typography.Paragraph strong={true}>Croco is an application in which one player shows a randomly selected word to other players. This player is selected randomly at the beginning of the game, and then the one who guessed the word becomes that player.</antd.Typography.Paragraph>
                <antd.Typography.Paragraph strong={true}>Our application consists of rooms. You can <Link to=''>create your own</Link> or <Link to='/rooms'>go into an existing one</Link>.</antd.Typography.Paragraph>
                <antd.Typography.Paragraph strong={true}>The presenter is given a choice of 5 random words. He selects one of them and shows it through a video broadcast. Other users write their answers to the chat. If the answer is correct, the system will determine this, and you will display the next word.</antd.Typography.Paragraph>
            </antd.Col>
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
