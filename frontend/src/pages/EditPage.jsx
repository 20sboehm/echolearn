import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { useApi } from "../hooks";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { ChevronIcon } from "../components/Icons";

function EditPage() {
  const api = useApi();
  const navigate = useNavigate();
  const { cardId } = useParams();

  const [questionContent, setQuestionContent] = useState("");
  const [answerContent, setAnswerContent] = useState("");

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
      setPopupText("Card updated");
      setPopupColor("bg-eGreen");
    } else {
      setPopupText("Something went wrong");
      setPopupColor("bg-eRed");
    }

    popupTimerRef.current = setTimeout(() => {
      setPopupActive(false);
    }, 1500)
  }

  // Fetch the card data
  const { data: card, isLoading, error } = useQuery({
    queryKey: ["cards", cardId],
    queryFn: async () => {
      let response = await api._get(`/api/cards/${cardId}`);

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.detail || 'An error occurred';
        throw new Error(`${response.status}: ${message}`);
      }

      return response.json();
    },
    retry: false
  });

  useEffect(() => {
    // Update state when card data is available
    if (card) {
      setQuestionContent(card.question);
      setAnswerContent(card.answer);
    }
  }, [card]);

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
      question: questionContent,
      answer: answerContent,
    }

    const response = await api._patch(`/api/cards/${cardId}`, cardData);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating card: ", errorData);
      displayPopup(false);
    } else {
      console.log("Card updated successfully");
      displayPopup(true);

      // Navigate back to deck page after short delay
      // setTimeout(() => {
      //   navigate(`/decks/${card.deck_id}`);
      // }, 300);
    }
  }

  return (
    <>
      <div className="flex w-full h-full">
        <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="w-1/2 flex flex-col m-auto">
          <div className="flex justify-between border-b border-eMedGray mb-4 mt-8 pb-1">
            <h1 className="text-2xl font-medium">Edit Card</h1>
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

            <div className="flex flex-col items-center mt-8">
              <SubmitButton>Edit Card</SubmitButton>
              <button onClick={() => { navigate(`/decks/${card.deck_id}`); }} className="block rounded-sm sm:rounded-lg p-[7px] w-1/3 text-center font-medium
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

export default EditPage;