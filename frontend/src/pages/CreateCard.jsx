import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import Sidebar from "../components/Sidebar";
import { ChevronIcon } from "../components/Icons";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "../components/Icons";
import { useNavigate } from "react-router-dom";

function CreateCard() {
  const api = useApi();
  const navigate = useNavigate();

  const [deckId, setDeckId] = useState("");

  const questionRef = useRef(null);
  const answerRef = useRef(null);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");

  const [questionSelection, setQuestionSelection] = useState({ start: 0, end: 0 }); // Cursor position
  const [answerSelection, setAnswerSelection] = useState({ start: 0, end: 0 });

  const [popupActive, setPopupActive] = useState(false);
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

  const handleTextEditingButton = (forQuestionBox, type) => {
    let textarea = null;
    if (forQuestionBox) {
      textarea = questionRef.current;
    } else {
      textarea = answerRef.current;
    }

    let text = null;
    if (forQuestionBox) {
      text = questionText;
    } else {
      text = answerText;
    }

    let insertionChar = "";
    let cursorAdjustment = 0;
    switch (type) {
      case "bold":
        insertionChar = "**";
        cursorAdjustment = 2;
        break;
      case "italic":
        insertionChar = "*";
        cursorAdjustment = 1;
        break;
      case "underline":
        insertionChar = "__";
        cursorAdjustment = 2;
        break;
    }

    let selStart = textarea.selectionStart;
    let selEnd = textarea.selectionEnd;

    const firstHalf = text.substring(0, selStart);
    const selection = text.substring(selStart, selEnd)
    const secondHalf = text.substring(selEnd);

    let newText = firstHalf + insertionChar + selection + insertionChar + secondHalf;

    if (forQuestionBox) {
      setQuestionText(newText);
      setQuestionSelection({ start: selStart + cursorAdjustment, end: selEnd + cursorAdjustment });
    } else {
      setAnswerText(newText);
      setAnswerSelection({ start: selStart + cursorAdjustment, end: selEnd + cursorAdjustment });
    }
  }

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.setSelectionRange(questionSelection.start, questionSelection.end);
      questionRef.current.focus();
    }
  }, [questionSelection]);

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.setSelectionRange(answerSelection.start, answerSelection.end);
      answerRef.current.focus();
    }
  }, [answerSelection]);

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
      question: questionText,
      answer: answerText,
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
      <div className='flex w-full h-full'>
        <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="w-1/2 flex flex-col mx-auto">
          <div className="flex justify-between border-b border-eMedGray mb-4 mt-8 pb-1">
            <h1 className="text-xl font-medium">New Card</h1>
            <select id="selectDeck" value={deckId} onChange={(e) => setDeckId(e.target.value)} className='bg-eDarker text-eWhite focus:outline-none' >
              <option key='select-deck-key' value=''>Select a deck</option>
              {decks.map((deck) => (
                <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-2 flex flex-col">
              <TextBox label="Front" reference={questionRef} content={questionText} inputHandler={(e) => { setQuestionText(e.target.value) }}
                handleTextEditingButton={handleTextEditingButton} forQuestionBox={true} />
            </div>
            <TextBox label="Back" reference={answerRef} content={answerText} inputHandler={(e) => { setAnswerText(e.target.value) }}
              handleTextEditingButton={handleTextEditingButton} forQuestionBox={false} />

            <DividerLine />

            <div className="mb-2 flex flex-col">
              <TextBoxPreview label="Question Preview" content={questionText} />
            </div>
            <TextBoxPreview label="Answer Preview" content={answerText} />

            <div className="flex flex-col items-center mt-8">
              <SubmitButton>Create Card</SubmitButton>
              <button type="button" onClick={() => { navigate(`/`); }} className="block rounded-sm sm:rounded-lg p-[7px] w-1/3 text-center font-medium
              border border-eGray text-eWhite hover:bg-eHLT active:scale-[0.97] mt-2"> Back</button>
            </div>
          </form>
        </div>
        <div className={`width-20 p-3 absolute top-20 right-5 rounded-[1.4rem] text-white ${popupColor}
          transition-opacity duration-200 ${popupActive ? 'opacity-100' : 'opacity-0'}`}>{popupText}</div>
      </div>
    </>
  )
}

function TextBox({ label, reference, content, inputHandler, handleTextEditingButton, forQuestionBox }) {
  const [textBoxOpen, setTextBoxOpen] = useState(true);

  return (
    <>
      <button type="button" onClick={() => { setTextBoxOpen(!textBoxOpen) }} className="flex items-center">
        <ChevronIcon isOpen={textBoxOpen} color="#ccc" />
        <p>{label}</p>
      </button>
      <div className="bg-eDarker w-full h-8 border-x border-t border-eDarkGray flex items-center pl-2">
        <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="bold" forQuestionBox={forQuestionBox} />
        <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="italic" forQuestionBox={forQuestionBox} />
        <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="underline" forQuestionBox={forQuestionBox} />
      </div>
      {textBoxOpen && (
        <textarea value={content} ref={reference} onInput={inputHandler} className="bg-eDarker w-full min-h-20 h-[10vh] p-2 border border-eDarkGray focus:outline-none custom-scrollbar"></textarea>
      )}
    </>
  );
}

function TextEditingIcon({ handleTextEditingButton, type, forQuestionBox }) {
  switch (type) {
    case "bold":
      return <button type='button' onClick={() => { handleTextEditingButton(forQuestionBox, type); }} className='mr-2'><BoldIcon /></button>;
    case "italic":
      return <button type='button' onClick={() => { handleTextEditingButton(forQuestionBox, type); }} className='mr-2'><ItalicIcon /></button>;
    case "underline":
      return <button type='button' onClick={() => { handleTextEditingButton(forQuestionBox, type); }} className='mr-2'><UnderlineIcon /></button>;
    default:
      return null;
  }
}

function DividerLine() {
  return (
    <div className="flex flex-row justify-center items-center my-1 w-full" >
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