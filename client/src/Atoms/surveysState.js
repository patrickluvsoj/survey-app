import { atom } from 'recoil';

export const surveysState = atom({
    key: 'surveysState',
    default: [{
        title: "",
        subject: "",
        body: "",
        from: "",
        recipients: ""
    }],
});