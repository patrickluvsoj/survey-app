import { atom } from 'recoil';

export const formState = atom({
    key: 'formState',
    default: {
        title: "",
        subject: "",
        body: "",
        from: "",
        recipients: ""
    },
});