/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-sequences */
import * as antd from 'antd';
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLobby } from 'services/lobby';
import { ChatView } from 'components/Chat/Chat';
import { useMedia } from 'services/media';
import loadingData from 'assets/loading.json';
import Lottie from 'react-lottie';
import { UserVideo } from 'components/Media/UserVideo';
import { GameBoard } from 'components/Lobby/GameBoard';

export const LobbyPage: FC = () => {
    const { lobbyId } = useParams<{ lobbyId: string }>();
    const lobby = useLobby(lobbyId);

    if (!lobby.msToken) {
        return <LoadingView />;
    }

    return (
        <antd.Row style={{ height: '100%' }}>
            <antd.Col span={18}>
                <GameBoard />
                <LobbyLayout msToken={lobby.msToken} />
            </antd.Col>
            <antd.Col style={{ display: 'flex', alignItems: 'flex-end' }} span={6}>
                <ChatView lobbyId={lobbyId} />
            </antd.Col>
        </antd.Row>
    );
};

const LobbyLayout: FC<{ msToken: string }> = ({ msToken }) => {
    const media = useMedia();
    useEffect(() => void media.connect(msToken), []);

    if (media.processing) {
        return <LoadingView />;
    }

    if (!media.publisher) {
        return null;
    }

    return (
        <React.Fragment>
            <UserVideo streamManager={media.publisher} />

            <antd.Row style={{ maxHeight: 200 }}>
                {media.subscribers.map((s) => (
                    <antd.Col key={s.id} span={4}>
                        <UserVideo streamManager={s} />
                    </antd.Col>
                ))}
            </antd.Row>
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
