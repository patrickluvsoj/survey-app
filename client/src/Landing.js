import { Outlet } from "react-router-dom";

function Landing() {
    return (
      <div className="Landing">
          Landing Page <a href="/auth/google">Login</a>
          <Outlet />
      </div>
    );
  }
  
  export default Landing;
  
  
  