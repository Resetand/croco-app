import React, { FC } from 'react';
import * as antd from 'antd';
import * as icons from '@ant-design/icons';
// import styled from 'styled-components';

type GameBoardProps = {};

export const GameBoard: FC = () => {
    return (
        <antd.Card>
            <antd.Row align="bottom">
                <antd.Col span={4}>
                    <antd.Statistic value={1128} prefix={<icons.StarOutlined />} />
                </antd.Col>
                <antd.Col span={4}>
                    <antd.Statistic.Countdown format="HH:mm:ss" />
                </antd.Col>
                <antd.Col span={4}>
                    <antd.Select suffixIcon={<icons.UserOutlined />} placeholder="Select player" />
                    <antd.Button type="primary" icon={<icons.PlayCircleOutlined />}>
                        Start game
                    </antd.Button>
                </antd.Col>
            </antd.Row>
        </antd.Card>
    );
};
