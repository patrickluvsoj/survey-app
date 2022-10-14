import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import NewSurvey from "./NewSurvey";
import Dashboard from "./Dashboard";
import Homepage from "./Homepage";
import { fetchUser } from "../Actions/fetchUser";

// for testing express api routes
// import axios from "axios";
// window.axios = axios;

function App() {

  const isAuthenticated = fetchUser();

  const AuthWrapper = ({isAuthenticated}) => {

    return isAuthenticated ? 
    <Navigate to="/dashboard" replace /> : <Navigate to="/homepage" replace />

  };

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Header />}>
          <Route
            path="/"
            element={<AuthWrapper isAuthenticated={isAuthenticated} />}
          />
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/homepage' element={<Homepage />}/>
          <Route path='/newsurvey' element={<NewSurvey />}/>
        </Route>
      </Routes>
    </div>
  );
};

export default App;









