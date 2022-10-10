import { atom } from 'recoil';

export const surveysState = atom({
    key: 'surveysState',
    default: [{
        title: "",
        subject: "",
        body: "",
        yes: 0,
        no: 0,
        dateSent: "",
        lastResponded: ""
    }],
});