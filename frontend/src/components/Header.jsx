import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header>
      <div className="Navigation">
        <div className="Navigation_Logo">
          <Link to="/guest" className="logo">
            <img src="../echolearn-logo.png" alt="EchoLearn Logo" />
            <p>EchoLearn</p>
          </Link>
        </div>
        <div className="Navigation_Control">
          <Link to="/create">Create</Link>
          <Link to="/help">Help</Link>
          <Link to="/user">User</Link>
        </div>
      </div>
    </header>
  );
}


export default Header