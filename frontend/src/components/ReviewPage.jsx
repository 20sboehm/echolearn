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
      {!showAnswer && <button onClick={changeShowAnswer}>Reveal Answer</button>}
      {showAnswer && (
        <div className="answerChoice">
          <button onClick={handleNextCard}>Again</button>
          <button onClick={handleNextCard}>Hard</button>
          <button onClick={handleNextCard}>Good</button>
          <button onClick={handleNextCard}>Easy</button>
        </div>
      )}
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
        <h2 className="deckName">Database</h2>
        <ReviewCard card={dummyCards[cardIndex]} showAnswer={showAnswer} setShowAnswer={setShowAnswer} handleNextCard={handleNextCard} />
      </div>
    </div>
  );
}

export default Review