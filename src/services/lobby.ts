/* eslint-disable react-hooks/exhaustive-deps */
import { Stream, StreamManager } from 'openvidu-browser';
import { useEffect, useState } from 'react';
import { useApiCallback } from 'services/api/hooks';
import { ioEvent } from 'services/ioEvents';
import { useSocket } from 'services/socket';
import { MessageVm } from 'types/Chat';
import { GameSession, TermsCategoryVm } from 'types/Lobby';
import { UserVm } from 'types/User';
import { ifSuccess } from 'utils/result';
import { useUser } from 'components/Auth/AuthProvider';

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

type LobbyVm = {
    name: string;
    id: string;
    createdAt: string | Date;
};

export const useLobby = (lobbyId: string) => {
    const { user } = useUser();
    const [msToken, setMsToken] = useState<string>();
    const [processing, setProcessing] = useState(true);
    const [lobby, setLobby] = useState<LobbyVm>();
    const [termsCategory, setTermsCategory] = useState<TermsCategoryVm>();
    const [gameSession, setGameSession] = useState<GameSession>();
    const socket = useSocket(`/lobby/${lobbyId}`);

    console.log(gameSession);

    const subscribe = () => {
        socket.on(
            ioEvent('lobby.connected'),
            (args: { msToken: string; lobby: LobbyVm; gameSession: GameSession }) => {
                setLobby(args.lobby);
                setGameSession(args.gameSession);
                setMsToken(args.msToken);
                setProcessing(false);
            }
        );

        socket.on(ioEvent('lobby.game.broadcast.set_category'), (args: TermsCategoryVm) =>
            setTermsCategory(args)
        );

        socket.on(
            ioEvent('lobby.game.broadcast.session_start'),
            (args: { gameSession: GameSession }) => {
                setGameSession(args.gameSession);
            }
        );

        socket.on(ioEvent('lobby.game.broadcast.hit'), (args: { winner: UserVm }) => {
            setGameSession(undefined);
            alert(JSON.stringify(args));
        });
    };

    const sendGuess = (args: { content: string }) => {
        if (gameSession && gameSession.player.id !== user?.id) {
            socket.emit(ioEvent('lobby.game.guess'), args);
        }
    };

    const startGameSession = (args: { playerId: string; termId: string }) => {
        socket.emit(ioEvent('lobby.game.session_start'), args);
    };

    const changeCategory = (termsCategoryId: string) => {
        socket.emit(ioEvent('lobby.game.set_category'), { termsCategoryId });
    };

    useEffect(() => {
        socket.emit(ioEvent('lobby.connect'));
        subscribe();
    }, []);

    return {
        msToken,
        processing,
        changeCategory,
        termsCategory,
        lobby,
        gameSession,
        startGameSession,
        sendGuess,
        destroySession: () => setGameSession(undefined),
    };
};

type ConnectionPayload = {
    userId: string;
    username: string;
};

export const getUserByStream = (streamOrSm: StreamManager | Stream): ConnectionPayload => {
    const stream = streamOrSm instanceof StreamManager ? streamOrSm.stream : streamOrSm;
    return JSON.parse(stream.connection.data);
};
