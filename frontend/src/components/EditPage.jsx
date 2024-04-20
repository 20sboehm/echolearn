import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import { useApi } from "../api";

function EditPage() {
  const api = useApi();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const { cardId } = useParams();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const navigate = useNavigate();

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

  // Fetch the card data
  const { data: card, isLoading, error } = useQuery({
    queryKey: ["cards", cardId],
    queryFn: () =>
      api._get(`/api/cards/${cardId}`).then((response) => response.json()),
    // fetch(`http://127.0.0.1:8000/api/cards/${cardId}`).then((response) =>
    //   response.json()
    // ),
  });

  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData))

    const response = await api._patch(
      `/api/cards/${formData.card_id}`,
      { question: formData.question, answer: formData.answer }
    );
    // const response = await fetch(`http://localhost:8000/api/cards/${formData.card_id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({
    //     question: formData.question,
    //     answer: formData.answer
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status_code}`);
    }

    // Navigate back to deck page
    navigate(`/decks/${card.deck_id}`);
  });

  useEffect(() => {
    // Update state only when card data is available
    if (card) {
      setQuestion(card.question);
      setAnswer(card.answer);
    }
  }, [card]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Getting data object with only the fields that user have changed
    const updatedData = { card_id: cardId };
    if (question !== card.question) {
      updatedData.question = question;
    }
    if (answer !== card.answer) {
      updatedData.answer = answer;
    }
    // should only send the data if user changed a least one
    if (Object.keys(updatedData).length > 1) {
      formSubmissionMutation.mutate(updatedData);
      popupDetails(`Card data has changed.`, 'green');
    } else {
      popupDetails(`No changes detected.`, 'blue');
    }
  };

  return (
    <>
      <Sidebar />
      <form onSubmit={handleSubmit} className='flex flex-col items-center mt-10'>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)}
          placeholder='Question' className='mb-4 p-2 rounded-md h-40' style={{ width: '30vw' }} />
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
          placeholder='Answer' className='mb-4 p-2 rounded-md h-40' style={{ width: '30vw' }} />
        <button type='submit' className="rounded-lg border border-transparent px-4 py-2 
        font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
        active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>
          Submit
        </button>
      </form>
      {showPopup && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
          {popupMessage}
        </div>
      )}
    </>
  );
}

export default EditPage