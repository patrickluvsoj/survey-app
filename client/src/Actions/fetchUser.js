import { setRecoil } from 'recoil-nexus';
import { userState } from '../Atoms/userState';
import axios from 'axios';

export const fetchUser = async () => {
    try {
        const response = await axios.get("/api/current_user");

        setRecoil(userState, response.data);
    } catch(error) {
        throw error 
    }
}