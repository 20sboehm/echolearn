import { useState, useEffect, Children } from "react";
import { useQuery } from 'react-query';
import { Link, useParams, useSearchParams } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useApi } from "../hooks";
import partyPopperImg from '../assets/party-popper.png';
import partyPopperFlipImg from '../assets/party-popper-flip.png';
import set from '../assets/reviewSwitch2.png';
import card from '../assets/reviewSwitch.png';
import "./ReviewPage.css";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
// import ReactPlayer from 'react-player';
// import { BlockMath } from 'react-katex'; // we might need this here
// import sanitizeHtml from 'sanitize-html'; // we might need this here
// import katex from 'katex';

// Two layers in order to maintain border rounding with active scrollbar
const cardOuterCSS = "border border-elDarkGray bg-white rounded-md overflow-hidden"
const cardInnerCSS = "h-[30vh] px-4 py-2 text-black flex flex-col items-center overflow-x-hidden overflow-y-auto text-[1.4em] py-4"

function ReviewPage() {
  const api = useApi();

  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false); // Reveals the answer buttons as well as the 'Answer' card on the default review display setting
  const [finish, setFinish] = useState(false);
  const [changeAnimation, setAnimation] = useState(true);
  const [currImage, setCurrImage] = useState(card);
  const { deckId } = useParams();
  const [searchParams] = useSearchParams();
  const studyAll = searchParams.get('studyAll') === 'true';
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const [flip, setFlip] = useState(false);

  const { data: userSettings, loading } = useQuery(
    ['userSettings'],
    async () => {
      let response = await api._get('/api/profile/me');
      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.detail || 'An error occurred';
        throw new Error(`${response.status}: ${message}`);
      }
      return response.json(); // Ensure we return the response data
    },
    {
      onSuccess: (data) => {
        setAnimation(data?.flip_mode ?? true);  // Set flip after successful data fetch
        if (data?.flip_mode == false) {
          setCurrImage(set)
        }
      }
    }
  );

  if (loading) {
    return <LoadingSpinner />;
  }


  const switchAnimation = () => {
    setCurrImage((prev) =>
      prev === set ? card : set
    );
    setAnimation(!changeAnimation);
    // setShowAnswer(false); these don't need to be set to false i think?
    // setFlip(false);
  }

  // Fetch reviews info
  const { data: reviews, isLoading, error } = useQuery(
    ['reviews', deckId, studyAll],
    async () => {
      let response = await api._get(`/api/reviews/${deckId}?studyAll=${studyAll}`);

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

  const updateReviewedCard = (newBucket, nextReviewTime, card, wasCorrect) => {
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
      <div className="flex w-full h-full">
        {/* <Sidebar /> */}
        <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="rounded-lg mt-[2%] flex flex-col flex-grow min-w-[16rem] mx-auto overflow-x-auto">
          <div className="flex mx-auto items-center border-b border-black dark:border-edWhite pb-[1rem] w-[40vw]">
            <Link to={`/decks/${deckId}`} className="rounded-lg border border-black hover:border-elMedGray hover:text-elMedGray 
              dark:border-transparent dark:hover:border-black dark:hover:text-black px-10 py-2 text-center
              font-semibold bg-elGray dark:bg-white text-black active:scale-[0.97] active:border-[#555]">back</Link>
            <h2 className="text-[2em] text-elDark dark:text-edWhite mx-auto">{reviews.deck_name}</h2>
            <button className="border border-black w-[12%] ml-auto" onClick={switchAnimation}>
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
      </div>
    </>
  );
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
  // Whether to display the question or answer on the 'flip' version of the card
  // This is to make the animation seem smoother by switching the displayed text half way through the flip animation
  const [displayQuestionOnFlipCard, setDisplayQuestionOnFlipCard] = useState(true);

  const toggleFlip = () => {
    setFlip((prevFlip) => {
      const newFlip = !prevFlip

      setShowAnswer(newFlip);

      // Switch question/answer halfway through the flip
      setTimeout(() => {
        setDisplayQuestionOnFlipCard(!newFlip);
      }, 150);

      return newFlip; // Update flip state
    });
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className={`flex flex-col items-center h-auto w-[35vw] min-w-[16rem] mx-auto`}>
          <div className="w-full">
            {!changeAnimation && (<QuestionCard card={card}></QuestionCard>)}
            {!changeAnimation && (<AnswerCard card={card} flip={flip} showAnswer={showAnswer} displayQuestion={displayQuestionOnFlipCard}></AnswerCard>)}
            {changeAnimation && (<FlipFlashcard card={card} flip={flip} toggleFlip={toggleFlip} displayQuestion={displayQuestionOnFlipCard}></FlipFlashcard>)}
          </div>
        </div>
      </div>
      <ShowAnswerButtons card={card} showAnswer={showAnswer} updateReviewedCard={updateReviewedCard} toggleFlip={toggleFlip}></ShowAnswerButtons>
    </>
  );
}

function QuestionCard({ card, setShowAnswer }) {
  if (card) {
    return (
      <div className={`mt-8 overflow-x-hidden overflow-y-auto`}>
        <div className={`h-[30vh] text-[1.2rem] flex flex-col border border-edMedGray`}>
          <MarkdownPreviewer content={card.question} className="flex-1 p-3 h-full" />
        </div >
      </div>
    )
  }
}

function AnswerCard({ card, flip, showAnswer, displayQuestion }) {
  if (card) {
    return (
      <div className={`mt-8 duration-300 ${showAnswer ? "mt-8 opacity-100" : "mt-12 opacity-0"}`}>
        <div className={`h-[30vh] text-[1.2rem] flex flex-col border border-edMedGray`}>
          {/* If flip=false (The card is at or flipping towards 'question position') AND we're set to display answer 
          (meaning we're still in the 1/2 animation time delay for setting `displayQuestion`), set content to blank 
          so we dont give away the answer to the next question */}
          <MarkdownPreviewer content={!flip && !displayQuestion ? "" : card.answer} className="flex-1 p-3 h-full" />
        </div >
      </div>
    )
  }
}

function FlipFlashcard({ card, flip, toggleFlip, displayQuestion }) {
  return (
    <div className={`mt-8 flashCard ${flip ? 'flip' : ''}`} onClick={toggleFlip}>
      <div className="h-[50vh] text-[1.2rem] bg-eDarker border border-eMedGray text-eWhite flex flex-col justify-center items-center 
          overflow-x-hidden overflow-y-auto"
      >
        <MarkdownPreviewer
          content={!flip && !displayQuestion ? "" : (displayQuestion ? card.question : card.answer)}
          className={`flex-1 p-3 h-full ${displayQuestion ? "" : "flashCardBack"}`} // This has to be 'displayQuestion' instead of flip and I'm not sure why
        />
      </div>
    </div>
  )
}

function ShowAnswerButtons({ card, showAnswer, updateReviewedCard, toggleFlip }) {
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

  const updateReviewedCardAndDisplay = (confidence_level) => {
    toggleFlip();
    if (confidence_level === 1) {
      return updateReviewedCard(0, nextReviewTime(confidence_level), card, false);
    } else {
      return updateReviewedCard(card.bucket + 1, nextReviewTime(confidence_level), card, true);
    }
  }

  const timeUntilNextReview = (confidence_level) => {
    return formatTimeDifference(now.getTime(), nextReviewTime(confidence_level));
  }

  const nextReviewTime = (confidence_level) => {
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
    // <div className="fixed bottom-8 left-0 right-0 mx-auto w-[100vw] flex justify-center">
    <div className="flex justify-center mt-8 mb-8">
      {!showAnswer && <button className="mt-8 border border-black text-elDark bg-elGray dark:bg-edGray dark:border-edWhite dark:text-edWhite rounded-md w-[20%] min-w-[16rem]" onClick={toggleFlip}>Reveal Answer</button>}
      {
        showAnswer && (
          <div className="flex justify-center mt-8 flex-wrap">
            <ResultButton customStyles="mr-4 border border-black bg-red-600 hover:bg-red-700" confidenceLevel={1}
              clickEvent={updateReviewedCardAndDisplay} timeUntil={timeUntilNextReview}>Again</ResultButton>

            <ResultButton customStyles="mr-4 border border-black bg-yellow-400 hover:bg-yellow-500" confidenceLevel={2}
              clickEvent={updateReviewedCardAndDisplay} timeUntil={timeUntilNextReview}>Hard</ResultButton>

            <ResultButton customStyles="mr-4 border border-black bg-green-700 hover:bg-green-800" confidenceLevel={3}
              clickEvent={updateReviewedCardAndDisplay} timeUntil={timeUntilNextReview}>Good</ResultButton>

            <ResultButton customStyles="border border-black bg-green-400 hover:bg-green-500" confidenceLevel={4}
              clickEvent={updateReviewedCardAndDisplay} timeUntil={timeUntilNextReview}>Easy</ResultButton>
          </div>
        )
      }
    </div>
  )
}

function ResultButton({ customStyles, confidenceLevel, clickEvent, timeUntil, children }) {
  return (
    <button className={`${customStyles} rounded-md w-24 px-4 text-black`}
      onClick={() => clickEvent(confidenceLevel)}>{children} <br />
      {timeUntil(confidenceLevel)}
    </button>
  )
}

// const changeShowAnswer = () => {
//   setShowAnswer(true);
// };

// const KatexOutput = ({ latex }) => {
//   const html = katex.renderToString(latex, {
//     throwOnError: false,
//     output: "html"
//   });

//   return <div dangerouslySetInnerHTML={{ __html: html }} />;
// };

// const changeShowAnswer = () => {
//   setShowAnswer(true);
//   setFlip(!flip);
// };

// const KatexOutput = ({ latex }) => {
//   const html = katex.renderToString(latex, {
//     throwOnError: false,
//     output: "html"
//   });
//   return <div dangerouslySetInnerHTML={{ __html: html }} />;
// };

export default ReviewPage