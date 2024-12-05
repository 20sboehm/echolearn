import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { useApi } from "../hooks";
import editIconImg from "../assets/edit-icon.png"
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { SpeakerIcon, StarIcon, HeartIcon, EditIcon, DragIcon } from "../components/Icons";
import './Buttons.css';

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

  const [refetchTrigger, setRefetchTrigger] = useState(false);


  const [isCreateMode, setCreateMode] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const [deckname, setdeckname] = useState("");
  const [deckdescription, setdeckdescription] = useState("");
  const [previewText, setpreviewText] = useState("");

  const [ChangedCardsId, setChangedCardsId] = useState([]);

  const [sidebarWidth, setSidebarWidth] = useState(250);

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
        setdeckname(data.deck_name);
        setdeckdescription(data.deckdescription);
        console.log(data.deck_description)
        console.log(data.order_List)
        console.log(data)
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

  const handleCardChange = (cardId, type, text) => {
    if (type === "questionText") {
      setItems(prevItems => prevItems.map(item => {
        if (item.card_id === cardId) {
          //set preview here then trigger markdown 
          console.log(item.question)
          setpreviewText(text)
          item.question = text
        }
        setChangedCardsId(prevIds => {
          // Ensure only unique IDs are added
          return prevIds.includes(cardId) ? prevIds : [...prevIds, cardId];
        });

        return item
      }));
    }
    else {
      setItems(prevItems => prevItems.map(item => {
        if (item.card_id === cardId) {
          setpreviewText(text)
          item.answer = text
        }
        setChangedCardsId(prevIds => {
          // Ensure only unique IDs are added
          return prevIds.includes(cardId) ? prevIds : [...prevIds, cardId];
        });
        return item
      }));

    }

  };

  const setpreviewer = (cardId, type, text) => {

  };
  const handleDeckChange = (type, text) => {
    if (type === "Deckname") {
      setdeckname(text)
    }
    else {
      setdeckdescription(text)
      console.log(deckdescription)
    }

  };

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
  const handleEditAll = async () => {
    try {
      console.log(deckname)
      console.log(deckdescription)
      const dataToSend = {
        newItems: items.filter(item => ChangedCardsId.includes(item.card_id)),
        newdeckname: deckname,
        newdeckdescription: deckdescription,
      };
      const response = await api._post(`/api/decks/${deckId}/editall`, dataToSend);
      if (!response.ok) {
        throw new Error('Failed to edit all deck');
      }
      popupDetails('Edit all decks successfully!', 'green');
      refetch();
      navigate(`/decks/${deckId}`);
    } catch (error) {
      console.error('Error editing all decks:', error);
      popupDetails('Failed to editing all decks.', 'red');
    }
  };
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
        <div className="w-full flex flex-col mx-[15%] max-h-[calc(100vh-5rem)] border-b border-elDividerGray dark:border-edDividerGray">
          <div className=" flex flex-col text-[2rem] text-elDark dark:text-edWhite font-medium mt-8 mb-4 
            border-b w-full border-elDividerGray dark:border-edDividerGray pb-1">
            <div className="flex items-center mb-4">
              {/* <label htmlFor="deckname" >Deckname: </label> */}
              <input id="deckname" value={deckname} onChange={(e) => handleDeckChange("Deckname", e.target.value)}
                className="border border-edDividerGray p-1 dark:border-edDividerGray bg-transparent min-h-20 mr-2"></input>
              <textarea placeholder="Put description here" value={deckdescription} onChange={(e) => handleDeckChange("Deckdescription", e.target.value)}
                className="border border-edDividerGray p-1 text-base w-1/2 bg-transparent flex-1 min-h-20" />
            </div>

          </div>
          <div className="flex">

            <div className="flex flex-col">
              {publicAccess ? (
                null
              ) : (
                <div className="flex items-start mb-3 pb-3 gap-2 border-b border-elDividerGray dark:border-edDividerGray">
                  <>
                    <button disabled={publicAccess} className={`button-top ${deckCards.isPublic ? "button-green" : "button-red"} ${publicAccess ? "" : ""}`}
                      onClick={setStatus}> {deckCards.isPublic ? "Public" : "Private"} </button>
                    <button
                      className="button-topDelete"
                      onClick={handleDeleteDeck}
                    >
                      Delete Deck
                    </button>
                    <button
                      className="button-top"
                      onClick={handleEditAll}
                    >
                      Submit
                    </button>
                  </>
                </div>
              )}
              <div className="flex flex-row items-start text-black dark:text-edLightGray gap-2 mb-4">

                {publicAccess ? (
                  null
                ) : (
                  <>
                    <div>
                      <button className={`button-common ${isCreateMode ? "button-green" : "button-blue"}`}
                        onClick={isCreateMode ? handleCreateCard : toggleCreateMode}>
                        {isCreateMode ? "Done" : "Quick Create Card"}
                      </button>
                      {isCreateMode && (
                        <button className={`button-common button-red mx-2`} onClick={handleCancelCreateCard}> Cancel </button>
                      )}
                    </div>
                    <button className={`button-common ${deleteMode ? "button-red" : "button-blue"}`} onClick={changeMode}>
                      {deleteMode ? "Cancel" : "Toggle Delete Card"}
                    </button>
                  </>

                )}

              </div>

            </div>
            <div className="p-1 ml-4 border-l border-edDividerGray">
              <p className="underline text-elDark dark:text-edWhite">Preview</p>
              <MarkdownPreviewer content={previewText} className="flex-1 min-h-20 rounded-2xl bg-transparent" />
            </div>

          </div>

          <div className={`flex flex-col items-center flex-grow overflow-y-auto border-t border-elDividerGray dark:border-edDividerGray`}>

            {items.map((item, index) => (

              <div className={`flex font-medium mt-4 border border-elDividerGray dark:border-edDividerGray rounded-2xl bg-elGray dark:bg-edDarker w-[99%] 
                ${deleteMode ? "hover:bg-[#ff000055] hover:dark:bg-[#ff000055] cursor-not-allowed" : ""}`}
                key={item.card_id} onClick={() => { handleCardClick(item.card_id) }}

                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="cursor-move ml-2 mt-2" draggable onDragStart={(e) => handleDragStart(e, index)}>
                  <DragIcon />
                </div>
                {/* <p>{index + 1}</p> */}
                <div className={`relative w-1/2 flex flex-col border-r border-elDividerGray dark:border-edDividerGray bg-transparent`}>
                  <textarea value={item.question} onChange={(e) => handleCardChange(item.card_id, 'questionText', e.target.value)} onClick={(e) => setpreviewText(e.target.value)}
                    className="flex-1 p-2 min-h-20 rounded-2xl bg-transparent text-elDark dark:text-edWhite" />
                </div>

                <div className="relative w-1/2 flex flex-col bg-transparent">
                  <textarea value={item.answer} onChange={(e) => handleCardChange(item.card_id, 'answerText', e.target.value)} onClick={(e) => setpreviewText(e.target.value)}
                    className="flex-1 p-2 min-h-20 rounded-2xl bg-transparent text-elDark dark:text-edWhite" />
                </div>

              </div>
            ))}
            {isCreateMode && (
              <div className={`flex font-medium mt-4 border border-elDividerGray dark:border-edDividerGray rounded-2xl bg-elGray dark:bg-edDarker w-[99%]`}>
                <textarea placeholder="Enter question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-1/2 border-r border-elDividerGray dark:border-edDividerGray bg-transparent flex-1 p-2 min-h-20" autoFocus />
                <textarea placeholder="Enter answer" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-1/2 bg-transparent flex-1 p-2 min-h-20" />
              </div>
            )}
          </div>

        </div>
      </div >
      {showPopup && (
        <div className={`text-white font-semibold fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
          {popupMessage}
        </div>
      )
      }
    </>
  )
}




export default DeckPage