import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';
import UserHeader from './Header'

function CreateCard() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [deckId, setDeckId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  function popupDetails(popupMessage, popupColor) {
    setShowPopup(true);
    setPopupMessage(popupMessage)
    setPopupColor(popupColor)
    setPopupOpacity('opacity-100'); // Ensure it's fully visible initially
    setTimeout(() => {
      setPopupOpacity('opacity-0'); // Start fading out
      setTimeout(() => setShowPopup(false), 1000); // Give it 1 second to fade
    }, 1000); // Stay fully visible for 1 second
    setQuestion('');
    setAnswer('');
  }

  // Fetch decks
  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: () =>
      fetch(`http://127.0.0.1:8000/api/decks`).then((response) =>
        response.json()
      ),
    onSuccess: () => {
      console.log(decks)
    },
    onError: () => {
      console.log('An error occurred fetching decks')
    }
  });

  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData))
    const response = await fetch('http://localhost:8000/api/cards', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${reponse.status_code}`);
    }

    return response.json();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmissionMutation.mutate({ deck_id: deckId, question, answer }, {
      onSuccess: () => {
        popupDetails('Card created successfully!', 'green')
      },
      onError: () => {
        popupDetails('Something went wrong...', 'red')
      }
    });
  };

  if (decks) {
    return (
      <>
        <UserHeader />
        <h1 className='text-4xl mb-10 mt-10 font-medium'>New Card</h1>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          <select value={deckId} onChange={(e) => setDeckId(e.target.value)} className='mb-4 p-2 rounded-md h-10' style={{ width: '30vw' }} >
            <option key='select-deck-key' value='' className='text-gray-400'>Select a deck</option>
            {decks.map((deck) => (
              <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
            ))}
          </select>
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)}
            placeholder='Question' className='mb-4 p-2 rounded-md h-40' style={{ width: '30vw' }} />
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} 
            placeholder='Answer' className='mb-4 p-2 rounded-md h-40' style={{ width: '30vw' }} />
          <button type='submit'>Submit</button>
        </form>
        {showPopup && (
          <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
            {popupMessage}
          </div>
        )}
      </>
    );
  }
}

export default CreateCard