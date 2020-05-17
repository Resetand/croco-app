import { OpenVidu, Publisher, Session, StreamEvent, Subscriber } from 'openvidu-browser';
import { useEffect, useRef, useState } from 'react';
import { useApiCallback } from 'services/api/hooks';
import { ifSuccess } from 'utils/result';

type MediaSessionOptions = {
    lobbyId: string;
    broadcastAudio?: boolean;
    broadcastVideo?: boolean;
};

export const useMediaSession = (options: MediaSessionOptions) => {
    const ov = useRef(new OpenVidu()).current;

    // const { user } = useAuth();

    const { lobbyId, broadcastAudio = true, broadcastVideo = true } = options;
    const [publisher, setPublisher] = useState<Publisher>();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [processing, setProcessing] = useState(false);
    const sessionRef = useRef<Session>();

    const getTokenReq = useApiCallback((x) => x.lobbies.getToken);

    const subscribe = () => {
        const session = sessionRef.current!;

        session.on('streamCreated', (e) => {
            const event = e as StreamEvent;
            const subscriber = session.subscribe(event.stream, undefined!)!;
            setSubscribers((prev) => [...prev, subscriber]);
        });

        session.on('streamDestroyed', (e) => {
            e.preventDefault();
            disconnect();
        });
    };

    const disconnect = async () => {
        const session = sessionRef.current!;

        if (publisher) {
            session.unpublish(publisher);
            session.disconnect();
        }

        setSubscribers([]);
        setPublisher(undefined);
    };

    const connect = async () => {
        setProcessing(true);
        sessionRef.current = ov.initSession();
        const session = sessionRef.current!;

        subscribe();
        await getTokenReq(lobbyId).then(
            ifSuccess(async ({ token }) => {
                await session.connect(token);
                const publisher: Publisher = ov.initPublisher(undefined!, {
                    audioSource: undefined, // The source of audio. If undefined default microphone
                    videoSource: undefined, // The source of video. If undefined default webcam
                    publishAudio: broadcastAudio, // Whether you want to start publishing with your audio unmuted or not
                    publishVideo: broadcastVideo, // Whether you want to start publishing with your video enabled or not
                    resolution: '640x480', // The resolution of your video
                    frameRate: 30, // The frame rate of your video
                    mirror: false, // Whether to mirror your local video or not
                });

                await session.publish(publisher);
                setPublisher(publisher);
            })
        );

        setProcessing(false);
    };

    useEffect(() => () => sessionRef.current?.disconnect(), []);

    return {
        session: sessionRef.current,
        subscribers,
        publisher,
        connect,
        processing,
        disconnect,
    };
};
