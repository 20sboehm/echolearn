import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import Sidebar from "../components/SideBar";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate, useLocation } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";

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

          <button type="button" onClick={() => navigate("/quizletparser", { state: { deckId: deckId } })} className="rounded-lg border border-black hover:border-elMedGray hover:text-elDark 
              dark:border-transparent dark:hover:border-black dark:hover:text-white py-2 text-center w-1/4 mb-2
              font-semibold bg-elLightBlue text-white active:scale-[0.97] active:border-[#555]">quizlet parser</button>

          <MarkdownEditor requestType="post" submitButtonText="Create Card" questionText={questionText} setQuestionText={setQuestionText}
            answerText={answerText} setAnswerText={setAnswerText} deckId={deckId} />

          <button type="button" onClick={() => { navigate(`/`); }} className="block rounded-sm sm:rounded-lg p-[7px] w-1/3 text-center font-medium
              border border-edGray text-black dark:text-edWhite hover:bg-edHLT active:scale-[0.97] mt-2 self-center"> Back</button>
        </div>
      </div>
    </>
  )
}

export default CreateCardPage;