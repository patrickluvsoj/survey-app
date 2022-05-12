import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { fetchLoginState } from "../Services/fetchLoginState";


function Header() {
    const isLoggedIn = useRecoilValueLoadable(fetchLoginState);
    const { contents } = isLoggedIn
    
    useEffect(() => {
        console.log("This is it: \n" + contents)
    })

    return (
        <div>
            <nav>
                <div className="nav-wrapper">
                    <a className="brand-logo" href="/">Home</a>
                    <ul id="nav-mobile" class="right hide-on-med-and-down">
                        <li>{contents ? "Logout" : "Login"}</li>
                    </ul>
                </div>
            </nav>
            <Outlet />
        </div>
    );
  }
  
  export default Header;
  
  
  