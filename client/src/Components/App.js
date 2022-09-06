import { Routes, Route, Navigate, Link } from "react-router-dom";
import Header from "./Header";
import NewSurvey from "./NewSurvey";
import { useEffect } from "react";
import { fetchUser } from "../Actions/fetchUser";

import io from "socket.io-client";

// temporary for testing survey routes and sendgrid emails
import axios from "axios";
window.axios = axios;

// need to update this for PROD
// const ENDPOINT = "http://localhost:5000";

function App() {

  const isAuthenticated = fetchUser();

  // useEffect(() => {
  //   const socket = io(ENDPOINT, {
  //     withCredentials: true,
  //   });
  //   socket.onAny((event, ...args) => {
  //     console.log(event, args);
  //   });
  // }, []);

  const AuthWrapper = ({isAuthenticated}) => {

    return isAuthenticated ? 
    <Navigate to="/dashboard" replace /> :
     <Navigate to="/homepage" replace />

  };

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Header />}>
          

          <Route
            path="/"
            element={<AuthWrapper isAuthenticated={isAuthenticated} />}
          />
          <Route path='dashboard' element={<Dashboard />}/>
          <Route path='homepage' element={<HomePage />}/>
          <Route path='newsurvey' element={<NewSurvey />}/>
        </Route>
      </Routes>
    </div>
  );


};

export default App;


const HomePage = () => {
  return (
    <div>Homepage Component</div>
  )
}

const Dashboard = () => {
  return (
    <div>
      <div>Dashboard component</div>
      <Link to="NewSurvey">New Survey</Link>
    </div>
  )
}







