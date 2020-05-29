import * as antd from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';
import * as icons from '@ant-design/icons';
import OutsideClickHandler from 'react-outside-click-handler';

type DropdownProps = {
    visible: boolean;
    onClose: () => void;
    enableCloseBtn?: boolean;
    position?: 'top' | 'bottom';
};
export const FixedDropdown: FC<DropdownProps> = ({
    visible,
    onClose,
    position = 'top',
    children,
    enableCloseBtn,
}) => {
    const closeIcon = position === 'top' ? <icons.ArrowUpOutlined /> : <icons.ArrowDownOutlined />;
    const translateY = visible ? 0 : position === 'top' ? '-100%' : '100%';

    return (
        <OutsideClickHandler onOutsideClick={onClose}>
            <Container style={{ [position]: 0, transform: `translateY(${translateY})` }}>
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
