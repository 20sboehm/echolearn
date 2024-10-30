import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import Sidebar from "../components/SideBar";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate, useLocation, Link } from "react-router-dom";
import './Buttons.css';

function AICreateCardsPage() {
  const api = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const [deckId, setDeckId] = useState(location?.state?.deckId);

  const [userInput, setuserInput] = useState("")
  const [preview, setPreview] = useState([])
  const [newresponse,setNewResponse] = useState([])
  const [waiting, setWatiting] = useState(false);

  const [popupActive, setPopupActive] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const popupTimerRef = useRef(null); // Ref to hold the popup timer

  const [sidebarWidth, setSidebarWidth] = useState(250);

  const displayPopup = (isSuccess) => {
    // Clear the old timer if it is still active
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    setPopupActive(true);

    if (isSuccess) {
      setPopupText("Cards created");
      setPopupSuccess(true);
      setPopupColor("bg-edGreen");
    } else {
      setPopupText("Something went wrong");
      setPopupSuccess(true);
      setPopupColor("bg-edRed");
    }

    popupTimerRef.current = setTimeout(() => {
      setPopupActive(false);
    }, 5000)
  }

  useEffect(() => {
    
    if (!newresponse) return;
    console.log(newresponse)
    const formattedPreview = newresponse.map(item => {
        return {
          question: item.Question,
          answer: item.Answer
        };
      });
    setPreview(formattedPreview);
  }, [newresponse]);

  // create multiple cards
  const handleAIParser = async (e) => {
    e.preventDefault();
    setWatiting(true)
      // Check if deckId is valid
      if (!deckId) {
        console.error("Error: Missing deckId");
        setWatiting(false)
        alert("Faile to creat cards because did not select deck")
        displayPopup(false);
        return; 
    }
    console.log(userInput)
   
    const dataToSend = {
      userinput:userInput,
      deckId:deckId
    };

    const response = await api._post('/api/gptgeneration', dataToSend);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating cards: ", errorData);
      displayPopup(false);
    } else {
      const responseData = await response.json();
      console.log(responseData)
      if(!responseData.newcardset.length){
        // console.error("Error creating cards: ", errorData);
        alert("Faile to request AI generation please input meaningful text or try again later ")
        displayPopup(false);
        setWatiting(false)
        setNewResponse("")
        return
      }
      setNewResponse(responseData.newcardset);
      console.log("All cards created successfully.");
      displayPopup(true);
    }
    setWatiting(false)
    if (userInput !== null) {
      setuserInput('')
    }

  };

  const handleBackButton = () => {
    if (userInput) {
      const shouldLeave = window.confirm("You have stuff did not save. Do you still want to leave?");
      if (shouldLeave) {
        navigate(`/cards`, { state: { deckId: deckId } })
      }
    }
    else {
      navigate(`/cards`, { state: { deckId: deckId } })
    }
  }

  // Fetch decks
  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: async () => {
      let response = await api._get('/api/decks');

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.detail || 'An error occurred';
        throw new Error(`${response.status}: ${message}`);
      }

      return response.json();
    }
  });

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

  return (
    <div className='flex w-full h-full'>
      <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
      <div className="w-1/2 flex flex-col mx-auto">
        <div className="flex justify-between border-b-2 border-edMedGray mb-4 mt-8 pb-1">
          <h1 className="text-xl text-elDark dark:text-edWhite font-medium">New Card</h1>
          <select id="selectDeck" value={deckId} onChange={(e) => setDeckId(e.target.value)} className='text-black bg-elGray border border-black dark:bg-edDarker dark:text-edWhite focus:outline-none' >
            <option key='select-deck-key' value=''>Select a deck</option>
            {decks.map((deck) => (
              <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleAIParser} className='flex flex-col items-center'>
          <button type='button' onClick={handleBackButton} className="block rounded-sm sm:rounded-lg p-[7px] w-[20%] mb-4 text-center font-medium
              border border-edGray text-black dark:text-edWhite hover:bg-edHLT active:scale-[0.97] self-start">
            Back
          </button>
          <p className="text-elDark dark:text-edWhite mb-2">
            To let AI generate cards based on your input simply just put the text in the below box
            </p>
          <div className="mb-2 flex flex-col w-full">
            <textarea value={userInput} onChange={(e) => {setuserInput(e.target.value) }} className="text-black dark:text-white dark:bg-edDarker w-full min-h-20 h-40 p-2 border border-edDarkGray focus:outline-none custom-scrollbar"
              placeholder="put your text here" ></textarea>
          </div>
          <button type='submit' className="button-common button-blue font-semibold py-2 text-center w-1/4 my-2">
            Submit
          </button>

          <h3 className="text-elDark dark:text-edWhite">Preview</h3>
            <div className="h-[50vh] overflow-y-auto">
                {waiting ? (
                <div className="flex justify-center items-center">
                     <LoadingSpinner />
                </div>
                ) : (
                    preview.map((item, index) => (
                    <div className="grid grid-cols-2 gap-4 font-medium px-2" key={index}>
                        <div className="border bg-white dark:bg-edDarker text-black dark:text-edWhite mt-2 px-2 py-2">
                            <p>{item.question}</p>
                        </div>
                        <div className="border bg-white dark:bg-edDarker text-black dark:text-edWhite mt-2 px-2 py-2 relative">
                            <p>{item.answer}</p>
                        </div>
                    </div>
                    ))
                
                )}
          </div>
        </form>
      </div>
      <div className={`flex flex-col items-center min-w-40 p-3 fixed top-20 right-5 rounded-[1.4rem] text-white ${popupColor}
          transition-opacity duration-200 ${popupActive ? 'opacity-100' : 'opacity-0'}`}
      >
        {popupText}
        {popupSuccess && (
          <Link to={`/decks/${deckId}`} className="font-semibold bg-elStrongHLT rounded-md px-3 py-2 mt-2">Go to deck</Link>
        )}
      </div>
    </div>
  );
}

export default AICreateCardsPage;