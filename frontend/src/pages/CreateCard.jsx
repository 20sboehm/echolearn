import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import Sidebar from "../components/SideBar";
import { ChevronIcon } from "../components/Icons";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";

function CreateCard() {
  const api = useApi();

  const [deckId, setDeckId] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [answerContent, setAnswerContent] = useState("");

  const [popupActive, setPopupActive] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const popupTimerRef = useRef(null); // Ref to hold the popup timer

  const displayPopup = (isSuccess) => {
    // Clear the old timer if it is still active
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    setPopupActive(true);

    if (isSuccess) {
      setPopupText("Card created");
      setPopupColor("bg-eGreen");
    } else {
      setPopupText("Something went wrong");
      setPopupColor("bg-eRed");
    }

    popupTimerRef.current = setTimeout(() => {
      setPopupActive(false);
    }, 1500)
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cardData = {
      deck_id: deckId,
      question: questionContent,
      answer: answerContent,
    }

    const response = await api._post('/api/cards', cardData);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating card: ", errorData);
      displayPopup(false);
    } else {
      console.log("Card created successfully");
      displayPopup(true);
    }
  }

  return (
    <>
      <Sidebar />
      <div className="w-1/2 flex flex-col">
        <div className="flex justify-between border-b border-eMedGray mb-4 mt-8 pb-1">
          <h1 className="text-2xl font-medium">New Card</h1>
          <select id="selectDeck" value={deckId} onChange={(e) => setDeckId(e.target.value)} className='bg-eDarker text-eWhite focus:outline-none' >
            <option key='select-deck-key' value=''>Select a deck</option>
            {decks.map((deck) => (
              <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-2 flex flex-col">
            <TextBox label="Front" content={questionContent} inputHandler={(e) => { setQuestionContent(e.target.value) }} />
          </div>
          <TextBox label="Back" content={answerContent} inputHandler={(e) => { setAnswerContent(e.target.value) }} />

          <DividerLine />

          <div className="mb-2 flex flex-col">
            <TextBoxPreview label="Question Preview" content={questionContent} />
          </div>
          <TextBoxPreview label="Answer Preview" content={answerContent} />

          <div className="flex justify-center mt-8">
            <SubmitButton>Create Card</SubmitButton>
          </div>
        </form>
      </div>
      <div className={`width-20 p-3 absolute top-20 right-5 rounded-[1.4rem] text-white ${popupColor}
          transition-opacity duration-200 ${popupActive ? 'opacity-100' : 'opacity-0'}`}>{popupText}</div>
    </>
  )
}

function TextBox({ label, content, inputHandler }) {
  const [textBoxOpen, setTextBoxOpen] = useState(true);

  return (
    <>
      <button type="button" onClick={() => { setTextBoxOpen(!textBoxOpen) }} className="flex items-center">
        <ChevronIcon isOpen={textBoxOpen} color="#ccc" />
        <p>{label}</p>
      </button>
      {textBoxOpen && (
        <textarea value={content} onInput={inputHandler} className="bg-eDarker w-full min-h-20 h-[15vh] p-2 border border-eDarkGray focus:outline-none custom-scrollbar"></textarea>
      )}
    </>
  );
}

function DividerLine() {
  return (
    <div className="flex flex-row justify-center items-center my-3 w-full" >
      <span className="flex-grow border-b border-eGray h-1"></span>
      <p className="self-center text-eGray mx-2">Preview</p>
      <span className="flex-grow border-b border-eGray h-1"></span>
    </div >
  )
}

function TextBoxPreview({ label, content }) {
  const [textBoxPreviewOpen, setTextBoxPreviewOpen] = useState(true);

  return (
    <>
      <button type="button" onClick={() => { setTextBoxPreviewOpen(!textBoxPreviewOpen) }} className="flex items-center">
        <ChevronIcon isOpen={textBoxPreviewOpen} color="#999" />
        <p className="text-eGray">{label}</p>
      </button>
      {textBoxPreviewOpen && (
        <MarkdownPreviewer content={content} className="border border-eDarkGray bg-eDarker p-2 min-h-[10vh]" />
      )}
    </>
  )
}

function SubmitButton({ children, onSubmit }) {
  return (
    <button onSubmit={onSubmit} className="block rounded-sm sm:rounded-lg p-2 w-1/3 text-center font-medium
                  bg-eBlue text-eWhite hover:bg-eLightBlue active:scale-[0.97]"
    >
      {children}
    </button>
  )
}

export default CreateCard;