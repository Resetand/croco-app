/* eslint-disable no-sequences */
import * as colors from '@ant-design/colors';
import * as icons from '@ant-design/icons';
import * as antd from 'antd';
import { useUser } from 'components/Auth/AuthProvider';
import { BaseEmoji, Picker as EmojiPicker } from 'emoji-mart';
import moment from 'moment';
import React, { FC, useEffect, useMemo, useRef, useState, SyntheticEvent } from 'react';
import { useLobbyChat } from 'services/lobby';
import styled from 'styled-components';
import { MessageVm } from 'types/Chat';

type ChatViewProps = {
    lobbyId: string;
    onMessagedSend?: (content: string) => void;
};

export const ChatView: FC<ChatViewProps> = ({ lobbyId, onMessagedSend }) => {
    const { user } = useUser();
    const chat = useLobbyChat(lobbyId);
    const messagesViewRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        const top = messagesViewRef.current?.scrollHeight;
        messagesViewRef.current?.scrollTo({ top });
    };

    useEffect(() => scrollToBottom());

    const send = (content: string) => {
        if (content) {
            onMessagedSend?.(content);
            chat.sendMessage(content);
        }
    };

    return (
        <ChatContainer>
            <ChatMessagesContainer ref={messagesViewRef}>
                {chat.messages.map((m) => (
                    <Message message={m} key={m.id} owner={user?.id === m.author.id} />
                ))}
            </ChatMessagesContainer>
            <ChatSendContainer>
                <ChatSendPanel onSend={send} />
            </ChatSendContainer>
        </ChatContainer>
    );
};

const ChatSendPanel: FC<{ onSend: (content: string) => void; darkMode?: boolean }> = ({
    onSend,
}) => {
    const [content, setContent] = useState('');

    const picker = useMemo(
        () => (
            <EmojiPicker
                showPreview={false}
                theme="dark"
                emojiTooltip={false}
                native
                onSelect={(x: BaseEmoji) => setContent((ctn) => ctn + x.native)}
            />
        ),
        []
    );

    const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSend(content);
        setContent('');
    };

    return (
        <ChatSendForm onSubmit={onSubmit}>
            <antd.Input
                style={{ flex: 1 }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <antd.Popover content={picker} trigger="click">
                <antd.Button type="link">
                    <icons.SmileOutlined style={{ color: '#fff' }} />
                </antd.Button>
            </antd.Popover>
            <antd.Button htmlType="submit" type="link">
                Send
            </antd.Button>
        </ChatSendForm>
    );
};

const Message: FC<{ message: MessageVm; owner?: boolean }> = ({ message: m, owner }) => {
    return (
        <antd.Comment
            content={m.content}
            author={
                <antd.Typography.Text style={{ color: owner ? colors.blue[4] : '#fff' }} strong>
                    {owner ? 'You' : m.author.username}
                </antd.Typography.Text>
            }
            key={m.id}
            datetime={<span style={{ float: 'right' }}>{moment(m.createdAt).fromNow()}</span>}
        />
    );
};
const ChatContainer = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    background-color: #272f38;
    > * {
        color: #fff !important;
    }
`;

const ChatMessagesContainer = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 70px;
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    overflow-y: scroll;
    height: 100%;
`;
const ChatSendContainer = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #272f38;
    padding-bottom: 30px;

    .ant-input {
        background-color: rgb(55, 64, 76);
        color: #fff;
        border: none;
    }
`;

const ChatSendForm = styled.form`
    display: flex;
    align-items: center;
`;
