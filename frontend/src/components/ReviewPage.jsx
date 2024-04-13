import { useState, useRef } from "react";
import { useMutation, useQuery } from 'react-query';
import { Link, useParams } from "react-router-dom";
import "./ReviewPage.css";
import Sidebar from "./SideBar";

function FinishView() {
  return (
    <div className="finishView"> 
      <img className="partyPopper" src="../party-popper-flip.png" alt="Party Popper" />
      <div className="finishViewMiddle">
        <h3 className="finishText">You have studied all the cards in this deck</h3>
        <Link to="/home">
          <button className="border rounded-md px-2 py-1">Back to deck</button>
        </Link>
      </div>
      <img className="partyPopper" src="../party-popper.png" alt="Party Popper" />
    </div>
  )
}

function Review() {
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finish, setFinish] = useState(false);
  const { deckId } = useParams();
  
  // Fetch reviews info
  const { data: reviews, isLoading, error } = useQuery({
    queryFn: () =>
      fetch(`http://localhost:8000/api/reviews/${deckId}`).then((response) =>
        response.json()
      ),
  });

  const handleNextCard = (interval) => {
    // Calculate the new next_review time based on the interval
    const now = new Date();
    const nextReviewTime = new Date(now.getTime() + interval);
  
    // Make a POST request to update the next_review of the current card
    fetch(`http://localhost:8000/api/reviews/${reviews.cards[cardIndex].card_id}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time_value: interval }),
    })
      .then(response => {
        if (response.ok) {
          if (cardIndex < reviews.cards.length - 1) {
            setCardIndex(cardIndex + 1);
            setShowAnswer(false);
          } else {
            setFinish(true);
          }
        } else {
          console.error('Failed to update next_review');
        }
      })
      .catch(error => {
        console.error('Error updating next_review:', error);
      });
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Check if reviews data is available
  if (!reviews || !reviews.cards || reviews.cards.length === 0) {
    return <div>No cards found for review.</div>;
  }

  return (
    <div>
      <Sidebar />
      <div className="border rounded-lg p-8 mt-[10vh] h-[60vh] w-[40vw] flex flex-col">
        <h2 className="mb-40 text-center text-[2em]">{reviews.deck_name}</h2>
        {!finish && (
          <ReviewCard
            card={reviews.cards[cardIndex]}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            handleNextCard={handleNextCard}
          />
        )}
        {finish && <FinishView />}
      </div>
    </div>
  );
}


function ReviewCard({ card, showAnswer, setShowAnswer, handleNextCard }) {

  const changeShowAnswer = () => {
    setShowAnswer(true);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`reviewCard ${showAnswer ? "show" : "hide"}`}>
          <p className="question h-20">{card.question}</p>
          <p className="answer h-20">{card.answer}</p>
      </div>
      {!showAnswer && <button className="mt-8 border rounded-md w-[50%]" onClick={changeShowAnswer}>Reveal Answer</button>}
      {showAnswer && (
        <div className="flex justify-center mt-8">
          {/* The math is converting it into milliseconds */}
          <button className="againButton" onClick={() => handleNextCard(1000 * 60 * 10)}>Again <br /> 10m</button>
          <button className="hardButton" onClick={() => handleNextCard(1000 * 60 * 60)}>Hard <br /> 1h</button>
          <button className="goodButton" onClick={() => handleNextCard(1000 * 60 * 60 * 6)}>Good <br /> 6h</button>
          <button className="easyButton" onClick={() => handleNextCard(1000 * 60 * 60 * 24)}>Easy <br /> 1d</button>
        </div>
      )}
    </div>
  );
}

export default Review