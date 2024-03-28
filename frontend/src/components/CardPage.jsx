import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect } from "react"; // Import useEffect
import axios from 'axios';

function Card() {
  const { cardId } = useParams();
  const [csrfToken, setCsrfToken] = useState(''); // State to hold CSRF token

  // Fetch the card data
  const { data: card, isLoading, error } = useQuery({
    queryKey: ["cards", cardId],
    queryFn: () =>
      fetch(`http://127.0.0.1:8000/api/cards/${cardId}`).then((response) =>
        response.json()
      ),
  });


  // const { data: card, isLoading, error } = useQuery({
  //   queryKey: ["cards", cardId],
  //   queryFn: () =>
  //     fetch(`http://127.0.0.1:8000/api/cards/${cardId}`).then((response) =>
  //       response.json()
  //     ),
  // });

  
  useEffect(() => {
    fetch('http://localhost:8000/api/csrf/', { 
      credentials: 'include'  // `withCredentials: true` in axios translates to `credentials: 'include'` in fetch
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setCsrfToken(data.csrfToken); // Assuming you have a state setter function setCsrfToken
    })
    .catch(error => {
      console.error('Error fetching CSRF token', error);
    });
  }, []); 

  const [input, setinput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formData = { input };
        console.log(formData);
        await axios.post('http://localhost:8000/api/item/', formData, {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken, 
          },
        });
    } catch (error) {
        console.error('There was an error submitting the form:', error);
    }
  };
  const [data, setData] = useState(null);
  if (card) {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          placeholder="Name"
        />
        <button type="submit">Submit</button>
        
        <div className="card">
          <p>Card ID: {card.card_id}</p>
          <p>Deck ID: {card.deck_id}</p>
          <p>Question: {card.question}</p>
          <p>Answer: {card.answer}</p>
        </div>
      </form>
    );
  }

  return null;
}

export default Card;
