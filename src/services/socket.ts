/* eslint-disable react-hooks/exhaustive-deps */
import { useUser } from 'components/Auth/AuthProvider';
import { config } from 'config';
import { useEffect, useRef } from 'react';
import { ioEvent } from 'services/ioEvents';
import { showError } from 'services/notifications';
import io from 'socket.io-client';

export const useSocket = (
    namespace: string,
    query: Record<string, string> = {},
    opt: SocketIOClient.ConnectOpts = {}
) => {
    const { accessToken } = useUser();
    const socket = useRef(
        io(`${config.apiHost}${namespace ?? ''}`, { ...opt, query: { ...query, accessToken } })
    );
    useEffect(() => {
        socket.current.connect();

        socket.current.on(ioEvent('user.error'), (error: any) => showError(error));

        return () => {
            socket.current.removeAllListeners();
            socket.current.close();
        };
    }, [socket]);
    return socket.current;
};
