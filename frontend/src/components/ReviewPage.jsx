import { useState, useRef } from "react";
import { useMutation, useQuery } from 'react-query';
import { Link, useParams } from "react-router-dom";
import "./ReviewPage.css";
import Sidebar from "./SideBar";
import Header from "./Header";

const dummyCards = [
  {
    "question": "Question 1",
    "answer": "Answer 1"
  },
  {
    "question": "Question 2",
    "answer": "Answer 2"
  },
  {
    "question": "Question 3",
    "answer": "Answer 3"
  },
]
function FinishView() {
  return (
    <div className="finishView"> 
      <img className="partyPopper" src="../party-popper-flip.png" alt="Party Popper" />
      <div className="finishViewMiddle">
        <h3 className="finishText">You have study all the cards</h3>
        <Link to="/home">
          <button>Back to deck</button>
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

  return (
    <div>
      <Header />
      {/* <Sidebar /> */}
      <div className="reviewContainer">
        <h2 className="deckName">{reviews.deck_name}</h2>
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
    <div className="card">
      <div className={`reviewCard ${showAnswer ? "show" : "hide"}`}>
          <p className="question">{card.question}</p>
          <p className="answer">{card.answer}</p>
      </div>
      {!showAnswer && <button className="answerChoice" onClick={changeShowAnswer}>Reveal Answer</button>}
      {showAnswer && (
        <div className="answerChoice">
          {/* The math is converting it into milliseconds */}
          <button className="againButton" onClick={() => handleNextCard(10 * 60 * 1000)}>Again <br /> 10m</button>
          <button className="hardButton" onClick={() => handleNextCard(1 * 60 * 60 * 1000)}>Hard <br /> 1h</button>
          <button className="goodButton" onClick={() => handleNextCard(6 * 60 * 60 * 1000)}>Good <br /> 6h</button>
          <button className="easyButton" onClick={() => handleNextCard(24 * 60 * 60 * 1000)}>Easy <br /> 1d</button>
        </div>
      )}
    </div>
  );
}

export default Review