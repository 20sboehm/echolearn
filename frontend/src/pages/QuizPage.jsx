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
      onSuccess: (data) => {
        console.log(data);
        setQuizs(data.quiz);
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


  const handleSelectAnswer = (questionIndex, selectedOption) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };


  return (
    <>
      <div className="m-4">
        <h1>Quiz</h1>
        {quizs.map((quiz, quizIndex) => (
          <div key={quizIndex}>
            <h3>{quiz.question}</h3>
            <ul>
              {quiz.choices.map((choice, index) => (
                <li key={index}
                  onClick={() => handleSelectAnswer(quizIndex, index)}
                  style={{
                    cursor: 'pointer',
                    color: userAnswers[quizIndex] === index ? 'red' : 'black'
                  }}>
                  {choice}
                </li>
              ))}
            </ul>
            {userAnswers[quizIndex] !== undefined && (
              <p>
                Your answer ({quiz.choices[userAnswers[quizIndex]]}) is
                {quiz.choices[userAnswers[quizIndex]] === quiz.answer ? ' correct' : ' incorrect'}.
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default QuizPage