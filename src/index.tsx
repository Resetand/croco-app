import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App/App';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './index.scss';

const root = (
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

ReactDOM.render(root, document.getElementById('root'));
