import { useEffect } from "react";
import { Routes, Route } from "react-router-dom"
import { useRecoilValueLoadable } from "recoil";
import { fetchLoginState } from "../Services/fetchLoginState";
import Landing from "./Landing"
import Thread from "./Thread"

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Landing />}>
          <Route path='threads' element={<Thread />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;



