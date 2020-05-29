import * as colors from '@ant-design/colors';
import * as antd from 'antd';
import { Video } from 'components/Media/Video';
import { StreamManager } from 'openvidu-browser';
import React, { FC } from 'react';
import styled from 'styled-components';
import { getUserByStream } from 'services/lobby';

export const UserVideo: FC<{ streamManager: StreamManager }> = ({ streamManager }) => {
    return (
        <Container>
            <Video streamManager={streamManager} />
            <UserPreviewContainer>
                <antd.Tag>{getUserByStream(streamManager).username}</antd.Tag>
            </UserPreviewContainer>
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    border-radius: 5px;
    /* border: 5px solid ${colors.blue[2]}; */
`;

const UserPreviewContainer = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
`;
