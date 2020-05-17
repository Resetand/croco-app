/* eslint-disable no-sequences */
import * as antd from 'antd';
import * as icons from '@ant-design/icons';
import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { useMediaSession } from 'services/media-service/useMedia';
// import { UserVideo } from 'components/Media/UserVideo';
import { useApiCallback } from 'services/api/hooks';
import { Lobby as LobbyT } from 'types/Lobby';
import { ColumnsType } from 'antd/lib/table';
import { ifSuccess } from 'utils/result';

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

type CreateLobbyModalProps = {
    onSuccess?: () => void;
    visible: boolean;
    onClosed: () => void;
};
export const CreateLobbyModal: FC<CreateLobbyModalProps> = ({ onSuccess, visible, onClosed }) => {
    const createLobbyReq = useApiCallback((x) => x.lobbies.create);
    const [loading, setLoading] = useState(false);
    const handle = () => {
        setLoading(true);
        createLobbyReq(name)
            .then(ifSuccess(() => onSuccess?.()))
            .finally(() => setLoading(false));
    };

    const [name, setName] = useState('');
    return (
        <antd.Modal
            bodyStyle={{ paddingTop: 50 }}
            okButtonProps={{ loading, disabled: loading }}
            onOk={handle}
            visible={visible}
            closable
            onCancel={onClosed}
        >
            <antd.Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lobby name"
            />
        </antd.Modal>
    );
};

export const LobbyList: FC = () => {
    const getLobbies = useApiCallback((x) => x.lobbies.getLobbies);
    const [lobbies, setLobbies] = useState<LobbyT[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const refetch = () => {
        setLoading(true);
        getLobbies()
            .then(ifSuccess(setLobbies))
            .finally(() => setLoading(false));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => void refetch(), []);

    const columns: ColumnsType<LobbyT> = [
        { title: 'Name', dataIndex: 'name' },
        {
            title: 'ID',
            dataIndex: 'hrId',
            render: (_, record) => (
                <antd.Tag>
                    <code>{record.hrId}</code>
                </antd.Tag>
            ),
        },
    ];
    const { push } = useHistory();

    return (
        <antd.Row style={{ padding: 16 }}>
            <antd.Row justify="center" align="middle">
                <antd.Typography.Title style={{ marginBottom: 3, marginRight: 20 }}>
                    Lobbies
                </antd.Typography.Title>

                <antd.Button
                    onClick={() => setModalVisible(true)}
                    icon={<icons.PlusOutlined />}
                    type="dashed"
                />
            </antd.Row>
            <antd.Col xs={24}>
                <antd.Table
                    loading={loading}
                    onRow={({ hrId }) => ({ onClick: () => push(`/lobbies/${hrId}`) })}
                    columns={columns}
                    dataSource={lobbies}
                />
            </antd.Col>
            <CreateLobbyModal
                visible={modalVisible}
                onClosed={() => setModalVisible(false)}
                onSuccess={() => (refetch(), setModalVisible(false))}
            />
        </antd.Row>
    );
};

export const Lobby: FC = () => {
    // const { lobbyId } = useParams<{ lobbyId: string }>();
    // const { connect, publisher, subscribers } = useMediaSession({ lobbyId });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // useEffect(() => void connect(), []);

    return (
        <antd.Row>
            <antd.Col lg={18}>
                <Stub />
                {/* {publisher !== undefined && <UserVideo stream={publisher} />} */}
            </antd.Col>

            <antd.Col lg={6}>
                {/* {subscribers.map((sub, i) => (
                    <div style={{ width: 300, height: 140, backgroundColor: '#ccc' }} key={i}>
                        <UserVideo stream={sub} />
                    </div>
                ))} */}
                <Stub />
            </antd.Col>
        </antd.Row>
    );
};

const Stub: FC<{ w?: number; h?: number }> = ({ w = 300, h = 200 }) => {
    return <div style={{ background: '#ccc', width: w, height: h }}></div>;
};
