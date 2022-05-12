import { useEffect } from "react";
import { Routes, Route } from "react-router-dom"
import { useRecoilValueLoadable } from "recoil";
import { fetchLoginState } from "../Services/fetchLoginState";
import Header from "./Header"
import Thread from "./Thread"
import SurveyList from "./SurveyList"

const NewSurvey = () => <div>NewSurvey</div>

function App() {

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



