import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { fetchLoginState } from "../Services/fetchLoginState";


function Landing() {
    // TODO
        // Create one version using Recoil
        // Create second one using RTK


    // Have a way to check state and render different component
        // Login w/ /auth/google route
        // Logout w/ /logout route
    // import recoil state
        // create state with recoil
    // have a service that fetches login state from api/current_user/

    const isLoggedIn = useRecoilValueLoadable(fetchLoginState);
    const { contents } = isLoggedIn
    
    useEffect(() => {
        console.log("This is it: \n" + contents)
    })

    return (
      <div className="Landing">
          Landing Page {contents ? "Logout" : "Login"}
          {/* <a href="/auth/google">Login</a> */}
          <Outlet />
      </div>
    );
  }
  
  export default Landing;
  
  
  