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
        emails: ""
    },
    effects_UNSTABLE: [persistAtom]
});