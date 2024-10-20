import { useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import echolearnLogoBlue from "../assets/echolearn-logo-blue.png"
import echolearnLogoWhite from "../assets/echolearn-logo-white.png"
import userPic from "../assets/defaltUser.png"
import { useAuth } from "../hooks";

function Header() {
  const { isLoggedIn, _logout } = useAuth();
  const isGuestPage = !isLoggedIn;

  const handleLogout = () => {
    _logout();
  };

  if (isGuestPage) {
    return (
      <header className="h-16 w-full flex justify-between items-center top-0 left-0 bg-edDarker text-edWhite font-semibold border-b border-edDarkGray">
        <div className="w-screen flex flex-row justify-between">
          <div className="flex items-center justify-start mr-auto ml-10">
            <Link to="/" onClick={() => window.location.href = "/"} className="flex items-center">
              <img src={echolearnLogoBlue} alt="EchoLearn Logo" className="h-10 mr-2" />
              <p className="">EchoLearn</p>
            </Link>
            <Link to="/about" onClick={() => window.location.href = "/about"} className="ml-8 transition duration-100 hover:text-edBlue block text-center py-2 px-4 active:scale-[95%]">About</Link>
            <Link to="/features" onClick={() => window.location.href = "/features"} className=" transition duration-100 hover:text-edBlue block text-center py-2 px-4 active:scale-[95%]">Features</Link>
            {/* <Link to="/" className=" font-bold transition duration-100 hover:bg-eWhite block text-center py-2 px-4">Contact</Link> */}
          </div>

          <div className="flex items-center space-x-4 justify-end mr-10">
            <Link to="/login" onClick={() => window.location.href = "/login"} className="px-4 py-2 hover:text-edBlue border-2 border-transparent hover:border-edBlue active:scale-[95%]">Log in</Link>
            <Link to="/signup" onClick={() => window.location.href = "/signup"} className="px-4 py-2 bg-edBlue text-edWhite border-2 border-transparent hover:border-edWhite active:scale-[95%]">Sign up</Link>
          </div>
        </div>
      </header>
    );
  } else {
    return (
      <header className="h-16 flex justify-center top-0 left-0 w-full text-lg bg-elLightBlue border-elLightBlue dark:bg-edDarker font-semibold border-b dark:border-edDividerGray">
        <div className="w-screen flex flex-row justify-around text-white">
          <div className="flex mr-auto ml-10">
            <Link to="/" onClick={() => window.location.href = "/"} className="flex items-center">
              <img src={echolearnLogoBlue} alt="EchoLearn Logo" className="h-10 mr-2" />
              <p>EchoLearn</p>
            </Link>
          </div>
          <div className="flex ml-auto items-center">
            <Link to="/cards" onClick={() => window.location.href = "/cards"} className="px-4 mx-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">Create Card</Link>
            {/* <Link to="/decks" className="px-4 mx-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">Create Deck</Link> */}
            <Link to="/help" onClick={() => window.location.href = "/help"} className="px-4 mx-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">Help</Link>
            <Link to="/community" onClick={() => window.location.href = "/community"} className="px-4 ml-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">Community</Link>
            <Link to="/myimages" className="px-4 ml-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">My Images</Link>
            <button onClick={handleLogout} className="px-4 ml-2 mr-10 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">
              Log Out
            </button>
            <Link to="/profile" onClick={() => window.location.href = "/profile"}  className="flex items-center">
              <img src={userPic} alt="User profile picture" className="h-10 mr-10" />
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

export default Header