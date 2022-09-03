import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";

import { userState } from "../Atoms/userState";
import Payment from "./Payment";


const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );

function Header() {
    // Check if user is logged in to decide on what content to show
    const [ user ] = useRecoilState(userState);

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


    const renderMenu = () => {
        if (user) { 
            return [
                <li key="credits">
                    {`Credits ${user.credits}`}
                </li>,
                <li key="payment-message">
                    {renderMessageOrPayment(message)}
                </li>,
                <li key="logout"><a href="/logout">Logout</a></li>
            ];
        } else {
            return <li><a href="/auth/google">Login</a></li>;
        }

    }

    return (
        <div>
            <nav>
                <div className="nav-wrapper">
                    <a className="left brand-logo" href="/">Home</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {renderMenu()}
                    </ul>
                </div>
            </nav>
            <Outlet />
        </div>
    )
  };

  export default Header;
  

  