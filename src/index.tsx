import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App/App';
// import 'antd/dist/antd.css';
import 'emoji-mart/css/emoji-mart.css';
import './index.less';

const root = (
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

ReactDOM.render(root, document.getElementById('root'));
