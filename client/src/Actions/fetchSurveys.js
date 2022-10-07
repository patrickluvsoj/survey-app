import { setRecoil } from 'recoil-nexus';
import { surveysState } from '../Atoms/surveysState';
import axios from 'axios';

export const fetchSurveys = async () => {
    try {
        const response = await axios.get("/api/surveys/list");

        setRecoil(surveysState, response.data);
        return response;
    } catch(error) {
        throw error 
    }
}

