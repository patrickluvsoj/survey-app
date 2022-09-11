import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const formState = atom({
    key: 'formState',
    default: {
        title: "",
        subject: "",
        body: "",
        from: "",
        recipients: ""
    },
    effects_UNSTABLE: [persistAtom]
});