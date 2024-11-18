import React, { useState } from 'react';
import { useApi } from '../hooks';
import './StarDisplay.css';

function RateDeck({ deck_id }) {
    const [selectedRating, setSelectedRating] = useState(null); // The rating selected by the user
    const api = useApi();
    const { _post } = api;
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Handle the star click to set the rating
    const handleStarClick = (rating) => {
        setSelectedRating(rating);
    };

    // Handle the "Rate" button click to send the rating to the server
    const handleRateSubmit = async () => {
        if (selectedRating === null) {
            alert('Please select a rating before submitting.');
            return;
        }

        try {
            const response = await _post(`/api/decks/${deck_id}/setRate/${selectedRating}`);
            if (response.ok) {
                setIsSubmitted(true);
            } else {
                const errorData = await response.json();
                alert(`Failed to submit rating: ${errorData.detail || 'An error occurred'}`);
            }
        } catch (error) {
            alert('An error occurred while submitting your rating.');
        }
    };

    // If the rating was successfully submitted, show a success message
    if (isSubmitted) {
        return (
          <div className="rate-deck text-center">
            <h2 className="text-2xl font-bold text-elBlue">Your rating has been submitted!</h2>
          </div>
        );
    }

  return (
    <div className="rate-deck">
      <h2 className="text-2xl font-bold text-elDark mb-4">Rate this Deck</h2>
      <div className="stars flex items-center gap-4">
        <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
            <span
                key={rating}
                className={`star text-3xl ${selectedRating >= rating ? 'text-gold' : 'text-lightgray'} cursor-pointer`}
                onClick={() => handleStarClick(rating)}
            >
                ★
            </span>
            ))}
        </div>
        <span className="flex-1 text-2xl text-elBlue ml-4 text-center">
        {selectedRating === 5
          ? 'Very good'
          : selectedRating === 1
          ? 'Very bad'
          : selectedRating === 2
          ? 'Bad'
          : selectedRating === 3
          ? 'Ok'
          : selectedRating === 4
          ? 'Good'
          : 'Click to rate'}
      </span>
      </div>
      <button
        className="rate-button bg-edBlue text-white mt-4 px-4 py-2 rounded"
        onClick={handleRateSubmit}
      >
        Rate
      </button>
    </div>
  );
}

export default RateDeck;