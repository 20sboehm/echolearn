import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/SideBar";
import { useApi } from "../hooks";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownEditor from "../components/MarkdownEditor";

function EditCardPage() {
  const api = useApi();
  const navigate = useNavigate();
  const { cardId } = useParams();

  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");

  const [sidebarWidth, setSidebarWidth] = useState(250);

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
      setQuestionText(card.question);
      setAnswerText(card.answer);
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

  return (
    <>
      <div className="flex w-full h-full">
        <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="w-full flex flex-col mx-[15%]">
          <div className="flex justify-between border-b border-elDividerGray dark:border-edDividerGray mb-4 mt-8 pb-1">
            <h1 className="text-[2rem] text-elDark dark:text-edWhite font-medium">Edit Card</h1>
          </div>

          <MarkdownEditor requestType="patch" submitButtonText="Edit Card"
            questionText={questionText} setQuestionText={setQuestionText} answerText={answerText} setAnswerText={setAnswerText} cardId={cardId} />

          <button type="button" onClick={() => { navigate(`/decks/${card.deck_id}`); }} className="block rounded-sm sm:rounded-lg p-[7px] w-1/3 text-center font-medium
              border border-edGray text-black dark:text-edWhite hover:bg-edHLT active:scale-[0.97] mt-2 self-center"> Back</button>
        </div>
      </div>
    </>
  )
}

export default EditCardPage;