import { selector } from "recoil";
import axios from "axios";

export const fetchUserState = selector({
    key: 'userStateSelector',
    get: async ({get}) => {
        try {
            await new Promise(resolve => {
                setTimeout(resolve, 5000)
            })
            
            const response = await axios.get("/api/current_user")

            return response.data
        } catch(error) {
            throw error 
        }
    }
})
// 