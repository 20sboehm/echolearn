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

  const { deckId } = useParams();
  
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
          <button className="againButton" onClick={handleNextCard}>Again <br /> 10m</button>
          <button className="hardButton" onClick={handleNextCard}>Hard <br /> 1h</button>
          <button className="goodButton" onClick={handleNextCard}>Good <br /> 6h</button>
          <button className="easyButton" onClick={handleNextCard}>Easy <br /> 1d</button>
        </div>
      )}
    </div>
  );
}

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
  const [cardIndex, setcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finish, setFinish] = useState(false);

  const handleNextCard = () => {
    setcardIndex(cardIndex + 1);
    setShowAnswer(false)
    if (cardIndex === dummyCards.length -1){
      setFinish(true)
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="reviewContainer">
        <h2 className="deckName">Database</h2>
        {!finish && <ReviewCard card={dummyCards[cardIndex]} showAnswer={showAnswer} setShowAnswer={setShowAnswer} handleNextCard={handleNextCard} />}
        {finish && <FinishView />}
      </div>
    </div>
  );
}

export default Review