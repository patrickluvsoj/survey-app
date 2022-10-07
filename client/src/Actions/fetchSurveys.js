import { setRecoil } from 'recoil-nexus';
// import { userState } from '../Atoms/userState';
import { surveysState } from '../Atoms/surveysState';
import axios from 'axios';

export const fetchSurveys = async () => {
    try {
        const response = await axios.get("/api/surveys/list'");

        setRecoil(surveysState, response.data);
        return response;
    } catch(error) {
        throw error 
    }
}


// ## TODO
// 1. Review Redux implementation for fetchUser. Review Recoil to fix the user fetch architecture
// 	1. have a user state w/ credits
// 	2. have an action that makes async request and then uses setUserState
// 	3. Wrap axios.post('survey_routes') into a action that will also setUserState

// 4. Figure out how to use Recoil and React Hook Form
// 	1. https://react-hook-form.com/get-started#Integratingwithglobalstate
// 	2. How to pass data from React Hook Form to SurveyFormReview
//      a. Use onchange and pass data to recoi atom state. See below
//      b. https://stackoverflow.com/questions/66936135/react-hook-form-how-to-can-i-use-onchange-on-react-hook-form-version-7-0
// 	3. How to either persist or unload data based on user action
