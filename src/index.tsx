import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './containers/App/App';

const root = (
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

ReactDOM.render(root, document.getElementById('root'));
