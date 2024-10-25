import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useApi } from "../hooks";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownPreviewer from "../components/MarkdownPreviewer";

function QuizPage() {
  const api = useApi();
  const [quizs, setQuizs] = useState({ deck_name: '', quiz: [] });
  const { deckId } = useParams();
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [isFetching, setIsFetching] = useState(false); // Track fetching state

  const { data: Questions, isLoading, error, refetch } = useQuery(
    ['quiz', deckId],
    async () => { // This function is queryFn
      const response = await api._get(`/api/quiz/${deckId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${response.status}: ${errorData.detail || 'An error occurred'}`);
      }

      return response.json();
    },
    {
      staleTime: Infinity,  // Prevent refetching
      onSuccess: (data) => {
        setQuizs({ deck_name: data.deck_name, quiz: data.quiz });
        setIsFetching(false); // Reset fetching state on success
      },
      onError: () => {
        setIsFetching(false); // Reset fetching state on error
      }
    }
  )
  // Auto-refetch if quizs.quiz is undefined or empty
  useEffect(() => {
    if (!isFetching && (!quizs.quiz || quizs.quiz.length === 0)) {
      refetch();
    }
  }, [quizs, refetch, isFetching]);

  
  if (isLoading || isFetching) {
    return <LoadingSpinner />;
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

  console.log(quizs); // For some reason, quizs is not loaded? or data didn't set?

  if (!quizs.quiz || quizs.quiz.length < 4) {
    return (
      <div>
        <p>No quiz items available. Because we need at least 4 cards to generate a quiz.</p>
        <Link
          to={`/decks/${deckId}`}
          className="mt-4 inline-block py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Deck
        </Link>
      </div>
    );
  }

  // At this point quizs for sure exist
  const currentQuestion = quizs.quiz[currentQuestionIndex];

  const handleSelectAnswer = (selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption,
    }));

    // Determine if the selected answer is correct
    if (currentQuestion.choices[selectedOption] === currentQuestion.answer) {
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }

    // Move to the next question
    setTimeout(() => {
      if (currentQuestionIndex < quizs.quiz.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setAnswerStatus(null); // reset answer status for the next question
      } else {
        alert("Quiz Completed!"); // TODO - a finish view after finish all the question?
      }
    }, 1500);
  };

  return (
    <div className="m-4">
      <div className="flex items-center border-b border-elDark dark:border-edDividerGray pb-2 mb-4">
        <Link to={`/decks/${deckId}`} className="py-2 px-4 w-[10vw] z-10 text-center rounded-lg border border-edGray text-black dark:text-edWhite hover:bg-elHLT dark:hover:bg-edHLT">
          Back</Link>
        <h1 className="flex-grow text-2xl text-center text-elDark dark:text-edLightGray -ml-[10vw]">
          Deck: {quizs.deck_name}
        </h1>
      </div>


      <QuestionDisplay
        question={currentQuestion.question}
        choices={currentQuestion.choices}
        selectedAnswer={userAnswers[currentQuestionIndex]}
        handleSelectAnswer={handleSelectAnswer}
        answerStatus={answerStatus}
      />
    </div>
  );
}

function QuestionDisplay({ question, choices, selectedAnswer, handleSelectAnswer, answerStatus }) {
  return (
    // <div className="border-2 text-elDark border-elDark bg-white rounded-lg p-6 mb-4 shadow-lg">
    <div>
      <div className="w-[60vw] h-[40vh] border-2 text-elDark border-elDark bg-white dark:bg-edDarker rounded-lg p-4 mb-4 shadow-2xl">
        <MarkdownPreviewer content={question} className="flex-1 p-2 min-h-20 rounded-2xl text-xl bg-transparent" />
      </div>
      <div className="w-[60vw] grid grid-cols-2 gap-4">
        {choices.map((choice, index) => (
          <AnswerChoice
            key={index}
            choice={choice}
            index={index}
            isSelected={selectedAnswer === index}
            handleSelectAnswer={handleSelectAnswer}
            answerStatus={answerStatus}
          />
        ))}
      </div>
    </div>
  );
}

function AnswerChoice({ choice, index, isSelected, handleSelectAnswer, answerStatus }) {
  // Determine button color based on answer status
  let buttonClass = "h-[20vh] overflow-y-auto text-left border-2 border-elDark dark:bg-edDarker shadow-lg rounded-lg p-4 transition-colors duration-300";
  
  if (isSelected) {
    buttonClass += answerStatus === 'correct' ? 'bg-green-500 dark:bg-green-500' : 'bg-red-500 dark:bg-red-500';
  } else {
    buttonClass += ' bg-white hover:bg-gray-100';
  }

  return (
    <button
      onClick={() => handleSelectAnswer(index)}
      className={buttonClass}
    >
      <MarkdownPreviewer content={choice} className="flex-1 p-2 min-h-20 rounded-2xl bg-transparent" />
    </button>
  );
}

export default QuizPage