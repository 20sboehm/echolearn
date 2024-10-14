import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery} from "react-query";
import { useState,useEffect } from "react";
import Sidebar from "../components/SideBar";
import { useApi } from "../hooks";
import editIconImg from "../assets/edit-icon.png"
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
// import ReactPlayer from 'react-player';
// import katex from 'katex';
// import 'katex/dist/katex.min.css';
// import voiceIconImg from "../assets/voice.png"

function DeckPage({ publicAccess = false }) {
  const api = useApi();
  const navigate = useNavigate();

  const [deleteMode, setDeleteMode] = useState(false);
  const { deckId } = useParams();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [folders, setFolders] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  // const [link, setLink] = useState('');
  // const [inputShareLink, setinputShareLink] = useState('');
  // const [newFolderName, setNewFolderName] = useState('');

  const [isCreateMode, setCreateMode] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [Rateresult,setRateresult] = useState(false)

  const [dragging, setDragging] = useState(null);
  const [items, setItems] = useState([]);
  const [itemKeys, setItemKeys] = useState([]);
  const { data: deckCards, isLoading, error, refetch } = useQuery(
    ['deckCards', deckId], // Unique key based on deckId
    async () => { // This function is queryFn
      let response = null;
      if (publicAccess) {
        response = await api._get(`/api/decks/public/${deckId}/cards`);
      } else {
        response = await api._get(`/api/decks/${deckId}/cards`);
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${response.status}: ${errorData.detail || 'An error occurred'}`);
      }
  
      return response.json();
    }, 
    { // This is the configuration object for useQuery
      onSuccess: (data) => {
        setItems(data.cards)
        // You can add logic here to handle successful data fetching
        console.log('Data fetched successfully:', data.cards);
      },
      retry: false
    }
  );
  // useEffect(() => {
  //   if (items) {
  //     setItemKeys(Object.cards(items)); // Initialize the keys array
  //     console.log(itemKeys)
  //   }
  // }, [items]);
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

  let reviewedCardsCount = 0;
  // Check if 'cards' property exists and is an array
  if (deckCards.cards && Array.isArray(deckCards.cards)) {
    
    reviewedCardsCount = deckCards.cards.filter(card => card.next_review && Date.parse(card.next_review) >= Date.now()).length;
  }

  const totalCardsCount = deckCards.cards.length; // Total number of cards in the deck

  const toggleCreateMode = () => {
    setCreateMode(!isCreateMode);
  };

  const handleCreateCard = async () => {
    if (newQuestion.trim() === "" || newAnswer.trim() === "") {
      alert("Question and Answer cannot be empty");
      return;
    }

    const requestData = {
      deck_id: deckId,
      question: newQuestion,
      answer: newAnswer,
    };

    try {
      const response = await api._post(`/api/cards`, requestData);
      if (!response.ok) {
        throw new Error('Failed to create card');
      }

      setNewQuestion("");
      setNewAnswer("");
      setCreateMode(false);
      refetch();
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const handleCancelCreateCard = () => {
    setNewQuestion("");
    setNewAnswer("");
    setCreateMode(false);
  };

  const handleDeleteDeck = async () => {
    if (window.confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      try {
        const response = await api._delete(`/api/decks/${deckId}`);
        if (!response.ok) {
          throw new Error('Failed to delete deck');
        }
        popupDetails('Deck deleted successfully!', 'green');
        navigate('/');
      } catch (error) {
        console.error('Error deleting deck:', error);
        popupDetails('Failed to delete deck.', 'red');
      }
    }
  };

  // Calculate the percentage of cards that don't need review
  const percentage = totalCardsCount > 0 ? ((reviewedCardsCount / totalCardsCount) * 100).toFixed(2) : 100;

  const radius = 60;

  // Calculate the circumference of the circle
  const circumference = Math.PI * 2 * radius;

  // Calculate the length of the dash
  const dashLength = (percentage / 100) * circumference;

  // Calculate the length of the gap
  const gapLength = circumference - dashLength;

  const strokeDashoffset = circumference / 4;


  const changeMode = () => {
    setDeleteMode(!deleteMode);
  };

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


  const setStatus = async () => {
    try {
      const response = await api._post(`/api/decks/${deckId}/updateStatus`);
      if (!response.ok) {
        throw new Error('Failed to update card');
      }
      else {
        popupDetails('Deck privacy has been updated!.', 'green')
        refetch();
      }
    } catch (error) {

      console.error(error);
    }
  };

  const handleCardClick = async (cardId) => {
    if (deleteMode) {
      try {
        const response = await api._delete(`/api/cards/${cardId}`);
        if (!response.ok) {
          throw new Error('Failed to delete card');
        }
        console.log("Deleted card with ID:", cardId);
        refetch();
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    }
  };

  // const KatexOutput = ({ latex }) => {
  //   const html = katex.renderToString(latex, {
  //     throwOnError: false,
  //     output: "html"
  //   });

  //   return <div dangerouslySetInnerHTML={{ __html: html }} />;
  // };

  // const handleGenerateLink = async () => {
  //   const response = await api._post(`/api/decks/${deckId}/generate-share-link`)
  //   try {
  //     if (!response.ok) {
  //       throw new Error('Failed to share deck');
  //     }
  //     const data = await response.json();
  //     console.log("shared link:", data.link);
  //     setLink(data.link)
  //     prompt("Copy this link and share it:", data.link);
  //   } catch (error) {
  //     console.error('Error', error);
  //   }
  // };

  const handleTakeACopy = async () => {
    setModalOpen(true); // Open the modal to select or create a folder
    const userfolders = await api._get(`/api/folders`)
    const folderData = await userfolders.json()
    console.log(folderData)
    setFolders(folderData)
  };

  const handleFolderSelection = async (folderId) => {
    const response = await api._get(`/api/decks/${deckId}/take_copy/${folderId}`);
    try {
      if (!response.ok) {
        throw new Error('Failed to copy deck to folder');
      }
      alert('Deck copied successfully!');
      setModalOpen(false); // Close the modal after action
      setRefetchTrigger(prev => !prev);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const speakText = (question) => {
    // setQuestion(e.card.question);
    console.log('what')
    const outputVoice = new SpeechSynthesisUtterance(question);
    outputVoice.lang = "en";
    speechSynthesis.speak(outputVoice);
  };

    const fetchRatingData = async () => {
      try {
        const response = await api._get(`/api/decks/${deckId}/ratedOrnot`);
        const json = await response.json();
        console.log(json)
        if(json === true){
          setRateresult(true)
        }
        else{
          setRateresult(false)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchRatingData();

  const submitRating = async () => {
    const response = await api._post(`/api/decks/${deckId}/ratings`);
    const data = await response.json();
    if (data.status == "removed")
      setRateresult(false)
    else if (data.status == "updated")
      setRateresult(true)

    refetch();
  };

  const handleDragStart = (e, index) => {
    setDragging(index);
    console.log(index)
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };
  const handleDrop = (e, index) => {
    e.preventDefault();
    const updatedItems = [...items];
    const [draggedItem] = updatedItems.splice(dragging, 1);
    updatedItems.splice(index, 0, draggedItem);
    setItems(updatedItems);
    setDragging(null);
  };
  return (
    <>
      <div className="flex flex-row w-full h-full">
        <Sidebar refetchTrigger={refetchTrigger} onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="w-[65vw] flex flex-col flex-grow transition-transform mx-[5vh] overflow-x-auto">
          <div className="flex flex-row">
            <TopButtons deckCards={deckCards} publicAccess={publicAccess} deckId={deckId} handleDeleteDeck={handleDeleteDeck} />

            <ProgressCircleGraph radius={radius} dashLength={dashLength} gapLength={gapLength} strokeDashoffset={strokeDashoffset} percentage={percentage} />
          </div>

          <MiddleButtons deckCards={deckCards} publicAccess={publicAccess} setStatus={setStatus} isCreateMode={isCreateMode}
            handleCreateCard={handleCreateCard} toggleCreateMode={toggleCreateMode} handleCancelCreateCard={handleCancelCreateCard}
            handleTakeACopy={handleTakeACopy} isModalOpen={isModalOpen} folders={folders} handleFolderSelection={handleFolderSelection}
            setModalOpen={setModalOpen} deleteMode={deleteMode} changeMode={changeMode} />
            
            <button onClick={submitRating} id="button-preview" aria-labelledby="tooltip-1f7d89ff-668b-406b-9c3f-e3e313ecdc97" type="button" data-view-component="true" class="Button Button--iconOnly Button--secondary Button--medium">
            {Rateresult ? (
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star-filled Button-visual">
                <path fill="gold" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
              </svg>
            ) : (
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star Button-visual">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
              </svg>

            )}
            {deckCards.stars}
          </button>

          <div className="h-[50vh] overflow-y-auto border-t border-gray-500" >

            {items.map((item,index)=> (
              <div className={`flex font-medium mt-4 border border-eMedGray bg-eDarker w-full ${deleteMode ? "hover:bg-[#ff000055] cursor-not-allowed" : ""}`}
                key={item.card_id} onClick={() => { handleCardClick(item.card_id) }}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >

                <div className={`relative w-1/2 flex flex-col pr-4 border-r border-eMedGray`}>
                  <MarkdownPreviewer content={item.question} className="flex-1 p-2 min-h-20" />
                  <Link to={`/edit/${item.card_id}`}>
                    <img src={editIconImg} alt="Edit_Icon" className="absolute top-8 right-0.5 h-[21px] w-[28px]" />
                  </Link>
                  <Link onClick={() => speakText(item.question)}>
                    <SpeakerIcon className="absolute top-1 right-1" />
                  </Link>
                </div>

                <div className="relative w-1/2 flex flex-col">
                  <MarkdownPreviewer content={item.answer} className="flex-1 p-2" />
                  <Link onClick={() => speakText(item.answer)}>
                    <SpeakerIcon className="absolute top-1 right-1" />
                  </Link>
                </div>

              </div>
            ))}

            {/* Create cards */}
            {isCreateMode && (
              <div className="grid grid-cols-2 gap-4 font-medium px-2 mt-4">
                <div className="border rounded-sm bg-eWhite text-eBlack p-2">
                  <input
                    type="text"
                    placeholder="Enter question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full px-2 py-1 rounded"
                    autoFocus
                  />
                </div>
                <div className="border rounded-sm bg-eWhite text-eBlack p-2">
                  <input
                    type="text"
                    placeholder="Enter answer"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="w-full px-2 py-1 rounded"
                  />
                </div>
              </div>
            )}
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

const SpeakerIcon = ({ width = "20px", height = "20px", fill = "#ccc", className }) => {
  return (
    <svg
      fill={fill}
      width={width}
      height={height}
      viewBox="-2.5 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
      className={`cf-icon-svg ${className}`}
    >
      <path d="M7.365 4.785v9.63c0 .61-.353.756-.784.325l-2.896-2.896H1.708A1.112 1.112 0 0 1 .6 10.736V8.464a1.112 1.112 0 0 1 1.108-1.108h1.977L6.581 4.46c.43-.43.784-.285.784.325zm2.468 7.311a3.53 3.53 0 0 0 0-4.992.554.554 0 0 0-.784.784 2.425 2.425 0 0 1 0 3.425.554.554 0 1 0 .784.783zm1.791 1.792a6.059 6.059 0 0 0 0-8.575.554.554 0 1 0-.784.783 4.955 4.955 0 0 1 0 7.008.554.554 0 1 0 .784.784z" />
    </svg>
  );
};

function TopButtons({ deckCards, publicAccess, deckId, handleDeleteDeck, }) {
  return (
    <div className="flex flex-col items-start">
      <h1 className="text-4xl font-bold my-4">{deckCards.deck_name}</h1>
      {publicAccess ? (
        null
      ) : (
        <div className="flex gap-4 mb-2">
          <Link to={`/review/${deckId}`} className={` rounded-lg border border-transparent px-12 py-2 text-center
                font-semibold bg-blue-500 hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
                active:border-[#555]`} style={{ transition: "border-color 0.10s, color 0.10s" }}>
            Study
          </Link>
          <Link to={`/review/${deckId}?studyAll=true`} className={` rounded-lg border border-transparent px-12 py-2 text-center
                font-semibold bg-blue-500 hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
                active:border-[#555]`} style={{ transition: "border-color 0.10s, color 0.10s" }}>
            StudyAll
          </Link>
        </div>
      )}
      {publicAccess ? (
        null
      ) : (
        <button
          className="mt-2 rounded-lg border border-transparent px-4 py-2 font-semibold bg-red-500 hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] active:border-[#555]"
          style={{ transition: "border-color 0.10s, color 0.10s" }}
          onClick={handleDeleteDeck}
        >
          Delete Deck
        </button>
      )}
    </div>
  )
}

function MiddleButtons({ deckCards, publicAccess, setStatus, isCreateMode, handleCreateCard, toggleCreateMode, handleCancelCreateCard,
  handleTakeACopy, isModalOpen, folders, handleFolderSelection, setModalOpen, deleteMode, changeMode }) {
  return (
    <div className="flex flex-row items-center justify-between mt-2 mb-4 border-t border-gray-500 pt-4">
      <h1>{deckCards.cards.length} Cards</h1>
      <button
        disabled={publicAccess}
        className={`${deckCards.isPublic ? "bg-green-600" : "bg-red-600"}
              ${publicAccess ? "" : "active:scale-[0.97] hover:border-white hover:text-white"}
              rounded-lg border border-transparent px-2 py-1 disabled:bg-gray-500 font-semibold`}
        style={{ transition: "border-color 0.10s, color 0.10s" }} onClick={setStatus}>
        {deckCards.isPublic ? "Public" : "Private"}
      </button>

      {publicAccess ? (
        null
      ) : (
        <div>
          <button className={`${isCreateMode ? "bg-green-500" : "bg-blue-500"} rounded-lg border border-transparent px-2 py-1 
              font-semibold hover:border-white hover:text-white active:scale-[0.97]`}
            style={{ transition: "border-color 0.10s, color 0.10s" }} onClick={isCreateMode ? handleCreateCard : toggleCreateMode}>
            {isCreateMode ? "Done" : "Create"}
          </button>
          {isCreateMode && (
            <button className="bg-red-500 rounded-lg border border-transparent px-2 py-1 
                font-semibold hover:border-white hover:text-white active:scale-[0.97]"
              style={{ transition: "border-color 0.10s, color 0.10s" }} onClick={handleCancelCreateCard}>
              Cancel
            </button>
          )}
        </div>
      )}

      <div>
        <button type="button" onClick={handleTakeACopy}>Copy Deck</button>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Select a folder </h2>
              {folders.map(folder => (
                <button className={`bg-eBlue rounded-lg border border-transparent px-2 py-1 
                      font-semibold hover:border-white hover:text-white active:scale-[0.97]`}
                  key={folder.folder_id} onClick={() => handleFolderSelection(folder.folder_id)}>
                  {folder.name}
                </button>
              ))}
              <button onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      {publicAccess ? (
        null
      ) : (
        <button className={`${deleteMode ? "bg-red-500" : "bg-blue-500"} rounded-lg border border-transparent px-2 py-1 
              font-semibold hover:border-white hover:text-white active:scale-[0.97]`}
          style={{ transition: "border-color 0.10s, color 0.10s" }} onClick={changeMode}>
          {deleteMode ? "Cancel" : "Delete"}
        </button>
      )}

    </div>
  )
}

function ProgressCircleGraph({ radius, dashLength, gapLength, strokeDashoffset, percentage }) {
  return (
    <div className="flex flex-col ml-auto justify-center items-center mb-4">
      {/* JavaScript code to draw the graph */}
      <svg width="200" height="200" viewBox="0 20 200 150">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#ECEFF1" strokeWidth="7.5" />
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#29A5DC" strokeWidth="7.5" strokeLinecap="round"
          strokeDasharray={`${dashLength},${gapLength}`} strokeDashoffset={strokeDashoffset}>
          <title>Progress</title>
        </circle>
        <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16">
          {percentage}%
        </text>
      </svg>
    </div>
  )
}

export default DeckPage