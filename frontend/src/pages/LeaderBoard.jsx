import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { useApi } from "../hooks";
import LoadingSpinner from "../components/LoadingSpinner";
import './Buttons.css';


function LeaderBoard({ publicAccess = false }) {
  const api = useApi();
  const navigate = useNavigate();

  const [isPublicAccess, setIsPublicAccess] = useState(publicAccess);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(250);


  const { data: allUsers, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      api._get('/api/users/orderbyscore').then((response) => response.json()),
    onError: () => {
      console.log(`An error occurred fetching user data ${errorDecks.text}`)
    }
  })
  
  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    const [status, message] = error.message.split(': ');

    return (
      <>
        <h1 className="mt-20 text-[3rem] font-bold">{status}</h1>
        <p className="mt-2 text-[1.5rem]">{message}</p>
      </>
    );
  }

  function popupDetails(popupMessage, popupColor) {
    setShowPopup(true);
    setPopupMessage(popupMessage)
    setPopupColor(popupColor)
    setPopupOpacity('opacity-100'); // Ensure it's fully visible initially
    setTimeout(() => {
      setPopupOpacity('opacity-0'); // Start fading out
      setTimeout(() => setShowPopup(false), 1000); // Give it 1 second to fade
    }, 1000); // Stay fully visible for 1 second
  }


  return (
    <>
      <div className="flex flex-row w-full h-full">
        <Sidebar refetchTrigger={refetchTrigger} onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="w-full flex flex-col mx-[15%] max-h-[calc(100vh-5rem)] border-b border-elDividerGray dark:border-edDividerGray">
        
        <div className="w-full flex flex-col items-center px-4 py-8 bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen">
                <h1 className="text-4xl font-bold text-white mb-6">Leaderboard</h1>
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {allUsers.sort((a, b) => b.score - a.score).map((user, index) => (
                            <li key={index} className="p-4 grid grid-cols-4 items-center text-center transform transition duration-500 ease-in-out hover:scale-105">
                                <span className="text-lg font-bold text-gray-900">{index + 1}</span>  
                                <Link to={`/profile?userId=${user.id}`} className="text-lg font-bold text-gray-700 no-underline hover:underline">
                                    {user.username}
                                </Link>
                                <span className="text-sm text-gray-500">{user.country}</span> 
                                <span className="text-md font-bold text-blue-800">{user.score}</span> 
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </div >
      {showPopup && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
          {popupMessage}
        </div>
      )
      }
    </>
  )
}
export default LeaderBoard