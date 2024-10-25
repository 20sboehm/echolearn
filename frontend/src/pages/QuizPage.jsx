import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useState } from "react";
import { useApi } from "../hooks";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownPreviewer from "../components/MarkdownPreviewer";

function QuizPage() {
  const api = useApi();
  const [quizs, setQuizs] = useState([]);
  const { deckId } = useParams();
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { data: Questions, isLoading, error } = useQuery(
    ['quiz', deckId],
    async () => { // This function is queryFn
      let response = null;
      response = await api._get(`/api/quiz/${deckId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${response.status}: ${errorData.detail || 'An error occurred'}`);
      }

      return response.json();
    },
    {
      staleTime: Infinity,  // Prevent refetching
      onSuccess: (data) => {
        console.log(data);
        setQuizs({ deck_name: data.deck_name, quiz: data.quiz });
      }
    }
  )
  if (isLoading) {
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

  if (!quizs) {
    return <p>No quiz items available.Because we need at least 4 cards to generate a quiz</p>;
  }

  // At this point quizs for sure exist
  const currentQuestion = quizs.quiz[currentQuestionIndex];

  const handleSelectAnswer = (questionIndex, selectedOption) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizs.quiz.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      alert("Quiz Completed!");
      setCurrentQuestionIndex(0); // Reset or handle end of quiz as needed
    }
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
        handleSelectAnswer={(selectedOption) => handleSelectAnswer(currentQuestionIndex, selectedOption)}
        correctAnswer={currentQuestion.answer}
      />
    </div>
  );
}

function QuestionDisplay({ question, choices, selectedAnswer, handleSelectAnswer, correctAnswer }) {
  return (
    // <div className="border-2 text-elDark border-elDark bg-white rounded-lg p-6 mb-4 shadow-lg">
    <div>
      <div className="w-[60vw] h-[40vh] border-2 text-elDark border-elDark bg-white rounded-lg p-4 mb-4 shadow-2xl">
        <MarkdownPreviewer content={question} className="flex-1 p-2 min-h-20 rounded-2xl text-xl bg-transparent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {choices.map((choice, index) => (
          <AnswerChoice
            key={index}
            choice={choice}
            index={index}
            isSelected={selectedAnswer === index}
            handleSelectAnswer={handleSelectAnswer}
          />
        ))}
      </div>
    </div>
  );
}

function AnswerChoice({ choice, index, isSelected, handleSelectAnswer }) {
  return (
    <button
      onClick={() => handleSelectAnswer(index)}
      className={`h-[20vh] flex overflow-y-auto border-2 border-elDark shadow-lg rounded-lg p-2 transition-colors duration-300
        ${isSelected ? 'bg-red-500 text-white' : 'bg-white hover:bg-gray-100'}`}
    >
      <MarkdownPreviewer content={choice} className="flex-1 p-2 rounded-2xl bg-transparent text-left" />
    </button>
  );
}

export default QuizPage