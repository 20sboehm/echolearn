import { useState, useRef, useEffect  } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import echolearnLogoBlue from "../assets/echolearn-logo-blue.png"
import echolearnLogoWhite from "../assets/echolearn-logo-white.png"
import defaultUserPic from "../assets/defaltUser.png";
import { useAuth, useApi } from "../hooks";

function Header() {
  const { isLoggedIn, _logout } = useAuth();
  const isGuestPage = !isLoggedIn;
  const [userData, setUserData] = useState(null);
  const api = useApi();

  useEffect(() => {
    if (isLoggedIn && !userData) {
      const fetchUserSettings = async () => {
        try {
          const response = await api._get('/api/profile/me');
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Failed to obtain user Settings', error);
        }
      };

      fetchUserSettings();
    }
  }, [isLoggedIn, api]);

  const avatar = userData?.avatar || defaultUserPic;

  const handleLogout = () => {
    _logout();
  };
  
  const navigateWithRefresh = (event, url) => {
    event.preventDefault(); // Prevent React Router's default navigation
    window.location.href = url; // Trigger a full page reload
  };

  if (isGuestPage) {
    return (
      <header className="h-16 w-full flex justify-between items-center top-0 left-0 bg-edDarker text-edWhite font-semibold border-b border-edDarkGray">
        <div className="w-screen flex flex-row justify-between">
          <div className="flex items-center justify-start mr-auto ml-10">
            <Link to="/" onClick={(e) => navigateWithRefresh(e, "/")} className="flex items-center">
              <img src={echolearnLogoBlue} alt="EchoLearn Logo" className="h-10 mr-2" />
              <p className="">EchoLearn</p>
            </Link>
            <Link to="/about" onClick={(e) => navigateWithRefresh(e, "/about")} className="ml-8 transition duration-100 hover:text-edBlue block text-center py-2 px-4 active:scale-[95%]">About</Link>
            <Link to="/features" onClick={(e) => navigateWithRefresh(e, "/features")} className=" transition duration-100 hover:text-edBlue block text-center py-2 px-4 active:scale-[95%]">Features</Link>
            {/* <Link to="/" className=" font-bold transition duration-100 hover:bg-eWhite block text-center py-2 px-4">Contact</Link> */}
          </div>

          <div className="flex items-center space-x-4 justify-end mr-10">
            <Link to="/login" onClick={(e) => navigateWithRefresh(e, "/login")} className="px-4 py-2 hover:text-edBlue border-2 border-transparent hover:border-edBlue active:scale-[95%]">Log in</Link>
            <Link to="/signup" onClick={(e) => navigateWithRefresh(e, "/signup")} className="px-4 py-2 bg-edBlue text-edWhite border-2 border-transparent hover:border-edWhite active:scale-[95%]">Sign up</Link>
          </div>
        </div>
      </header>
    );
  } else {
    return (
      <header className="h-16 flex justify-center top-0 left-0 w-full text-lg bg-elLightBlue border-elLightBlue dark:bg-edDarker font-semibold border-b dark:border-edDividerGray">
        <div className="w-screen flex flex-row justify-around text-white">
          <div className="flex mr-auto ml-10">
            <Link to="/" onClick={(e) => navigateWithRefresh(e, "/")} className="flex items-center">
              <img src={echolearnLogoBlue} alt="EchoLearn Logo" className="h-10 mr-2" />
              <p>EchoLearn</p>
            </Link>
          </div>
          <div className="flex ml-auto items-center">
            <Link to="/cards" onClick={(e) => navigateWithRefresh(e, "/leaderboard")} className="px-4 mx-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">Leaderboard</Link>
            <Link to="/cards" onClick={(e) => navigateWithRefresh(e, "/cards")} className="px-4 mx-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">Create Card</Link>
            {/* <Link to="/decks" className="px-4 mx-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">Create Deck</Link> */}
            <Link to="/help" onClick={(e) => navigateWithRefresh(e, "/help")} className="px-4 mx-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">Help</Link>
            <Link to="/community" onClick={(e) => navigateWithRefresh(e, "/community")} className="px-4 ml-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">Community</Link>
            <Link to="/myimages" className="px-4 ml-2 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">My Images</Link>
            <button onClick={handleLogout} className="px-4 ml-2 mr-10 transition duration-100 hover:text-black dark:hover:text-elLightBlue py-2">
              Log Out
            </button>
            <Link to="/profile" onClick={(e) => navigateWithRefresh(e, "/profile")}  className="flex items-center">
              <img src={avatar} alt="User profile picture" className="h-10 w-10 mr-10 rounded-full object-cover" />
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

export default Header