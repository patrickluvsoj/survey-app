import { atom } from 'recoil';
import { localStorageEffect } from '../utils/localStorageEffects';

export const previewState = atom({
    key: 'previewState',
    default: false,
    // effects: [
    //     localStorageEffect('preview'),
    // ],
});