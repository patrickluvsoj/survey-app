import { Routes, Route, Navigate, redirect } from "react-router-dom";
import Header from "./Header";
import NewSurvey from "./NewSurvey";
import Dashboard from "./Dashboard";
import Homepage from "./Homepage";
import { fetchUser } from "../Actions/fetchUser";
import { useRecoilValue } from "recoil";
import { userState } from "../Atoms/userState";
import { useEffect } from "react";

// for testing express api routes
// import axios from "axios";
// window.axios = axios;

function App() {

  let isAuthenticated = null;

  useEffect(() => {
    fetchUser();
  }, []);

  isAuthenticated = useRecoilValue(userState);
  console.log('recoil state is: ' + JSON.stringify(isAuthenticated));

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path='/surveys' element={<Dashboard/>}/>
        <Route path='/newsurvey' element={<NewSurvey />}/>
      </Routes>
    </div>
  );
};

export default App;








