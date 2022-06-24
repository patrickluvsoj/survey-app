import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";


import { fetchUserState } from "../Services/fetchUserState";
import Payment from "./Payment";


const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );

function Header() {
    // Check if user is logged in to decide on what content to show
    const response = useRecoilValueLoadable(fetchUserState);
    const { contents } = response;
     
    useEffect(() => {
        console.log(`User id: ${contents.user_id} and credits ${contents.credits}`)
    })


    const [message, setMessage] = useState("")

    // Check to see if this is a redirect back from Checkout
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);

        if (query.get("success")) {
          setMessage("Success");
        }
    
        if (query.get("canceled")) {
          setMessage("Canceled!");
        }

    }, [])

    const renderMessageOrPayment = ( message ) => {
        return message ? <Message message={message} /> : <Payment />
    }

    return (
        <div>
            <nav>
                <div className="nav-wrapper">
                    <a className="brand-logo" href="/">Home</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>
                            {renderMessageOrPayment(message)}
                        </li>
                        <li>{contents.user_id ? "Logout" : "Login"}</li>
                    </ul>
                </div>
            </nav>
            <Outlet />
        </div>
    )
  };
  
  export default Header;
  

  