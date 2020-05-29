/* eslint-disable react-hooks/exhaustive-deps */
import { OpenVidu, Publisher, Session, StreamEvent, Subscriber } from 'openvidu-browser';
import { useEffect, useRef, useState } from 'react';
import * as antd from 'antd';
import { getUserByStream } from 'services/lobby';

type MediaSessionOptions = {
    broadcastAudio?: boolean;
    broadcastVideo?: boolean;
};

export const useMedia = (options?: MediaSessionOptions) => {
    const ov = useRef(new OpenVidu()).current;

    const [publisher, setPublisher] = useState<Publisher>();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [processing, setProcessing] = useState(false);
    const sessionRef = useRef<Session>();

    const subscribe = () => {
        const session = sessionRef.current!;

        session.on('streamCreated', async (e) => {
            const event = e as StreamEvent;
            antd.notification.info({
                // TODO добавить фильтрация по пользователям которые уже в лобби
                message: `${getUserByStream(event.stream).username} join to lobby`,
            });
            const subscriber = await session.subscribeAsync(event.stream, undefined!)!;
            setSubscribers((prev) => [...prev, subscriber]);
        });

        session.on('streamDestroyed', (e) => {
            const event = e as StreamEvent;
            antd.notification.info({
                message: `${getUserByStream(event.stream).username} leave from lobby`,
            });
            setSubscribers((prev) =>
                prev.filter((x) => x.stream.streamId !== event.stream.streamId)
            );
        });
    };

    const disconnect = async () => {
        const session = sessionRef.current!;
        if (publisher) {
            session.unpublish(publisher);
        }
        session.disconnect();
    };

    const connect = async (token: string) => {
        setProcessing(true);
        sessionRef.current = ov.initSession();
        const session = sessionRef.current!;
        subscribe();

        const publisher: Publisher = ov.initPublisher(undefined!, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: options?.broadcastAudio, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: options?.broadcastVideo, // Whether you want to start publishing with your video enabled or not
            // resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            mirror: false, // Whether to mirror your local video or not
        });

        await session.connect(token);
        // setSubscribers(session.streamManagers.map((x) => session.subscribe(x.stream, undefined!)));

        await session.publish(publisher);
        setPublisher(publisher);
        setProcessing(false);
    };

    useEffect(() => () => void disconnect(), []);

    return {
        session: sessionRef.current,
        subscribers,
        publisher,
        connect,
        processing,
        disconnect,
    };
};

/**
 * Represents a video call. It can also be seen as a videoconference room where multiple users can connect.
 * Participants who publish their videos to a session can be seen by the rest of users connected to that specific session.
 * Initialized with [[OpenVidu.initSession]] method.
 *
 * ### Available event listeners (and events dispatched)
 *
 * - connectionCreated ([[ConnectionEvent]])
 * - connectionDestroyed ([[ConnectionEvent]])
 * - sessionDisconnected ([[SessionDisconnectedEvent]])
 * - streamCreated ([[StreamEvent]])
 * - streamDestroyed ([[StreamEvent]])
 * - streamPropertyChanged ([[StreamPropertyChangedEvent]])
 * - publisherStartSpeaking ([[PublisherSpeakingEvent]])
 * - publisherStopSpeaking ([[PublisherSpeakingEvent]])
 * - signal ([[SignalEvent]])
 * - recordingStarted ([[RecordingEvent]])
 * - recordingStopped ([[RecordingEvent]])
 * - reconnecting
 * - reconnected
 *
 */
