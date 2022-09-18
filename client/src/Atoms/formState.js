import { atom } from 'recoil';
import { localStorageEffect } from '../utils/localStorageEffects';

export const formState = atom({
    key: 'formState',
    default: {
        title: "",
        subject: "",
        body: "",
        from: "",
        recipients: ""
    },
    // effects: [
    //     localStorageEffect('form'),
    // ]
});