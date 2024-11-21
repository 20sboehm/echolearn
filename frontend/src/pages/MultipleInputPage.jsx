import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import Sidebar from "../components/SideBar";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate, useLocation, Link } from "react-router-dom";
import './Buttons.css';

function MultipleInputPage() {
  const api = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const inputRef = useRef(null);

  const [inputText, setInputText] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [deckId, setDeckId] = useState(location?.state?.deckId);
  const [questionAnswerDivider, setQuestionAnswerDivider] = useState('{-}')
  const [cardDivider, setCardDivider] = useState('{|}')
  const [placeholder, setPlaceholder] = useState('');
  const [preview, setPreview] = useState([])

  const [popupActive, setPopupActive] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const popupTimerRef = useRef(null); // Ref to hold the popup timer

  const [sidebarWidth, setSidebarWidth] = useState(250);

  const displayPopup = (isSuccess, message) => {
    // Clear the old timer if it is still active
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }

    setPopupActive(true);
    setPopupText(message);

    if (isSuccess) {
      // setPopupText("Cards created");
      setPopupSuccess(true);
      setPopupColor("bg-edGreen");
    } else {
      // setPopupText("Something went wrong");
      setPopupSuccess(false);
      setPopupColor("bg-edRed");
    }

    popupTimerRef.current = setTimeout(() => {
      setPopupActive(false);
    }, 5000)
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

  // Display placeholder and preview for multiple input
  useEffect(() => {
    setPlaceholder(`Question 1 ${questionAnswerDivider} Answer 1${cardDivider}\nQuestion 2 ${questionAnswerDivider} Answer 2${cardDivider}\nQuestion 3 ${questionAnswerDivider} Answer 3`);

    if (inputText === "") {
      setPreview([]);
      return;
    }

    const lines = inputText.trim().split(cardDivider).map(line => line.trim());

    const formattedPreview = lines.map(line => {
      const parts = line.split(questionAnswerDivider).map(part => part.trim());
      return { question: parts[0], answer: parts[1] };
    });

    setPreview(formattedPreview);
  }, [inputText, cardDivider, questionAnswerDivider]);

  // Set selection
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(selection.start, selection.end);
      inputRef.current.focus();
    }
  }, [selection]);

  const handleSubmitMultiple = async (e) => {
    e.preventDefault();

    if (!deckId) {
      console.error("Error: Missing deck ID");
      displayPopup(false, "Please select a deck.");
      return;
    }

    const lines = inputText.trim().split(cardDivider).map(line => line.trim());

    const cards = lines.map(line => {
      const parts = line.split(questionAnswerDivider);
      return {
        deck_id: deckId,
        question: parts[0],
        answer: parts[1]
      };
    });
    const dataToSend = {
      cards: cards
    };

    const response = await api._post('/api/cards/create/multiple', dataToSend);

    handleSubmissionErrors(response, displayPopup);
  };

  const handleBackButton = () => {
    if (inputText) {
      const shouldLeave = window.confirm("You have unsaved input. Are you sure you want to leave?");
      if (shouldLeave) {
        navigate(`/cards`, { state: { deckId: deckId } })
      }
    }
    else {
      navigate(`/cards`, { state: { deckId: deckId } })
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  handleQueryErrors(error);

  const handleInsertText = (insertion) => {
    let textarea = inputRef.current;
    let text = inputText;

    let selStart = textarea.selectionStart;
    let selEnd = textarea.selectionEnd;

    const firstHalf = text.substring(0, selStart);
    const secondHalf = text.substring(selEnd);

    let newText = firstHalf + insertion + secondHalf;

    setInputText(newText);
    setSelection({ start: selStart + insertion.length, end: selStart + insertion.length });
  };

  return (
    <div className='flex w-full h-full'>
      <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
      <div className="w-1/2 flex flex-col mx-auto">
        <div className="flex justify-between border-b-2 border-edMedGray mb-4 mt-8 pb-1">
          <h1 className="text-xl text-elDark dark:text-edWhite font-medium">New Card</h1>
          <select id="selectDeck" value={deckId} onChange={(e) => setDeckId(e.target.value)}
            className='text-black bg-elGray dark:bg-edDarker dark:text-edWhite focus:outline-none h-8 mb-1 pl-1 pr-4' >
            <option key='select-deck-key' value=''>Select a deck</option>
            {decks.map((deck) => (
              <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
            ))}
          </select>
        </div>

        <button type='button' onClick={handleBackButton} className="block rounded-sm sm:rounded-lg p-[7px] w-[20%] mb-4 text-center font-medium
              border border-edGray text-black dark:text-edWhite hover:bg-edHLT active:scale-[0.97] self-start">
          Back
        </button>

        <div className="flex flex-col gap-2 mb-4 text-black dark:text-edWhite">
          <div className="flex items-center">
            <input type="text" id="cardDividerString" value={questionAnswerDivider} className="border border-edDividerGray dark:bg-edDarker p-1 w-16 rounded"
              onChange={(e) => { setQuestionAnswerDivider(e.target.value) }} />
            <label htmlFor="cardDividerString" className="ml-2">Question/Answer Divider</label>
          </div>
          <div className="flex items-center">
            <input type="text" id="cardDividerString" value={cardDivider} className="border border-edDividerGray dark:bg-edDarker p-1 w-16 rounded"
              onChange={(e) => { setCardDivider(e.target.value) }} />
            <label htmlFor="cardDividerString" className="ml-2">Card Divider</label>
          </div>
        </div>

        <div className="flex items-start mb-1">
          <button type="button" onClick={() => { handleInsertText(questionAnswerDivider) }} className="p-0.5 mr-2 rounded bg-edBlue text-white min-w-6 min-h-8">{questionAnswerDivider}</button>
          <button type="button" onClick={() => { handleInsertText(cardDivider) }} className="p-0.5 rounded bg-edBlue text-white min-w-6 min-h-8">{cardDivider}</button>
        </div>

        <form onSubmit={handleSubmitMultiple} className='flex flex-col items-center'>
          <textarea ref={inputRef} value={inputText} onChange={(e) => setInputText(e.target.value)} required
            className="text-black dark:text-white dark:bg-edDarker w-full min-h-20 h-40 p-2 border border-edDarkGray focus:outline-none custom-scrollbar"
            placeholder={placeholder}></textarea>

          <button type='submit' className="rounded-lg border border-transparent px-4 py-2 mt-2
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>
            Submit
          </button>

          <h3 className="mt-4 text-black dark:text-edWhite">Preview</h3>
          {preview.length === 0 ? <div className="italic mt-4 text-black dark:text-edWhite">No preview avaliable.</div> : null}
          <div className="h-[50vh] overflow-y-auto">
            {preview.map((item, index) => (
              <div className="grid grid-cols-2 gap-4 font-medium px-2" key={index}>
                <div className="border border-edDividerGray text-black dark:text-white dark:bg-edDarker mt-2 px-2 py-2">
                  <p>{item.question}</p>
                </div>
                <div className="border border-edDividerGray text-black dark:text-white dark:bg-edDarker mt-2 px-2 py-2 relative">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>
      <div className={`flex flex-col items-center min-w-40 p-3 fixed top-20 right-5 rounded-[1.4rem] text-white font-semibold ${popupColor}
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

const handleSubmissionErrors = async (response, displayPopup) => {
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error creating cards: ", errorData);
    displayPopup(false, "Something went wrong.");
  } else {
    displayPopup(true, "Cards created!");
    setInputText('')
  }
}

const handleQueryErrors = (error) => {
  if (error) {
    const [status, message] = error.message.split(': ');

    return (
      <>
        <h1 className="mt-20 text-[3rem] font-bold">{status}</h1>
        <p className="mt-2 text-[1.5rem]">{message}</p>
      </>
    );
  }
}

/*
Example Input:
a1 {-} q1{|}
a2 {-} q2{|}
a3 {-} q3
*/

export default MultipleInputPage;