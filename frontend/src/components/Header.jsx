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
            <Link to="/user">Log in</Link>
            <Link to="/user" className="signIn">Sign in</Link>
          </div>
        </div>
      </header>
    )
  } else {
    return (
      <header className="mainHeader">
        <div className="navigation">
          <div className="navigationLogo">
            <Link to="/" className="logo">
              <img src="../echolearn-logo.png" alt="EchoLearn Logo" />
              <p>EchoLearn</p>
            </Link>
          </div>
          <div className="navigationControl">
            <Link to="/create">Create</Link>
            <Link to="/help">Help</Link>
            <Link to="/user">User</Link>
          </div>
        </div>
      </header>
    );
  }
}


export default Header