import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";

function Card() {
  const { cardId } = useParams();

  const [deck_id, setDeckId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // Fetch the card data
  const { data: card, isLoading, error } = useQuery({
    queryKey: ["cards", cardId],
    queryFn: () =>
      fetch(`http://127.0.0.1:8000/api/cards/${cardId}`).then((response) =>
        response.json()
      ),
  });

  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData))
    const response = await fetch('http://localhost:8000/api/cards', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${reponse.status_code}`);
    }

    return response.json();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmissionMutation.mutate({ deck_id, question, answer });
  };

  if (card) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={deck_id}
            onChange={(e) => setDeckId(e.target.value)}
            placeholder="deck id"
          />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="question"
          />
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="answer"
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
