import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { useApi } from "../hooks";
import editIconImg from "../assets/edit-icon.png"
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { SpeakerIcon, StarIcon, HeartIcon, EditIcon } from "../components/Icons";
import './Buttons.css';

// import ReactPlayer from 'react-player';
// import katex from 'katex';
// import 'katex/dist/katex.min.css';
// import voiceIconImg from "../assets/voice.png"

function DeckPage({ publicAccess = false }) {
  const api = useApi();
  const navigate = useNavigate();

  const [deleteMode, setDeleteMode] = useState(false);
  const { deckId } = useParams();
  const [isPublicAccess, setIsPublicAccess] = useState(publicAccess);

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
  const [Rateresult, setRateresult] = useState(false)

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
        response = await api._get(`/api/decks/${deckId}/cards`); // If the ordered list is empty this will automatically create one
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${response.status}: ${errorData.detail || 'An error occurred'}`);
      }

      return response.json();
    },
    {
      onSuccess: (data) => {
        setItemKeys(data.order_List);
        setItems(reorderItems(data.cards, data.order_List));
        setIsPublicAccess(data.publicAccess);
        console.log(data.order_List)
        console.log('Data fetched successfully:', items);
      },
      retry: false
    }
  );

  const reorderItems = (cards, orderList) => {
    if (!orderList)
      return cards;
    const orderedCards = new Array(cards.length).fill(null);
    // Place each card in its new position according to orderList
    orderList.forEach((cardId, index) => {
      const card = cards.find(card => card.card_id === cardId);
      if (card) {
        orderedCards[index] = card;
      }
    });
    return orderedCards
  };

  const submitorderList = async (templist) => {
    console.log("SUBMITTING ORDER LIST")
    const response = await api._post(`/api/decks/${deckId}/orderList`, {
      templist
    });
    const data = await response.json();
    console.log(data)

  };

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
    const outputVoice = new SpeechSynthesisUtterance(question);
    outputVoice.lang = "en";
    speechSynthesis.speak(outputVoice);
  };

  const fetchRatingData = async () => {
    try {
      const response = await api._get(`/api/decks/${deckId}/ratedOrnot`);
      const json = await response.json();
      console.log(json)
      if (json === true) {
        setRateresult(true)
      }
      else {
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
    setItemKeys(null);
    let templist = []
    templist = updatedItems.map(item => parseInt(item.card_id))
    console.log(templist)
    setItemKeys(templist)
    console.log(itemKeys)
    submitorderList(templist);
    setDragging(null);
  };

  return (
    <>
      <div className="flex flex-row w-full h-full">
        <Sidebar refetchTrigger={refetchTrigger} onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="w-[65vw] flex flex-col flex-grow transition-transform mx-[5vh] overflow-x-auto">
          <div className="flex flex-row">
            <TopButtons deckCards={deckCards} publicAccess={isPublicAccess} deckId={deckId} handleDeleteDeck={handleDeleteDeck} />

            <ProgressCircleGraph radius={radius} dashLength={dashLength} gapLength={gapLength} strokeDashoffset={strokeDashoffset} percentage={percentage} deckId={deckId} publicAccess={isPublicAccess} />
          </div>

          <MiddleButtons deckCards={deckCards} publicAccess={isPublicAccess} setStatus={setStatus} isCreateMode={isCreateMode}
            handleCreateCard={handleCreateCard} toggleCreateMode={toggleCreateMode} handleCancelCreateCard={handleCancelCreateCard}
            handleTakeACopy={handleTakeACopy} isModalOpen={isModalOpen} folders={folders} handleFolderSelection={handleFolderSelection}
            setModalOpen={setModalOpen} deleteMode={deleteMode} changeMode={changeMode} />

          <button onClick={submitRating} id="button-preview" aria-labelledby="tooltip-1f7d89ff-668b-406b-9c3f-e3e313ecdc97" type="button" data-view-component="true" className="w-[5vw] Button Button--iconOnly Button--secondary Button--medium inline-flex items-center space-x-2 p-2">
            <HeartIcon isFilled={Rateresult} />
            <p className="text-black dark:text-edWhite">{deckCards.stars}</p>
          </button>

          <div className={`${isPublicAccess ? 'h-[70vh]' : 'h-[50vh]'} overflow-y-auto border-t border-gray-500`}>

            {items.map((item, index) => (
              <div className={`flex font-medium mt-4 border border-edMedGray bg-elGray dark:bg-edDarker w-full ${deleteMode ? "hover:bg-[#ff000055] cursor-not-allowed" : ""}`}
                key={item.card_id} onClick={() => { handleCardClick(item.card_id) }}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >

                <div className={`relative w-1/2 flex flex-col pr-4 border-r border-edMedGray`}>
                  <MarkdownPreviewer content={item.question} className="bg-elGray dark:bg-edDarker flex-1 p-2 min-h-20" />
                  <Link to={`/edit/${item.card_id}`} className="absolute top-8 right-0.5">
                    <EditIcon />
                  </Link>
                  <Link onClick={() => speakText(item.question)} className="absolute top-2 right-0.5">
                    <SpeakerIcon />
                  </Link>
                </div>

                <div className="relative w-1/2 flex flex-col">
                  <MarkdownPreviewer content={item.answer} className="bg-elGray dark:bg-edDarker flex-1 p-2" />
                  <Link onClick={() => speakText(item.answer)} className="absolute top-2 right-0.5">
                    <SpeakerIcon />
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

function TopButtons({ deckCards, publicAccess, deckId, handleDeleteDeck, }) {
  return (
    <div className="flex flex-col items-start">
      <h1 className="text-4xl font-bold my-4 text-black dark:text-edLightGray">{deckCards.deck_name}</h1>
      {publicAccess ? (
        null
      ) : (
        <div className="flex gap-4 mb-2">
          <Link to={`/review/${deckId}`} className="button-top">
            Study
          </Link>
          <Link to={`/review/${deckId}?studyAll=true`} className="button-top">
            StudyAll
          </Link>
        </div>
      )}
      {publicAccess ? (
        null
      ) : (
        <button
          className="button-topDelete"
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
    <div className="flex flex-row items-center text-black dark:text-edLightGray justify-between mt-2 mb-4 border-t border-gray-500 pt-4">
      <h1>{deckCards.cards.length} Cards</h1>
      <button
        disabled={publicAccess}
        className={`button-common ${deckCards.isPublic ? "button-green" : "button-red"}
            ${publicAccess ? "" : ""}`}
        onClick={setStatus}>
        {deckCards.isPublic ? "Public" : "Private"}
      </button>

      {publicAccess ? (
        null
      ) : (
        <div>
          <button className={`button-common ${isCreateMode ? "button-green" : "button-blue"}`}
            onClick={isCreateMode ? handleCreateCard : toggleCreateMode}>
            {isCreateMode ? "Done" : "Create"}
          </button>
          {isCreateMode && (
            <button className={`button-common button-red`}
              onClick={handleCancelCreateCard}>
              Cancel
            </button>
          )}
        </div>
      )}

      <div className="text-black dark:text-white">
        <button type="button" className="button-common button-blue" onClick={handleTakeACopy}>Copy Deck</button>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Select a folder </h2>
              {folders.map(folder => (
                <button className="button-common button-blue"
                  key={folder.folder_id} onClick={() => handleFolderSelection(folder.folder_id)}>
                  {folder.name}
                </button>
              ))}
              <button className={`button-common button-red`} onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      {publicAccess ? (
        null
      ) : (
        <button className={`button-common ${deleteMode ? "button-red" : "button-blue"}`} onClick={changeMode}>
          {deleteMode ? "Cancel" : "Delete"}
        </button>
      )}

    </div>
  )
}

function ProgressCircleGraph({ radius, dashLength, gapLength, strokeDashoffset, percentage, deckId, publicAccess }) {
  if (publicAccess) {
    return null;
  }

  return (
    <div className="flex flex-col ml-auto justify-center items-center mb-4">
      {/* JavaScript code to draw the graph */}
      <svg width="200" height="200" viewBox="0 20 200 150">
        <circle cx="100" cy="100" r={radius} fill="none" className="stroke-elDarkGray dark:stroke-edLightGray" strokeWidth="7.5" />
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#29A5DC" strokeWidth="7.5" strokeLinecap="round"
          strokeDasharray={`${dashLength},${gapLength}`} strokeDashoffset={strokeDashoffset}>
        </circle>
        <text x="100" y="100" textAnchor="middle" className="fill-black dark:fill-edLightGray" fontSize="16">
          <tspan x="100" dy="-3">{percentage}%</tspan>
          <tspan x="100" dy="20">Mastery</tspan>
        </text>
      </svg>
      <Link to={`/stats/${deckId}`}>
        <button className="button-top">
          More Statistics</button>
      </Link>
    </div>
  )
}

export default DeckPage