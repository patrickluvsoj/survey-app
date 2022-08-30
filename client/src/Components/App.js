import { Routes, Route } from "react-router-dom"
import Header from "./Header"
import Thread from "./Thread"
import SurveyList from "./SurveyList"
import { useEffect } from "react";
import { fetchUser } from "../Actions/fetchUser";

import io from "socket.io-client";

// temporary for testing survey routes and sendgrid emails
import axios from "axios";
window.axios = axios;

// need to update this for PROD
const ENDPOINT = "http://localhost:5000";

const NewSurvey = () => <div>NewSurvey</div>

function App() {

  fetchUser();

  useEffect(() => {
    const socket = io(ENDPOINT, {
      withCredentials: true,
    });
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Header />}>
          <Route path='threads' element={<Thread />}/>
          <Route path='surveys' element={<SurveyList />}/>
          <Route path='surveys/new' element={<NewSurvey />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;



