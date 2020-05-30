import * as antd from 'antd';
import React, { FC, CSSProperties } from 'react';
import styled from 'styled-components';
import * as icons from '@ant-design/icons';
import OutsideClickHandler from 'react-outside-click-handler';

type DropdownModalProps = {
    visible: boolean;
    onClose: () => void;
    enableCloseBtn?: boolean;
    position?: 'top' | 'bottom';
};
export const DropdownModal: FC<DropdownModalProps> = ({
    visible,
    onClose,
    position = 'top',
    children,
    enableCloseBtn,
}) => {
    const closeIcon = position === 'top' ? <icons.ArrowUpOutlined /> : <icons.ArrowDownOutlined />;
    const translateY = visible ? 0 : position === 'top' ? '-100%' : '100%';

    const pillStyles: CSSProperties = {
        [position === 'top' ? 'bottom' : 'top']: -10,
        // visibility: visible ? undefined : 'hidden',
    };
    const container: CSSProperties = {
        [position]: 0,
        transform: `translateY(${translateY})`,
        // visibility: visible ? undefined : 'hidden',
    };
    return (
        <OutsideClickHandler onOutsideClick={onClose}>
            <Container style={container}>
                <Pill style={pillStyles} />
                {enableCloseBtn && (
                    <CloseContainer onClick={onClose} style={{ [position]: '20px' }}>
                        <antd.Button size="large" type="primary" shape="circle" icon={closeIcon} />
                    </CloseContainer>
                )}
                {children}
            </Container>
        </OutsideClickHandler>
    );
};

const Pill = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 3px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.5);
`;

const CloseContainer = styled.div`
    position: absolute;
    right: 20px;
`;

const Container = styled.div`
    position: fixed;
    z-index: 100;
    transition: 0.2s;
    left: 0;
    right: 0;
`;
