import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import Sidebar from "../components/SideBar";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate, useLocation } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";
import QuestionMarkHoverHelp from "../components/QuestionMarkHoverHelp";
import './Buttons.css';

const markdownEditorHelpList = [
  "This editor uses markdown for rendering rich text.",
  "The editor buttons will insert various markdown characters. Hover over them to see what they do.",
  "To insert an image you've uploaded, click the cloud icon with a magnifying glass in the center."
]

function CreateCardPage() {
  const api = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const [deckId, setDeckId] = useState(location.state?.deckId);

  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");

  const [sidebarWidth, setSidebarWidth] = useState(250);

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
    <>
      <div className='flex w-full h-full'>
        <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="w-full flex flex-col mx-[15%]">
          <div className="flex justify-between items-end border-b border-elDividerGray dark:border-edDividerGray mb-4 mt-8 pb-2">
            <div className="flex items-center">
              <h1 className="text-[2rem] text-elDark dark:text-edWhite font-medium mr-2">New Card</h1>
              <QuestionMarkHoverHelp title="Markdown Editor" helpTextList={markdownEditorHelpList} heightInRem={20} />
            </div>
            <select id="selectDeck" value={deckId} onChange={(e) => setDeckId(e.target.value)}
              className='text-black bg-elGray dark:bg-edDarker dark:text-edWhite focus:outline-none h-8 mb-1 pl-1 pr-4' >
              <option key='select-deck-key' value=''>Select a deck</option>
              {decks.map((deck) => (
                <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => navigate("/quizletparser", { state: { deckId: deckId } })} className="button-common button-blue py-2 text-center mb-4 font-semibold">Quizlet Parser</button>
            <button type="button" onClick={() => navigate("/ankiparser", { state: { deckId: deckId } })} className="button-common button-blue py-2 text-center mb-4 font-semibold">Anki Parser</button>
            <button type="button" onClick={() => navigate("/aigeneratecards", { state: { deckId: deckId } })} className="button-common button-blue py-2 text-center mb-4 font-semibold">Create with AI</button>
            <button type="button" onClick={() => navigate("/multipleinput", { state: { deckId: deckId } })} className="button-common button-blue py-2 text-center mb-4 font-semibold">Multiple Input</button>
          </div>
          <MarkdownEditor requestType="post" submitButtonText="Create Card" questionText={questionText} setQuestionText={setQuestionText}
            answerText={answerText} setAnswerText={setAnswerText} deckId={deckId} />

          <button type="button" onClick={() => { navigate(-1); }} className="block rounded-sm sm:rounded-lg p-[7px] w-1/3 text-center font-medium
              border border-edGray text-black dark:text-edWhite hover:bg-elHLT dark:hover:bg-edHLT active:scale-[0.97] mt-2 self-center"> Back</button>
        </div>
      </div>
    </>
  )
}

export default CreateCardPage;