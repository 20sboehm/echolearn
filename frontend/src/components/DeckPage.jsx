import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";
import SideBar from "./SideBar";
import ReactPlayer from 'react-player';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useApi } from "../hooks";
import editIconImg from "../assets/edit-icon.png"
import voiceIconImg from "../assets/voice.png"

function DeckPage() {
  const api = useApi();

  const [deleteMode, setDeleteMode] = useState(false);
  const { deckId } = useParams();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [link, setLink] = useState('');
  const [inputShareLink, setinputShareLink] = useState('');
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

// Fetch reviews info
const { data: deckCards, isLoading, error, refetch } = useQuery(
  ['deckCards', deckId], // Unique key based on deckId
  () => api._get(`/api/decks/${deckId}/cards`).then((response) => response.json()),
  {
    enabled: !!deckId // Only run the query if deckId is truthy
  }
);


  useEffect(() => {
    console.log("Deck Cards:", deckCards);
  }, [deckCards]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let reviewedCardsCount = 0;
  // Check if 'cards' property exists and is an array
  if (deckCards.cards && Array.isArray(deckCards.cards)) {
    reviewedCardsCount = deckCards.cards.filter(card => card.next_review && Date.parse(card.next_review) >= Date.now()).length;
  }
  
  const totalCardsCount = deckCards.cards.length; // Total number of cards in the deck

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

  const KatexOutput = ({ latex }) => {
    const html = katex.renderToString(latex, {
      throwOnError: false,
      output: "html"
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const handleGenerateLink = async () => {
    const response = await api._post(`/api/decks/${deckId}/generate-share-link`)
    try {
      if (!response.ok) {
        throw new Error('Failed to share deck');
      }
      const data = await response.json();
      console.log("shared link:", data.link);
      setLink(data.link)
      prompt("Copy this link and share it:", data.link);
    } catch (error) {
      console.error('Error', error);
    }
  };
  const handleTakeACopy =async () => {
    setModalOpen(true); // Open the modal to select or create a folder
    const userfolders = await api._get(`/api/folders`)
    const folderData = await userfolders.json()
    console.log(folderData)
    setFolders(folderData)
    if (userfolders !== null && userfolders.length !== 0) {
      const response = await api._get(`/api/decks/${deckId}/take_copy`)
      try {
        if (!response.ok) {
          throw new Error('Failed to share deck');
        }
      } catch (error) {
        console.error('Error', error);
      }
    } else {
      console.log("No input provided or user cancelled the prompt.");
    }
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


  return (
    <>
      <SideBar refetchTrigger={refetchTrigger} />
      <div className="w-[65vw]">
        <div className="flex flex-row">
          <div className="flex flex-col items-start">
            <h1 className="text-4xl font-bold my-4">{deckCards.deck_name}</h1>
            <Link to={`/review/${deckId}`} className="rounded-lg border border-transparent px-12 py-2 text-center
              font-semibold bg-blue-500 hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
              active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>
              Study
            </Link>
          </div>

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
            <Link to={`/stats/${deckId}`}>
              <button className="rounded-lg border border-transparent px-4 py-2 
                font-semibold bg-blue-500 hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
                active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>
                More Statistics</button>
            </Link>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between mt-2 mb-4 border-t border-gray-500 pt-4">
          <h1>{deckCards.cards.length} Cards</h1>
          <button
            className={`${deckCards.isPublic ? "bg-blue-500" : "bg-red-500"} rounded-lg border border-transparent px-2 py-1 
              font-semibold hover:border-white hover:text-white active:scale-[0.97]`}
            style={{ transition: "border-color 0.10s, color 0.10s" }} onClick={setStatus}>
            {deckCards.isPublic ? "Public" : "Private"}
          </button>

          {/* <button className={`bg-blue-500  rounded-lg border border-transparent px-2 py-1 
              font-semibold hover:border-white hover:text-white active:scale-[0.97]`}
            style={{ transition: "border-color 0.10s, color 0.10s" }} onClick={handleGenerateLink}>Generate Share Link</button> */}
         
          <div>
            <button onClick={handleTakeACopy}>Copy Deck</button>
            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h2>Select a folder </h2>
                  {folders.map(folder => (
                    <button className={`bg-blue-500  rounded-lg border border-transparent px-2 py-1 
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
          <button className={`${deleteMode ? "bg-red-500" : "bg-blue-500"} rounded-lg border border-transparent px-2 py-1 
              font-semibold hover:border-white hover:text-white active:scale-[0.97]`}
            style={{ transition: "border-color 0.10s, color 0.10s" }} onClick={changeMode}>
            {deleteMode ? "Cancel" : "Delete"}</button>
        </div>

        <div className="h-[50vh] overflow-y-auto border-t border-gray-500">
          {deckCards.cards.map(card => (
            <div className="grid grid-cols-2 gap-4 font-medium px-2" key={card.card_id}>

              <div className="border rounded-sm bg-white text-black mt-2 px-2 py-2" onClick={() => handleCardClick(card.card_id)}>
                <div dangerouslySetInnerHTML={{ __html: card.question }} />
                  
                {ReactPlayer.canPlay(card.questionvideolink) && (
                  <>
                    <ReactPlayer
                      url={card.questionvideolink}
                      controls={true}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </>
                )}
                {card.questionimagelink && <img src={card.questionimagelink} style={{ maxWidth: '250px', maxHeight: '250px' }} />}
                {card.questionlatex && <KatexOutput latex={card.questionlatex} />}
                  <Link onClick={()=>speakText(card.question)}>
                    <img src={voiceIconImg} alt="Voice_Icon" className="  top-45 left-20 right-1 h-6 w-8" />
                  </Link>
              </div>


              <div className="border rounded-sm bg-white text-black mt-2 px-2 py-4 relative" onClick={() => handleCardClick(card.card_id)}>
                <div dangerouslySetInnerHTML={{ __html: card.answer }} />
               
                {ReactPlayer.canPlay(card.answervideolink) && (
                  <>
                    <ReactPlayer
                      url={card.answervideolink}
                      controls={true}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </>
                )}
                {card.answerimagelink && <img src={card.answerimagelink} style={{ maxWidth: '250px', maxHeight: '250px' }} />}
                {card.answerlatex && <KatexOutput latex={card.answerlatex} />}
                <Link to={`/edit/${card.card_id}`}>
                  <img src={editIconImg} alt="Edit_Icon" className="absolute top-0 right-0 h-6 w-8" />
                </Link>
                <Link onClick={()=>speakText(card.answer)}>
                  <img src={voiceIconImg} alt="Voice_Icon" className="absolute top-8 right-0 h-6 w-8" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPopup && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
          {popupMessage}
        </div>
      )}
    </>
  )
}


export default DeckPage