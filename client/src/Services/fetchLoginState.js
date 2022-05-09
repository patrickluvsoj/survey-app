import { selector } from "recoil";
import axios from "axios";

export const fetchLoginState = selector({
    key: 'loginStateSelector',
    get: async ({get}) => {
        try {
            const response = await axios.get("/api/current_user")
            const user = response.data.user_id
            console.log(user)
            if (user) {
                return true
            }
            return false
        } catch(error) {
            throw error 
        }
    }
})


// 1. Create fetchLoginState with selector
// 2. call w/ useRecoilValueloadable()
