import { setRecoil } from 'recoil-nexus';
import { userState } from '../Atoms/userState';
import axios from 'axios';

export const submitSurvey = async (values) => {
    try {
        console.log(values);
        const response = await axios.post("/api/surveys", values);

        setRecoil(userState, response.data);
    } catch(error) {
        throw error 
    }
}