/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSocket } from 'services/socket';
import { MessageVm } from 'types/Chat';
import { useApiCallback } from 'services/api/hooks';
import { ioEvent } from 'services/ioEvents';
import { ifSuccess } from 'utils/result';
import { StreamManager, Stream } from 'openvidu-browser';

export const useLobbyChat = (lobbyId: string) => {
    const [messages, setMessages] = useState<MessageVm[]>([]);
    const [loading, setLoading] = useState(false);
    const socket = useSocket(`/chat/${lobbyId}`);
    const getMessages = useApiCallback((x) => x.chat.getMessages);

    const prefetch = async () => {
        setLoading(true);
        await getMessages(lobbyId).then(ifSuccess(setMessages));
        setLoading(false);
    };

    const sendMessage = (content: string) => {
        socket.emit(ioEvent('chat.messages.new'), { content });
    };

    const subscribe = () => {
        socket.on(ioEvent('chat.messages.broadcast.new'), (message: MessageVm) => {
            console.log('chat.messages.broadcast.new', JSON.stringify(message));
            setMessages((prev) => [...prev, message]);
        });
    };

    useEffect(() => void prefetch(), []);
    useEffect(subscribe, []);

    return {
        loading,
        messages,
        sendMessage,
    };
};

export const useLobby = (lobbyId: string) => {
    const [msToken, setMsToken] = useState<string>();
    const socket = useSocket(`/lobby/${lobbyId}`);

    const subscribe = () => {
        // alert('here');
        socket.on(ioEvent('lobby.connected'), (args: { msToken: string }) => {
            setMsToken(args.msToken);
        });
    };

    useEffect(() => {
        socket.emit(ioEvent('lobby.connect'));
        subscribe();
    }, []);

    return { msToken };
};

type ConnectionPayload = {
    userId: string;
    username: string;
};

export const getUserByStream = (streamOrSm: StreamManager | Stream): ConnectionPayload => {
    const stream = streamOrSm instanceof StreamManager ? streamOrSm.stream : streamOrSm;
    return JSON.parse(stream.connection.data);
};
