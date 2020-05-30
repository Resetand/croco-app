import React, { FC, useRef, useEffect, CSSProperties } from 'react';
import { StreamManager } from 'openvidu-browser';

type VideoProps = {
    streamManager: StreamManager;
    style?: CSSProperties;
};

export const Video: FC<VideoProps> = ({ streamManager, style }) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        ref.current && streamManager.addVideoElement(ref.current);
    }, [streamManager]);

    return <video style={style} autoPlay={true} ref={ref} />;
};
