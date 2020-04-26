import { OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';
import { useEffect, useState, useRef } from 'react';

import { msAxios } from './useMsApi';
import { useUser } from '../components/UserProvider/UserProvider';
import { config } from '../config';

const createToken = async (sessionId: string): Promise<string> => {
    return msAxios
        .post('/api/tokens', JSON.stringify({ session: sessionId }))
        .then((res) => res.data.token);
};

const createSession = async (customSessionId: string): Promise<string> => {
    const errorMsg = `This may be a certificate error. Click OK to navigate and accept it.`;

    return msAxios
        .post('/api/sessions', JSON.stringify({ customSessionId }))
        .then((res) => res.data.id)
        .catch((error) => {
            if ((error.response || {}).status === 409) {
                return customSessionId;
            }
            if (window.confirm(errorMsg)) {
                window.location.assign(config.openVidu.serverUrl + '/accept-certificate');
            }
        });
};

export const useMediaSession = (customSessionId: string) => {
    const ov = useRef(new OpenVidu()).current;
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [session, setSession] = useState<Session>();
    const [streamManager, setStreamManager] = useState<StreamManager>();
    const [publisher, setPublisher] = useState<Publisher>();
    const { user } = useUser();

    const joinSession = () => setSession(ov.initSession());

    const leaveSession = () => {
        session?.disconnect();
        setSession(undefined);
        setSubscribers([]);
        setStreamManager(undefined);
        setPublisher(undefined);
    };

    const getToken = async () => {
        const sessionId = await createSession(customSessionId);
        return createToken(sessionId);
    };

    const bootstrapSession = async (s: Session) => {
        s.on('streamCreated', (event: any) =>
            setSubscribers((prev) => [...prev, s.subscribe(event.stream, undefined!)])
        );

        s.on('streamDestroyed', (event: any) => {
            setSubscribers((prev) => prev.filter((cur) => cur !== event.stream.streamManager));
        });

        const token = await getToken();
        await s.connect(token, { clientData: user });

        const publisher = await ov.initPublisherAsync(undefined!, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
        });

        s.publish(publisher);
        setStreamManager(publisher);
        setPublisher(publisher);
    };

    useEffect(() => {
        if (session) {
            bootstrapSession(session);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    useEffect(() => () => leaveSession(), []);

    return { joinSession, streamManager, subscribers, publisher, leaveSession };
};
