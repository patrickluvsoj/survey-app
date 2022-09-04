import { setRecoil } from 'recoil-nexus';
import { userState } from '../Atoms/userState';
import axios from 'axios';

export const fetchUser = async (values) => {
    try {
        const response = await axios.get("/api/surveys", values);

        setRecoil(userState, response.data);
    } catch(error) {
        throw error 
    }
}