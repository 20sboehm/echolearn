import { useState, useEffect } from "react";
import { useQuery } from 'react-query';
import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useApi } from "../hooks";
import ReactPlayer from 'react-player';
import { BlockMath } from 'react-katex'; // we might need this here
import sanitizeHtml from 'sanitize-html'; // we might need this here
import katex from 'katex';
import partyPopperImg from '../assets/party-popper.png';
import partyPopperFlipImg from '../assets/party-popper-flip.png';
import set from '../assets/reviewSwitch2.png';
import card from '../assets/reviewSwitch.png';
import "./ReviewPage.css";
import LoadingSpinner from "../components/LoadingSpinner";

// Two layers in order to maintain border rounding with active scrollbar
const cardOuterCSS = "bg-white rounded-md overflow-hidden"
const cardInnerCSS = "h-[30vh] px-4 py-2 text-black flex flex-col items-center overflow-x-hidden overflow-y-auto text-[1.4em] py-4"

function ReviewPage() {
  const api = useApi();

  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finish, setFinish] = useState(false);
  const [changeAnimation, setAnimation] = useState(false);
  const [currImage, setCurrImage] = useState(set);
  const { deckId } = useParams();

  const [flip, setFlip] = useState(false);

  const switchAnimation = () => {
    setCurrImage((prev) =>
      prev === set ? card : set
    );
    setAnimation(!changeAnimation);
    setShowAnswer(false);
    setFlip(false);
  }

  // Fetch reviews info
  const { data: reviews, isLoading, error } = useQuery(
    ['reviews', deckId],
    async () => {
      let response = await api._get(`/api/reviews/${deckId}`);

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.detail || 'An error occurred';
        throw new Error(`${response.status}: ${message}`);
      }

      return response.json()
    },
    {
      retry: false
    }
  );

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    const [status, message] = error.message.split(': ');

    return (
      <>
        <h1 className="mt-20 text-[3rem] font-bold">{status}</h1>
        <p className="mt-2 text-[1.5rem]">{message}</p>
      </>
    );
  }

  const updateReviewedCard = (newBucket, nextReviewTime, card, setFlip, wasCorrect) => {
    setFlip(false);

    const today = new Date();
    const formatTime = (time) => {
      return time.toISOString();
    }
    const updatedCardData = {
      bucket: newBucket,
      next_review: formatTime(nextReviewTime),
      last_reviewed: formatTime(today)
    };

    if (wasCorrect) {
      updatedCardData.correct_count = (card.correct_count || 0) + 1;
    } else {
      updatedCardData.incorrect_count = (card.incorrect_count || 0) + 1;
    }
    api._patch(
      `/api/cards/${card.card_id}`, updatedCardData)
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

  // Check if reviews data is available
  if (!reviews || !reviews.cards || reviews.cards.length === 0) {
    return <div>No cards found for review.</div>;
  }

  return (
    <>
      <Sidebar />
      <div className="rounded-lg mt-[2%] h-[60vh] w-[40vw] flex flex-col min-w-[16rem]">
        <div className="flex items-center border-b pb-[1rem]">
          <h2 className="text-[2em] absolute left-1/2 transform -translate-x-1/2">{reviews.deck_name}</h2>
          <button className="border w-[12%] ml-auto" onClick={switchAnimation}>
            <img src={currImage}></img>
          </button>
        </div>
        {!finish && (
          <ReviewCard
            card={reviews.cards[cardIndex]}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            updateReviewedCard={updateReviewedCard}
            changeAnimation={changeAnimation}
            flip={flip}
            setFlip={setFlip}
          />
        )}
        {finish && <FinishView deckId={deckId} />}
      </div>
    </>
  );
}

function QuestionCard({ card }) {
  if (card) {
    return (
      <div className={`mt-8 ${cardOuterCSS}`}>
        <div className={`${cardInnerCSS}`} style={{ scrollbarGutter: 'stable both-edges' }}>
          <div dangerouslySetInnerHTML={{ __html: card.question }}></div>
          {ReactPlayer.canPlay(card.questionvideolink) && (
            <ReactPlayer
              url={card.questionvideolink}
              controls={true}
              style={{ maxWidth: '80%', maxHeight: '80%' }} // ReactPlayer is likely incompatible with Tailwind
            />
          )}
          {card.questionimagelink && <img src={card.questionimagelink} className="max-w-[80%] max-h-[80%]" />}
          {card.questionlatex && <KatexOutput latex={card.questionlatex} />}
        </div>
      </div>
    )
  }
}

