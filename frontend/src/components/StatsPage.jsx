import { Link, useParams } from "react-router-dom";
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
  maintainAspectRatio: false,
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
      if(card.is_new == false)
        previousDays[daysSinceLastReview] += 1; // Increment the count for that day
    }
  });
  return previousDays;
};
const previousChartOptions = {
  maintainAspectRatio: false,
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

// For the directional bar chart graph 
const totalChartOptions = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: { display: true, text: 'Correct vs. Incorrect' },
    tooltip: {
      callbacks: {
        label: function (context) {
          let correctValue = Math.abs(context.chart.data.datasets[0].data[0]);
          let incorrectValue = Math.abs(context.chart.data.datasets[1].data[0]);

          let total = correctValue + incorrectValue;
          let value = Math.abs(context.raw);
          let percentage = ((value / total) * 100).toFixed(2);

          return `${context.dataset.label}: ${percentage}%`;
        },
      },
    },
  },
  scales: {
    x: { beginAtZero: true,
      ticks: {
        callback: function(value) {
          return Math.abs(value) + "%";
        },
      },
    },
    y: { stacked: true },
  },
};

function StatsPage() {
  const api = useApi();

  const { deckId } = useParams();
  const [upcomingReviewData, setupcomingReviewData] = useState({});
  const [previousReviewData, setPreviousReviewData] = useState({});
  const [totalCounts, setTotalCounts] = useState({ correct: 0, incorrect: 0 });

  const { data: deckCards, isLoading, error } = useQuery({
    queryFn: () =>
      api._get(`/api/decks/${deckId}/cards`).then((response) => response.json()),
  });

  useEffect(() => {
    if (deckCards && deckCards.cards) {
      const groupedData = groupUpcomingCards(deckCards.cards);
      setupcomingReviewData(groupedData);

      const previousReviewGroupedData = groupPreviousReviews(deckCards.cards);
      setPreviousReviewData(previousReviewGroupedData);

      const totalCorrect = deckCards.cards.reduce((sum, card) => sum + card.correct_count, 0);
      const totalIncorrect = deckCards.cards.reduce((sum, card) => sum + card.incorrect_count, 0);

      setTotalCounts({
        correct: totalCorrect,
        incorrect: totalIncorrect,
      });

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

  const total = totalCounts.correct + totalCounts.incorrect;
  const correctPercentage = (totalCounts.correct / total) * 100;
  const incorrectPercentage = (totalCounts.incorrect / total) * 100;

  const totalChartData = {
    labels: ['Total'],
    datasets: [
      {
        label: 'Correct',
        data: [-correctPercentage],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 30,
      },
      {
        label: 'Incorrect',
        data: [incorrectPercentage],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div>
      <div className="flex justify-between items-center mt-3 mb-3">
        <Link to={`/decks/${deckId}`} className="rounded-lg border border-transparent px-12 py-2 text-center
              font-semibold bg-white text-black hover:border-black active:scale-[0.97] active:bg-[#333] 
              active:border-[#555]">back</Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="font-bold text-center text-2xl">
            {deckCards.deck_name}
          </h1>
        </div>
      </div>

      <div className="flex flex-col">
        {/* The two bar graph is the upcoming and previous review graph */}
        <div className="flex justify-between">
          <div className="rounded-lg" style={{ background: 'white', width: '25vw', height: '30vh' }}>
            <Bar data={chartData} options={upcomingChartOptions} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="rounded-lg" style={{ background: 'white', width: '25vw', height: '30vh' }}>
            <Bar data={chartDataPrevious} options={previousChartOptions} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
        {/* The bar graph is the correct vs incorrect percentage graph */}
        <div className="flex justify-center mt-4">
          <div style={{ background: 'white', width: '80vw', height: '15vh' }}>
              <Bar data={totalChartData} options={totalChartOptions} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default StatsPage