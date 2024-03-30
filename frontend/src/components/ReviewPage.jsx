import { useState, useRef } from "react";
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

function ReviewCard({ card, showAnswer, setShowAnswer }) {

  const changeShowAnswer = () => {
    setShowAnswer(true);
  };

  return (
    <div className="card">
      <h3>{card.question}</h3>
      {/* Right now the button and answer test is tie together */}
      {/* TODO: split them up */}
      {!showAnswer && (
        <button onClick={changeShowAnswer}>Reveal Answer</button>
      )}
      {showAnswer && <p>{card.answer}</p>}
    </div>
  );
}

function Review() {
  const [cardIndex, setcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNextCard = () => {
    setcardIndex(cardIndex + 1);
    setShowAnswer(false)
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="reviewContainer">
        <ReviewCard card={dummyCards[cardIndex]} showAnswer={showAnswer} setShowAnswer={setShowAnswer} />
        {cardIndex < dummyCards.length - 1 && (
          <button onClick={handleNextCard}>Next</button>
        )}
      </div>
    </div>
  );
}

export default Review