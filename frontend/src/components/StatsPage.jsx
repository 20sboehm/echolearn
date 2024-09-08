import { useParams } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useApi } from "../hooks";

// Register the chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// The following const functions is for the upcoming bar graph
const upcomingDaysFromToday = (date) => {
  const today = new Date();
  const reviewDate = new Date(date);
  const diffTime = reviewDate - today; // Time difference in milliseconds
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return diffDays;
};
const groupUpcomingCards = (cards) => {
  const upcomingDays = Array(31).fill(0);
  cards.forEach((card) => {
    const daysFromToday = upcomingDaysFromToday(card.next_review);

    if (daysFromToday >= 0 && daysFromToday <= 30) {
      upcomingDays[daysFromToday] += 1; // Increment the count for that day
    }
  });

  return upcomingDays;
};
const upcomingChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: { display: true, text: 'Upcoming Reviews' },
  },
  scales: {
    x: { title: { display: true }, ticks: { minRotation: 0, maxRotation: 0 } },
    y: {
      title: { display: true, text: 'Number of Cards' }, beginAtZero: true, min: 0, max: 50,
      ticks: { stepSize: 10, },
    },
  },
};

// The following const functions is for the previous review bar graph
const previousReviewFromToday = (date) => {
  const today = new Date();
  const reviewDate = new Date(date);
  const diffTime = today - reviewDate; // Time difference in milliseconds
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return diffDays;
};
const groupPreviousReviews = (cards) => {
  const previousDays = Array(31).fill(0);
  cards.forEach((card) => {
    const daysSinceLastReview = previousReviewFromToday(card.last_reviewed);

    if (daysSinceLastReview >= 0 && daysSinceLastReview <= 30) {
      previousDays[daysSinceLastReview] += 1; // Increment the count for that day
    }
  });

  return previousDays;
};
const previousChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: { display: true, text: 'Previous Reviews' },
  },
  scales: {
    x: { title: { display: true }, ticks: { minRotation: 0, maxRotation: 0 } },
    y: {
      title: { display: true, text: 'Number of Cards' }, beginAtZero: true, min: 0, max: 50,
      ticks: { stepSize: 10, },
    },
  },
};

function StatsPage() {
  const api = useApi();

  const { deckId } = useParams();
  const [upcomingReviewData, setupcomingReviewData] = useState({});
  const [previousReviewData, setPreviousReviewData] = useState({});

  const { data: deckCards, isLoading, error } = useQuery({
    queryFn: () =>
      api._get(`/api/decks/${deckId}/cards`).then((response) => response.json()),
    onSuccess: (data) => {
      if (data && data.cards) {
        const groupedData = groupCardsByDay(data.cards);
        setDeckData(groupedData);
      }
    }
  });

  useEffect(() => {
    if (deckCards && deckCards.cards) {
      const groupedData = groupUpcomingCards(deckCards.cards);
      setupcomingReviewData(groupedData);

      const previousReviewGroupedData = groupPreviousReviews(deckCards.cards);
      setPreviousReviewData(previousReviewGroupedData);
    }
  }, [deckCards]);

  const chartData = {
    labels: Array.from({ length: 31 }, (_, i) => `${i} days`), // X-axis: 0 to 30 days
    datasets: [
      {
        label: 'Upcoming Reviews',
        data: upcomingReviewData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // light muted cyan
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartDataPrevious = {
    labels: Array.from({ length: 31 }, (_, i) => `${i} days`), // X-axis: 0 to 30 days
    datasets: [
      {
        label: 'Previous Reviews',
        data: previousReviewData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)', // light purple?
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex">
        <div style={{ background: 'white', width: '35vw', height: '35vh' }}>
          <Bar data={chartData} options={upcomingChartOptions} style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ background: 'white', width: '35vw', height: '35vh' }}>
          <Bar data={chartDataPrevious} options={previousChartOptions} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  )
}

export default StatsPage