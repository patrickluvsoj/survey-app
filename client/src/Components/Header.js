import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { fetchLoginState } from "../Services/fetchLoginState";
import Payment from "./Payment";

const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );

function Header() {
    // Check if user is logged in to decide on what content to show
    const isLoggedIn = useRecoilValueLoadable(fetchLoginState);
    const { contents } = isLoggedIn;
    
    useEffect(() => {
        console.log("This is it: \n" + contents)
    })


    const [message, setMessage] = useState("")

    // Check to see if this is a redirect back from Checkout
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);

        if (query.get("success")) {
          setMessage("Order placed!");
        }
    
        if (query.get("canceled")) {
          setMessage(
            "Order canceled!"
          );
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
                        <li>{contents ? "Logout" : "Login"}</li>
                    </ul>
                </div>
            </nav>
            <Outlet />
        </div>
    )
  };
  
  export default Header;
  

  