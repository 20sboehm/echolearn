import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";
import SideBar from './SideBar';
import { useApi } from '../api';

function Test() {
  const api = useApi();
  const { deckId } = useParams();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');
  const [userAnswers, setUserAnswers] = useState({});

  const { data: quiz_items, isLoading, error } = useQuery({
    queryKey: ['quiz', deckId],
    queryFn: () =>
      api._get(`/api/test/${deckId}`).then(response => response.json()).then(data => data.quiz),
    onSuccess: (data) => {
      console.log("Fetched data:", data);
    },
    staleTime: Infinity  // Prevent refetching
  });

  const handleSelectAnswer = (questionIndex, selectedOption) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  function popupDetails(message, color) {
    setShowPopup(true);
    setPopupMessage(message);
    setPopupColor(color);
    setPopupOpacity('opacity-100');
    setTimeout(() => {
      setPopupOpacity('opacity-0');
      setTimeout(() => setShowPopup(false), 1000);
    }, 1000);
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>An error occurred: {error.message}</p>;
  }

  if (!quiz_items) {
    return <p>No quiz items available.Because we need at least 4 cards to generate a quiz</p>;
  }

  return (
    <>
      <SideBar />
      <div className="m-4">
        <h1>Quiz</h1>
        {quiz_items.map((quiz, quizIndex) => (
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
      {showPopup && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
          {popupMessage}
        </div>
      )}
    </>
  );
}

export default Test;
