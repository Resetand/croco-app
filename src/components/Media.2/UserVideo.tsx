import * as icons from '@ant-design/icons';
import * as antd from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { Video } from 'components/Media.2/Video';
import { StreamManager } from 'openvidu-browser';
import React, { FC, useState, CSSProperties } from 'react';
import { getUserByStream } from 'services/lobby';
import styled from 'styled-components';

type UserVideoProps = {
    onMuteChange?: (muted: boolean) => void;
    streamManager: StreamManager;
    size?: SizeType;
    style?: CSSProperties;
};

export const UserVideo: FC<UserVideoProps> = ({ streamManager, onMuteChange, size, style }) => {
    const [fullScreen, setFullScreen] = useState(false);
    const [muted, setMuted] = useState(false);

    const fullScreenIcon = fullScreen ? (
        <icons.FullscreenExitOutlined />
    ) : (
        <icons.FullscreenOutlined />
    );

    const audioIcon = muted ? <icons.AudioOutlined /> : <icons.AudioMutedOutlined />;

    return (
        <div style={{ position: 'relative', ...(fullScreen ? fullScreenStyles : {}) }}>
            <Video
                style={{ ...style, ...(fullScreen ? videoFullScreenStyles : {}) }}
                streamManager={streamManager}
            />
            <UserPreviewContainer style={size === 'small' ? { padding: 0 } : undefined}>
                {getUserByStream(streamManager).username}
            </UserPreviewContainer>
            <ToolbarContainer>
                <antd.Button.Group size={size}>
                    <antd.Button
                        shape="circle"
                        icon={fullScreenIcon}
                        onClick={() => setFullScreen((x) => !x)}
                        type="primary"
                    />
                    <antd.Button
                        disabled={!Boolean(onMuteChange)}
                        shape="circle"
                        icon={audioIcon}
                        onClick={() => setMuted((x) => !x)}
                        type="primary"
                    />
                </antd.Button.Group>
            </ToolbarContainer>
        </div>
    );
};

const fullScreenStyles: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.9)',
    zIndex: 99,
};
const videoFullScreenStyles: CSSProperties = {
    objectFit: 'contain',
    height: '100%',
};

const ToolbarContainer = styled.div`
    position: absolute;
    bottom: 20px;
    right: 20px;
`;

const UserPreviewContainer = styled.div`
    padding-right: 20px;
    padding-left: 20px;
    padding-top: 2px;
    padding-bottom: 2px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
`;
