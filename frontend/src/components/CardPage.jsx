import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

function Card() {
  const { cardId } = useParams();

  const { data: card, isLoading, error } = useQuery({
    queryKey: ["cards", cardId],
    queryFn: () =>
      fetch(`http://127.0.0.1:8000/api/cards/${cardId}`).then((response) =>
        response.json()
      ),
  })

  if (card) {
    return (
      <div className="card">
        <p>Card ID: {card.card_id}</p>
        <p>Deck ID: {card.deck_id}</p>
        <p>Question: {card.question}</p>
        <p>Answer: {card.answer}</p>
      </div>
    )
  }
}

export default Card;