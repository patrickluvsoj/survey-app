import { Routes, Route, Link } from "react-router-dom"
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



