import { Link, useParams } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useApi } from "../hooks";

// Register the chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

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
    title: { display: true, text: 'Upcoming Reviews', font: { size: 16 } },
    datalabels: {display: false},
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
    title: { display: true, text: 'Previous Reviews', font: { size: 16 } },
    datalabels: {display: false},
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
    title: { display: true, text: 'Correct vs. Incorrect Percentage', font: { size: 18 } },
    tooltip: { enabled: false },
    datalabels: { display: true, align: 'center', color: '#fff', // White
      formatter: (value, context) => {
        // Calculate percentage label
        const total = context.chart.data.datasets[0].data[0] + context.chart.data.datasets[1].data[0];
        const percentage = ((value / total) * 100).toFixed(2);
        return percentage + '%';
      },
      font: { weight: 'bold', size: 14 },
    },
  },
  scales: {
    x: { beginAtZero: true, stacked: true, display: false,
      ticks: {
        callback: function(value) {
          return value + "%";
        },
      },
    },
    y: { stacked: true, display: false },
  },
};

function Card({ card }) {
  return (
    <div className="w-92 h-52 border p-4 rounded-lg bg-white shadow-sm flex flex-col justify-between text-black">
      <h2 className="truncate font-bold text-xl">Question:{card.question}</h2>
      <p className="truncate"><strong>Next Review:</strong> {new Date(card.next_review).toLocaleDateString()}</p>
      <p className="truncate"><strong>Last Reviewed:</strong> {new Date(card.last_reviewed).toLocaleDateString()}</p>
      <p className="truncate"><strong>Group:</strong>{card.bucket}</p>
      <p className="truncate"><strong>Correct Count:</strong> {card.correct_count}</p>
      <p className="truncate"><strong>Incorrect Count:</strong> {card.incorrect_count}</p>
    </div>
  );
}


function BucketFilter({ selectedBucket, onChange }) {
  const buckets = [0, 1, 2, 3, 4, 5];
  return (
    <select
      value={selectedBucket}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="">All Cards</option>
      {buckets.map((bucket) => (
        <option key={bucket} value={bucket}>
          Bucket {bucket}
        </option>
      ))}
    </select>
  );
}


function StatsPage() {
  const api = useApi();

  const { deckId } = useParams();
  const [upcomingReviewData, setupcomingReviewData] = useState({});
  const [previousReviewData, setPreviousReviewData] = useState({});
  const [totalCounts, setTotalCounts] = useState({ correct: 0, incorrect: 0 });
  const [selectedBucket, setSelectedBucket] = useState('');

  const { data: deckCards, isLoading, error } = useQuery({
    queryKey:['cards', deckId],
    queryFn: () =>
      api._get(`/api/decks/${deckId}/cards`).then((response) => response.json()),
  });

  useEffect(() => {
    if (deckCards && deckCards.cards) {
      const filteredCards = selectedBucket
        ? deckCards.cards.filter(card => card.bucket == selectedBucket)
        : deckCards.cards;

      const groupedData = groupUpcomingCards(deckCards.cards);
      setupcomingReviewData(groupedData);

      const previousReviewGroupedData = groupPreviousReviews(deckCards.cards);
      setPreviousReviewData(previousReviewGroupedData);

      const totalCorrect = filteredCards.reduce((sum, card) => sum + card.correct_count, 0);
      const totalIncorrect = filteredCards.reduce((sum, card) => sum + card.incorrect_count, 0);

      setTotalCounts({
        correct: totalCorrect,
        incorrect: totalIncorrect,
      });
    }
  }, [deckCards, selectedBucket]);

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
        data: [correctPercentage],  // Positive value
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 30,
      },
      {
        label: 'Incorrect',
        data: [incorrectPercentage],  // Positive value
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
          <div className="rounded-lg bg-white w-[25vw] h-[30vh]">
            <Bar data={chartData} options={upcomingChartOptions} />
          </div>
          <div className="rounded-lg bg-white w-[25vw] h-[30vh]">
            <Bar data={chartDataPrevious} options={previousChartOptions}/>
          </div>
        </div>
        {/* The bar graph is the correct vs incorrect percentage graph */}
        <div className="flex flex-col justify-center mt-4">
          <div className="bg-white w-[80vw] h-[15vh]">
              <Bar data={totalChartData} options={totalChartOptions} />
          </div>

          <div className="mt-4 mb-4">
              <BucketFilter
                selectedBucket={selectedBucket}
                onChange={setSelectedBucket}
              />
            </div>

            <div className="overflow-x-auto w-[80vw]">
              <div className="flex space-x-4 p-4">
                {deckCards.cards.filter(card => !selectedBucket || card.bucket == selectedBucket).map((card) => (
                  <Card key={card.id} card={card} />
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default StatsPage