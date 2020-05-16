import * as antd from 'antd';
import { Video } from 'components/Media/Video';
import { StreamManager } from 'openvidu-browser';
import React, { FC } from 'react';

type ConnectionPayload = {
    userId: string;
    username: string;
};

export const UserVideo: FC<{ stream: StreamManager }> = ({ stream }) => {
    const getUserName = () => {
        const data: ConnectionPayload = JSON.parse(stream.stream.connection.data);
        return data.username;
    };
    return stream ? (
        <div style={{ position: 'relative' }}>
            <Video streamManager={stream} />
            <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                <antd.Typography.Text style={{ color: '#fff', textShadow: ' 1px 1px 2px black' }}>
                    {getUserName()}
                </antd.Typography.Text>
            </div>
        </div>
    ) : null;
};
