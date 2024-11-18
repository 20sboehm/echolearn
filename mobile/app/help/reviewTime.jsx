import { useState, useEffect } from 'react';

const reviewTime = (cardId, domain, token) => {
  const [reviewTimes, setReviewTimes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewTimes = async () => {
      try {
        const response = await fetch(`${domain}/api/cards/review_times/${cardId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          const message = errorData.detail || 'An error occurred';
          throw new Error(`${response.status}: ${message}`);
        }

        const data = await response.json();
        setReviewTimes(data); // Store fetched review times
        setError(null); // Clear any previous errors
      } catch (error) {
        setError(error.message); // Set error if any occurs
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    if (cardId) {
      fetchReviewTimes();
    }
  }, [cardId, domain, token]);

  return { reviewTimes, isLoading, error };
};

export default reviewTime;
