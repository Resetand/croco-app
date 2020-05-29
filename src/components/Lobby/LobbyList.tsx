/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-sequences */
import * as icons from '@ant-design/icons';
import * as antd from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useApiCallback } from 'services/api/hooks';
import { Lobby as LobbyT } from 'types/Lobby';
import { ifSuccess } from 'utils/result';

export const HomePage: FC = () => {
    return (
        <antd.Row>
            <antd.Typography.Title>Croco app</antd.Typography.Title>
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
            dataIndex: 'id',
            render: (_, record) => (
                <antd.Tag>
                    <code>{record.id}</code>
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
                    onRow={({ id }) => ({ onClick: () => push(`/lobbies/${id}`) })}
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
