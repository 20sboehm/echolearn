import { useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {

  const location = useLocation();
  const isGuestPage = location.pathname === "/";

  if (isGuestPage) {
    return (
      <header className="guestHeader">
        <div className="navigationGuest">
          <div className="navigationLogoGuest">
            <Link to="/" className="logo">
              <img src="../EchoLearn.png" alt="EchoLearn Logo" />
              <p>EchoLearn</p>
            </Link>
          </div>
          <div className="navigationControlGuest">
            <Link to="/">About</Link>
            <Link to="/">Features</Link>
            <Link to="/">Contact</Link>
          </div>
          <div className="navigationControlGuest">
            <Link to="/home">Log in</Link>
            <Link to="/home" className="signIn">Sign in</Link>
          </div>
        </div>
      </header>
    )
  } else {
    return (
      <header className="h-16 flex justify-center top-0 left-0 w-full bg-userHeaderColor">
        <div className="w-screen flex flex-row justify-around">
          <div className="flex mr-auto ml-20">
            <Link to="/" className="flex items-center">
              <img src="../echolearn-logo.png" alt="EchoLearn Logo" className="h-10 mr-2" />
              <p>EchoLearn</p>
            </Link>
          </div>
          <div className="flex ml-auto items-center">
            <Link to="/cards" className="px-4 mx-2 transition duration-100 hover:text-black py-2">Create Card</Link>
            <Link to="/decks" className="px-4 mx-2 transition duration-100 hover:text-black py-2">Create Deck</Link>
            <Link to="/folders" className="px-4 mx-2 transition duration-100 hover:text-black py-2">Create Folder</Link>
            <Link to="/help" className="px-4 mx-2 transition duration-100 hover:text-black py-2">Help</Link>
            <Link to="/home" className="px-4 ml-2 mr-20 transition duration-100 hover:text-black py-2">Home</Link>
          </div>
        </div>
      </header>
    );  
  }
}

export default Header