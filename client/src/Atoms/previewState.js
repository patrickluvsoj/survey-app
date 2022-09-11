import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const previewState = atom({
    key: 'previewState',
    default: false,
    effects_UNSTABLE: [persistAtom]
});