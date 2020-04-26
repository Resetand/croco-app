import Axios from 'axios';
import { config } from '../config';

export const msAxios = Axios.create({
    baseURL: config.openVidu.serverUrl,
    headers: {
        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + config.openVidu.secret),
        'Content-Type': 'application/json',
    },
});
