/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-sequences */
import * as antd from 'antd';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const HomePage: FC = () => {
    return (
        <antd.Row style={{ padding: 16 }}>
            <antd.Typography.Title>Croco app</antd.Typography.Title>
            <antd.Col xs={24}>
                <antd.Typography.Title level={2}>How to play</antd.Typography.Title>
            </antd.Col>
            <antd.Col xs={16}>
                <antd.Typography.Paragraph strong>
                    Croco is an application in which one player shows a randomly selected word to
                    other players. This player is selected randomly at the beginning of the game,
                    and then the one who guessed the word becomes that player.
                </antd.Typography.Paragraph>
                <antd.Typography.Paragraph strong>
                    Our application consists of rooms. You can <Link to="">create your own</Link> or{' '}
                    <Link to="/rooms">go into an existing one</Link>.
                </antd.Typography.Paragraph>
                <antd.Typography.Paragraph strong>
                    The presenter is given a choice of 5 random words. He selects one of them and
                    shows it through a video broadcast. Other users write their answers to the chat.
                    If the answer is correct, the system will determine this, and you will display
                    the next word.
                </antd.Typography.Paragraph>
            </antd.Col>
        </antd.Row>
    );
};
