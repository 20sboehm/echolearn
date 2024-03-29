import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";

function Card() {
  const { cardId } = useParams();
  const [ csrfToken, setCsrfToken ] = useState('');

   // Fetch the card data
   const { data: card, isLoading, error } = useQuery({
    queryKey: ["cards", cardId],
    queryFn: () =>
      fetch(`http://127.0.0.1:8000/api/cards/${cardId}`).then((response) =>
        response.json()
      ),
  });

  // useEffect(() => {
  //   fetch('http://localhost:8000/api/csrf/', { credentials: 'include' })
  //     .then(response => response.json())
  //     .then(data => setCsrfToken(data.csrfToken))
      
  // }, []);

  const [input, setInput] = useState('');

  const formSubmissionMutation = useMutation(async (formData) => {
    const response = await fetch('http://localhost:8000/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmissionMutation.mutate({ input });
  };


  if (card) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name"
          />
          <button type="submit">Submit</button>
        </form>
        
        <div className="card">
          <p>Card ID: {card.card_id}</p>
          <p>Deck ID: {card.deck_id}</p>
          <p>Question: {card.question}</p>
          <p>Answer: {card.answer}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default Card;
