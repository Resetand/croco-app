import * as antd from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';

export const Spinner: FC = () => (
    <Container>
        <antd.Spin />
    </Container>
);

const Container = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;