function AnswerCard({ card, showAnswer }) {
  return (
    <div className={`${cardOuterCSS} transition-all duration-300 ${showAnswer ? "mt-8 opacity-100" : "mt-12 opacity-0"}`}>
      <div className={`${cardInnerCSS}`} style={{ scrollbarGutter: 'stable both-edges' }}>
        {showAnswer && <div dangerouslySetInnerHTML={{ __html: card.answer }} />}
        {ReactPlayer.canPlay(card.answervideolink) && showAnswer && (
          <ReactPlayer
            url={card.answervideolink}
            controls={true}
            style={{ maxWidth: '80%', maxHeight: '80%' }}
          />
        )}
        {card.answerimagelink && showAnswer && <img src={card.answerimagelink} className="max-w-[80%] max-h-[80%]" />}
        {card.answerlatex && showAnswer && <KatexOutput latex={card.answerlatex} />}
      </div>
    </div>
  )
}

function FlashCard({ card, setShowAnswer, flip, setFlip }) {

  const toggleFlip = () => setFlip(!flip);

  useEffect(() => {
    setShowAnswer(flip);
  }, [flip, setShowAnswer]);

  return (
    <div className={`flashCard ${flip ? 'flip' : ''}`}>
      <div className={`mt-8 ${cardOuterCSS}`} onClick={toggleFlip}>
        <div className="h-[60vh] px-4 py-2 text-black flex flex-col justify-center items-center overflow-x-hidden overflow-y-auto text-[2em]" style={{ scrollbarGutter: 'stable both-edges' }}>
          {!flip ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: card.question }}></div>
              {ReactPlayer.canPlay(card.questionvideolink) && (
                <ReactPlayer
                  url={card.questionvideolink}
                  controls={true}
                  style={{ maxWidth: '80%', maxHeight: '80%' }} // ReactPlayer is likely incompatible with Tailwind
                />
              )}
              {card.questionimagelink && <img src={card.questionimagelink} className="max-w-[80%] max-h-[80%]" />}
              {card.questionlatex && <KatexOutput latex={card.questionlatex} />}
            </>
          ) : (
            <div className="flashCardBack">
              <div dangerouslySetInnerHTML={{ __html: card.answer }}></div>
              {ReactPlayer.canPlay(card.answervideolink) && (
                <ReactPlayer
                  url={card.answervideolink}
                  controls={true}
                  style={{ maxWidth: '80%', maxHeight: '80%' }} // ReactPlayer is likely incompatible with Tailwind
                />
              )}
              {card.answerimagelink && <img src={card.answerimagelink} className="max-w-[80%] max-h-[80%]" />}
              {card.answerlatex && <KatexOutput latex={card.answerlatex} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ShowAnswerButtons({ card, showAnswer, setShowAnswer, updateReviewedCard, flip, setFlip }) {
  const changeShowAnswer = () => {
    setShowAnswer(true);
    setFlip(!flip);
  };

  const confidence_scale_factors = {
    1: 0,     // Set interval to 0
    2: 0.75,  // Decrease interval by 25%
    3: 1,     // Same interval
    4: 1.5    // Increase interval by 50%
  }

  const now = new Date();

  // 8 hours in milliseconds
  const baseInterval = 28800000;
  const bucketMultiplier = Math.pow(3, card.bucket);

  const getNextReviewTime = (confidence_level) => {
    return new Date(now.getTime() + (baseInterval * bucketMultiplier * confidence_scale_factors[confidence_level]));
  }

  const formatTimeDifference = (startTime, endTime) => {
    // Time difference in milliseconds
    const timeDiff = endTime - startTime;

    // Convert milliseconds to days
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Convert remaining milliseconds to hours
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    // Convert remaining milliseconds to minutes and round to nearest minute
    const minutes = Math.round((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    let formattedTime = '';
    if (days > 0) {
      formattedTime += `${days}d `;
    }
    if (hours > 0 && days <= 4) {
      formattedTime += `${hours}h `;
    }
    if (days === 0 && hours <= 4) { // Only show minutes if there are minutes or if the time is less than 1 hour
      formattedTime += `${minutes}m`;
    }

    return formattedTime.trim(); // Trim any trailing whitespace (which is left to account for a possible next unit, ex: "2d 3h")
  }

  return (
    <div className="fixed bottom-8 left-0 right-0 mx-auto w-[100vw] flex justify-center">
      {!showAnswer && <button className="mt-8 border rounded-md w-[20%] min-w-[16rem]" onClick={changeShowAnswer}>Reveal Answer</button>}
      {
        showAnswer && (
          <div className="flex justify-center mt-28 flex-wrap">
            <button className="rounded-md w-24 px-4 mr-4 text-black bg-red-600 hover:bg-red-700" onClick={() => updateReviewedCard(0, getNextReviewTime(1), card, setFlip, false)}>Again <br />
              {formatTimeDifference(now.getTime(), getNextReviewTime(1))}</button>

            <button className="rounded-md w-24 px-4 mr-4 text-black bg-yellow-400 hover:bg-yellow-500" onClick={() => updateReviewedCard(card.bucket + 1, getNextReviewTime(2), card, setFlip, true)}>Hard <br />
              {formatTimeDifference(now.getTime(), getNextReviewTime(2))}</button>

            <button className="rounded-md w-24 px-4 mr-4 text-black bg-green-700 hover:bg-green-800" onClick={() => updateReviewedCard(card.bucket + 1, getNextReviewTime(3), card, setFlip, true)}>Good <br />
              {formatTimeDifference(now.getTime(), getNextReviewTime(3))}</button>

            <button className="rounded-md w-24 px-4 text-black bg-green-400 hover:bg-green-500" onClick={() => updateReviewedCard(card.bucket + 1, getNextReviewTime(4), card, setFlip, true)}>Easy <br />
              {formatTimeDifference(now.getTime(), getNextReviewTime(4))}</button>
          </div>
        )
      }
    </div>
  )
}

function FinishView(deckId) {
  return (
    <div className="flex flex-row justify-center items-center mt-[10vh]">
      <img className="w-40 h-40 mt-[-10vh]" src={partyPopperFlipImg} alt="Party Popper" />
      <div className="flex flex-col justify-center items-center mx-4">
        <h3 className="h-[25vh] flex justify-center items-center w-full border-black bg-white rounded-md p-5 text-2xl text-black my-4">You have studied all the cards in this deck</h3>
        <Link to={`/decks/${deckId.deckId}`}>
          <button className="border rounded-md px-2 py-1">Back to deck</button>
        </Link>
      </div>
      <img className="w-40 h-40 mt-[-10vh]" src={partyPopperImg} alt="Party Popper" />
    </div>
  )
}

function ReviewCard({ card, showAnswer, setShowAnswer, updateReviewedCard, changeAnimation, flip, setFlip }) {

  const changeShowAnswer = () => {
    setShowAnswer(true);
  };

  const KatexOutput = ({ latex }) => {
    const html = katex.renderToString(latex, {
      throwOnError: false,
      output: "html"
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className={`flex flex-col items-center h-auto w-[35vw] min-w-[16rem] mx-auto`}>
          <div className="w-full">
            {!changeAnimation && (<QuestionCard card={card}></QuestionCard>)}
            {!changeAnimation && (<AnswerCard card={card} showAnswer={showAnswer}></AnswerCard>)}
            {changeAnimation && (<FlashCard card={card} setShowAnswer={setShowAnswer} flip={flip} setFlip={setFlip}></FlashCard>)}
          </div>
        </div>
      </div>
      <ShowAnswerButtons card={card} showAnswer={showAnswer} setShowAnswer={setShowAnswer} updateReviewedCard={updateReviewedCard} flip={flip} setFlip={setFlip}></ShowAnswerButtons>
    </>
  );
}

const KatexOutput = ({ latex }) => {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    output: "html"
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default ReviewPage