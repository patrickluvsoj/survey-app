import { Routes, Route } from "react-router-dom"
import Header from "./Header"
import Thread from "./Thread"
import SurveyList from "./SurveyList"
import { useEffect } from "react";

import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";

const NewSurvey = () => <div>NewSurvey</div>

function App() {

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.on("connection", data => {
      console.log('attemp connection')
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



