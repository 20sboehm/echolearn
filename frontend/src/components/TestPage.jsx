import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';
import SideBar from './SideBar'
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api';

function Test() {
  const api = useApi();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');


  const [inputquestion,setinputquestion] = useState('');
  const [response,setresponse] = useState('');

  const [deckId, setDeckId] = useState('');

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
// Fetch decks
const { data: decks, isLoading, error } = useQuery({
  queryKey: ['decks'],
  queryFn: () =>
    api._get('/api/decks').then((response) => response.json()),
    // fetch(`http://127.0.0.1:8000/api/decks`).then((response) =>
    //   response.json()
    // ),
  onSuccess: () => {
    console.log(decks)
  },
  onError: () => {
    console.log('An error occurred fetching decks')
  }
});
  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData))
   
    const response = await fetch('http://localhost:8000/api/test', {
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
    const question = inputquestion.trim();

  if (!question) {
    popupDetails('Please enter a question.', 'red');
    return;
  }

  formSubmissionMutation.mutate({ question }, {
    onSuccess: (data) => {
      // Assuming the API response includes the answer
      setresponse(data.answer);
      //navigate("/home");
      popupDetails('Received response successfully!', 'green');
    },
    onError: () => {
      popupDetails('Failed to fetch response. Check your connection.', 'red');
    }
  });
  };

    return (
      <>
        <SideBar />
        <div className="m-4">
        <form onSubmit={handleSubmit} className='flex flex-col items-start mt-10'>

        <select value={deckId} onChange={(e) => setDeckId(e.target.value)} className='mb-4 px-2 rounded-md h-10' style={{ width: '30vw' }} >
            <option key='select-deck-key' value='' className='text-gray-400'>Select a deck</option>
            {decks && decks.map((deck) => (
              <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
            ))}
          </select>
          
          <label className="text-sm" htmlFor='question' >Input question </label>
          <textarea className='mt-1 block w-3/4 p-3' value={inputquestion} id = 'question' placeholder="Example: What is torque in physics?" onChange={e =>setinputquestion(e.target.value)}></textarea>
          <label className="text-sm" htmlFor='answer'>response</label>
          {response}
          <button className="w-full rounded-lg border border-transparent px-4 py-2 font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }} type='submit'>Submit</button>
          </form>
          </div>
        {showPopup && (
          <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
            {popupMessage}
          </div>
        )}
      </>
    );
  }

export default Test