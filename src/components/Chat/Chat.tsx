/* eslint-disable no-sequences */
import * as colors from '@ant-design/colors';
import * as icons from '@ant-design/icons';
import * as antd from 'antd';
import { useUser } from 'components/Auth/AuthProvider';
import { BaseEmoji, Picker as EmojiPicker } from 'emoji-mart';
import moment from 'moment';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useLobbyChat } from 'services/lobby';
import styled from 'styled-components';
import { MessageVm } from 'types/Chat';

export const ChatView: FC<{ lobbyId: string }> = ({ lobbyId }) => {
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

const ChatSendPanel: FC<{ onSend: (content: string) => void }> = ({ onSend }) => {
    const [content, setContent] = useState('');

    const picker = useMemo(
        () => (
            <EmojiPicker
                showPreview={false}
                theme="light"
                emojiTooltip={false}
                native
                onSelect={(x: BaseEmoji) => setContent((ctn) => ctn + x.native)}
            />
        ),
        []
    );

    return (
        <antd.Form layout="inline" onFinish={() => (onSend(content), setContent(''))}>
            <antd.Form.Item style={{ width: 270 }}>
                <antd.Input value={content} onChange={(e) => setContent(e.target.value)} />
            </antd.Form.Item>
            <antd.Form.Item>
                <antd.Popover content={picker} trigger="click">
                    <icons.SmileOutlined />
                </antd.Popover>
                <antd.Button htmlType="submit" type="link">
                    Send
                </antd.Button>
            </antd.Form.Item>
        </antd.Form>
    );
};

const Message: FC<{ message: MessageVm; owner?: boolean }> = ({ message: m, owner }) => {
    return (
        <antd.Comment
            content={m.content}
            author={
                <antd.Typography.Text style={owner ? { color: colors.blue[4] } : undefined} strong>
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
    border: 1px solid ${colors.geekblue[0]};
    border-radius: 4px;
`;

const ChatMessagesContainer = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 70px;
    padding-top: 10px;

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
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 30px;
    background: #fff;
`;
