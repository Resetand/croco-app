/* eslint-disable react-hooks/exhaustive-deps */
import * as antd from 'antd';
import * as icons from '@ant-design/icons';

import loadingData from 'assets/loading.json';
import { ChatView } from 'components/Chat/Chat';
import { GameBoard } from 'components/Lobby/GameBoard';
import { UserVideo } from 'components/Media.2/UserVideo';
import React, { FC, useEffect, useState, CSSProperties } from 'react';
import Lottie from 'react-lottie';
import { useParams } from 'react-router-dom';
import { useLobby } from 'services/lobby';
import { useMedia } from 'services/media';
import styled from 'styled-components';
import { FixedDropdown } from 'components/Common/FixedDropdown';
import { StreamManager } from 'openvidu-browser';

export const LobbyPage: FC = () => {
    const { lobbyId } = useParams<{ lobbyId: string }>();
    const lobby = useLobby(lobbyId);
    const media = useMedia();
    const [chatVisible, setChatVisible] = useState(false);
    const [mainStreamer, setMainStreamer] = useState<StreamManager | undefined>();

    useEffect(() => {
        setMainStreamer(media.publisher);
    }, [media.publisher]);

    useEffect(() => {
        if (lobby.msToken) {
            media.connect(lobby.msToken);
        }
    }, [lobby.msToken]);

    if (!lobby.msToken || media.processing || !media.publisher) {
        return <LoadingView />;
    }

    const mainStreamStyles: CSSProperties = {
        width: '100%',
        height: '80vh',
        objectFit: 'cover',
    };

    const streamStyles: CSSProperties = {
        width: '100%',
    };

    return (
        <React.Fragment>
            <antd.Row style={{ minHeight: '100vh' }}>
                <antd.Col span={24}>
                    <GameBoard />
                    {mainStreamer && (
                        <UserVideo style={mainStreamStyles} streamManager={mainStreamer} />
                    )}
                </antd.Col>
                <antd.Row gutter={10}>
                    {media.subscribers.map((s) => (
                        <antd.Col key={s.id} span={8}>
                            <UserVideo style={streamStyles} size="small" streamManager={s} />
                        </antd.Col>
                    ))}
                </antd.Row>
            </antd.Row>
            <ChatOpenIconContainer>
                <antd.Button
                    size={'large'}
                    type="primary"
                    onClick={() => setChatVisible((x) => !x)}
                    shape="round"
                    icon={<icons.MessageOutlined />}
                />
            </ChatOpenIconContainer>
            <FixedDropdown
                position="bottom"
                visible={chatVisible}
                onClose={() => setChatVisible(false)}
            >
                <ChatContainer>
                    <ChatView lobbyId={lobbyId} />
                </ChatContainer>
            </FixedDropdown>
        </React.Fragment>
    );
};

const LoadingView: FC = () => {
    const opt = { loop: true, autoplay: true, animationData: loadingData };
    return (
        <antd.Row style={{ textAlign: 'center', height: '100%' }} justify="center" align="middle">
            <div>
                <Lottie options={opt} height={300} width={300} />
                <antd.Typography.Title level={3}>Connecting...</antd.Typography.Title>
            </div>
        </antd.Row>
    );
};

const ChatOpenIconContainer = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    transform: scale(1.3);
`;

const ChatContainer = styled.div`
    width: 100%;
    height: 500px;
`;
