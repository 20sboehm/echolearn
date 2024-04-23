import { useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const isGuestPage = location.pathname === "/";

  if (isGuestPage) {
    return (
      <header className="h-16 w-full flex justify-between items-center top-0 left-0 bg-white">
        <div className="w-screen flex flex-row justify-between">
          <div className="flex items-center font-bold justify-start mr-auto ml-20">
            <Link to="/" className="flex items-center">
              <img src="../EchoLearn.png" alt="EchoLearn Logo" className="h-10 mr-2" />
              <p className="text-black font-bold">EchoLearn</p>
            </Link>
            <Link to="/" className="ml-8 text-black font-bold transition duration-100 hover:bg-gray-300 block text-center py-2 px-4">About</Link>
            <Link to="/" className="text-black font-bold transition duration-100 hover:bg-gray-300 block text-center py-2 px-4">Features</Link>
            <Link to="/" className="text-black font-bold transition duration-100 hover:bg-gray-300 block text-center py-2 px-4">Contact</Link>
          </div>
        
          <div className="flex items-center space-x-4 justify-end mr-10">
            <Link to="/login" className="px-4 py-2 text-black font-bold transition duration-100 hover:bg-gray-300">Log in</Link>
            <Link to="/home" className="px-4 py-2 bg-userHeaderColor text-white rounded-lg font-bold transition duration-100 hover:text-black py-2">Sign in</Link>
          </div>
        </div>
      </header>
    );
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