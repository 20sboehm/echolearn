import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";

function GuestHeader() {
  return (
    <header className="py-2">
      <div className="w-screen flex flex-row justify-around">
        <div className="flex mr-auto ml-20">
          <Link to="/guest" className="flex items-center">
            <img src="../public/echolearn-logo.png" alt="EchoLearn" className="h-10 mr-2" />
            <p>EchoLearn</p>
          </Link>
        </div>
        <div className="flex ml-auto items-center">
          <Link to="/home" className="text-white mr-20">Login</Link>
        </div>
      </div>
    </header>
  );
}

export default GuestHeader