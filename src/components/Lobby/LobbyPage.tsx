/* eslint-disable react-hooks/exhaustive-deps */
import * as icons from '@ant-design/icons';
import * as antd from 'antd';
import loadingData from 'assets/loading.json';
import { ChatView } from 'components/Chat/Chat';
import { DropdownModal } from 'components/Common/DropdownModal';
import { UserVideo } from 'components/Media/UserVideo';
import moment from 'moment';
import { StreamManager } from 'openvidu-browser';
import React, { CSSProperties, FC, useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { useParams } from 'react-router-dom';
import { getUserByStream, useLobby } from 'services/lobby';
import { useMedia } from 'services/media';
import styled from 'styled-components';
import { useSetState } from 'utils/useSetState';
import { useUser } from 'components/Auth/AuthProvider';

export const LobbyPage: FC = () => {
    const { user } = useUser();
    const { lobbyId } = useParams<{ lobbyId: string }>();
    const lobby = useLobby(lobbyId);
    const media = useMedia();
    const [chatVisible, setChatVisible] = useState(false);

    const activeStreamers = [media.publisher, ...media.subscribers].filter(
        Boolean
    ) as StreamManager[];

    const mainStreamer =
        activeStreamers.find((x) => getUserByStream(x!).userId === lobby.gameSession?.player.id) ??
        media.publisher;

    const [form, patchForm, setForm] = useSetState({
        playerId: undefined as undefined | string,
    });

    const users = [media.publisher, ...media.subscribers]
        .filter(Boolean)
        .map((x) => getUserByStream(x!));

    useEffect(() => {
        if (lobby.msToken) {
            media.connect(lobby.msToken);
        }
    }, [lobby.msToken]);

    if (lobby.processing || media.processing || !media.publisher) {
        return <LoadingView />;
    }

    const deadline = lobby.gameSession?.deadlineAt
        ? moment(lobby.gameSession?.deadlineAt).toISOString()
        : undefined;

    return (
        <React.Fragment>
            <div style={{ minHeight: '100vh' }}>
                <antd.Row>
                    <antd.Col span={24}>
                        <antd.Card
                            style={lobby.gameSession ? { backgroundColor: '#d4fcf0' } : undefined}
                        >
                            <antd.Row justify="space-between" align="bottom">
                                <div style={{ display: 'flex' }}>
                                    <antd.Statistic.Countdown
                                        title="deadline"
                                        style={{ marginLeft: 20, marginRight: 20 }}
                                        onFinish={lobby.destroySession}
                                        format={'mm:ss'}
                                        value={deadline}
                                    />
                                    {lobby.gameSession?.player.id === user?.id && (
                                        <antd.Statistic
                                            title="term"
                                            valueRender={() => lobby.gameSession?.term?.content}
                                        />
                                    )}
                                </div>
                                <div>
                                    <antd.Select
                                        disabled={Boolean(lobby.gameSession)}
                                        suffixIcon={<icons.UserOutlined />}
                                        placeholder="Select player"
                                        style={{ minWidth: 300 }}
                                        value={form.playerId}
                                        onChange={(playerId) => patchForm({ playerId })}
                                    >
                                        {users.map((u) => (
                                            <antd.Select.Option value={u.userId}>
                                                {u.username}
                                            </antd.Select.Option>
                                        ))}
                                    </antd.Select>
                                    {/* <antd.Button
                                        disabled={Boolean(lobby.gameSession)}
                                        icon={<icons.ReadOutlined />}
                                    >
                                        Select term
                                    </antd.Button> */}

                                    <antd.Button
                                        disabled={
                                            Boolean(lobby.gameSession) ||
                                            Object.values(form).some((x) => !x)
                                        }
                                        onClick={() => {
                                            lobby.startGameSession({ ...(form as any) });
                                            setForm({ playerId: undefined });
                                        }}
                                        type="primary"
                                        icon={<icons.PlayCircleOutlined />}
                                    >
                                        Start game
                                    </antd.Button>
                                </div>
                            </antd.Row>
                        </antd.Card>
                        {mainStreamer && (
                            <UserVideo style={mainStreamStyles} streamManager={mainStreamer} />
                        )}
                    </antd.Col>
                </antd.Row>
                <antd.Row gutter={10} align="stretch">
                    {activeStreamers
                        .filter((x) => x !== mainStreamer)
                        .map((s) => (
                            <antd.Col key={s.id} span={4}>
                                <UserVideo style={streamStyles} size="small" streamManager={s} />
                            </antd.Col>
                        ))}
                </antd.Row>
            </div>
            <ChatOpenIconContainer>
                <antd.Button
                    size={'large'}
                    type="primary"
                    onClick={() => setChatVisible((x) => !x)}
                    shape="circle"
                    icon={<icons.MessageOutlined />}
                />
            </ChatOpenIconContainer>
            <DropdownModal
                position="bottom"
                visible={chatVisible}
                onClose={() => setChatVisible(false)}
            >
                <ChatContainer>
                    <ChatView
                        onMessagedSend={(content) => lobby.sendGuess({ content })}
                        lobbyId={lobbyId}
                    />
                </ChatContainer>
            </DropdownModal>
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

const mainStreamStyles: CSSProperties = {
    width: '100%',
    height: '80vh',
    objectFit: 'cover',
};

const streamStyles: CSSProperties = {
    width: '100%',
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
