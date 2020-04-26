import React, { FC } from 'react';
import { StreamManager } from 'openvidu-browser';
import { Video } from './Video';
import { AppUser } from '../UserProvider/UserProvider';
import * as antd from 'antd';

export const UserVideo: FC<{ streamManager: StreamManager }> = ({ streamManager }) => {
    const getUserName = () => {
        const user: AppUser = JSON.parse(streamManager.stream.connection.data)?.clientData;
        console.log(user);

        return user.username;
    };
    return streamManager ? (
        <div style={{ position: 'relative' }}>
            <Video streamManager={streamManager} />
            <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                <antd.Typography.Text style={{ color: '#fff', textShadow: ' 1px 1px 2px black' }}>
                    {getUserName()}
                </antd.Typography.Text>
            </div>
        </div>
    ) : null;
};
