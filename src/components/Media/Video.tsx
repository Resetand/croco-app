import React, { FC, useRef, useEffect } from 'react';
import { StreamManager } from 'openvidu-browser';

export const Video: FC<{ streamManager: StreamManager }> = ({ streamManager }) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        ref.current && streamManager.addVideoElement(ref.current);
    }, [streamManager]);

    return <video style={{ width: '100%', height: '100%' }} autoPlay={true} ref={ref} />;
};
