import { Link, useParams } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useApi } from "../hooks";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownPreviewer from "../components/MarkdownPreviewer";

function StatsPage() {
  const api = useApi();

  const { deckId } = useParams();
  const [upcomingReviewData, setupcomingReviewData] = useState({});
  const [previousReviewData, setPreviousReviewData] = useState({});
  const [totalCounts, setTotalCounts] = useState({ correct: 0, incorrect: 0 });
  const [selectedBucket, setSelectedBucket] = useState('');
  const [selectTimeFrame, setSelectTimeFrame] = useState('30_days');

  const handleTimeFrameChange = (value) => {
    setSelectTimeFrame(value);
  };

  const timeFrames = [
    { value: '30_days', label: '30 Days' },
    { value: '3_months', label: '3 Months' },
    { value: '1_year', label: '1 Year' },
  ];

  const { data: deckCards, isLoading, error } = useQuery({
    queryKey: ['cards', deckId],
    queryFn: async () => {
      let response = await api._get(`/api/decks/${deckId}/cards`);

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.detail || 'An error occurred';
        throw new Error(`${response.status}: ${message}`);
      }

      return response.json();
    },
    retry: false
  });

  useEffect(() => {
    if (deckCards && deckCards.cards) {
      const filteredCards = selectedBucket
        ? deckCards.cards.filter(card => card.bucket == selectedBucket)
        : deckCards.cards;

      const groupedData = groupUpcomingCards(deckCards.cards, selectTimeFrame);
      setupcomingReviewData(groupedData);

      const previousReviewGroupedData = groupPreviousReviews(deckCards.cards, selectTimeFrame);
      setPreviousReviewData(previousReviewGroupedData);

      const totalCorrect = filteredCards.reduce((sum, card) => sum + card.correct_count, 0);
      const totalIncorrect = filteredCards.reduce((sum, card) => sum + card.incorrect_count, 0);

      setTotalCounts({
        correct: totalCorrect,
        incorrect: totalIncorrect,
      });
    }
  }, [deckCards, selectedBucket, selectTimeFrame]);

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

  const chartData = {
    labels: getChartLabels(selectTimeFrame),
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
    labels: getChartLabels(selectTimeFrame),
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
        data: [correctPercentage],
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

  const filteredCards = deckCards.cards.filter(card => !selectedBucket || card.bucket == selectedBucket);
  const cardCount = filteredCards.length;

  return (
    <>
      <div>
        <div className="flex justify-between items-center mt-3 mb-3">
          <Link to={`/decks/${deckId}`}  className="rounded-lg border border-black hover:border-elMedGray hover:text-elDark 
              dark:border-transparent dark:hover:border-black dark:hover:text-white px-10 py-2 text-center
              font-semibold bg-elLightBlue text-white active:scale-[0.97] active:border-[#555]">back</Link>
          <div className="absolute left-1/2 mt-10 transform -translate-x-1/2">
            <h1 className="font-bold text-center text-3xl text-elDark dark:text-edWhite">
              {deckCards.deck_name}
            </h1>
            <div className="flex space-x-4 mt-2">
              {timeFrames.map((timeFrame) => (
                <button
                  key={timeFrame.value}
                  className={`text-sm border border-black rounded-full py-2 px-2 ${selectTimeFrame === timeFrame.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                    }`}
                  onClick={() => handleTimeFrameChange(timeFrame.value)}
                >
                  {timeFrame.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {/* The two bar graph is the upcoming and previous review graph */}
          <div className="flex justify-between">
            <div className="rounded-lg bg-white border border-black w-[30vw] h-[30vh]">
              <Bar data={chartData} options={upcomingChartOptions} />
            </div>
            <div className="rounded-lg bg-white border border-black w-[30vw] h-[30vh]">
              <Bar data={chartDataPrevious} options={previousChartOptions} />
            </div>
          </div>
          {/* The bar graph is the correct vs incorrect percentage graph */}
          <div className="flex flex-col justify-center mt-4">
            <div className="mb-4 bg-white border-t border-r border-l rounded border-black w-[80vw] h-[15vh]">
              <Bar data={totalChartData} options={totalChartOptions} />
            </div>

            {/* The following two is the individual card filter and data */}
            <div className="mt-4 mb-4 pt-4 text-black border-t-2 border-black">
              <BucketFilter
                selectedBucket={selectedBucket}
                onChange={setSelectedBucket}
              />
              <span className="ml-4 text-elDark dark:text-edWhite">{cardCount} cards</span>
            </div>
            <div className="overflow-x-auto w-[80vw]">
              <div className="flex space-x-4 p-4">
                {filteredCards.map((card) => (
                  <Card key={card.card_id} card={card} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Register the chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const getChartLabels = (selectTimeFrame) => {
  switch (selectTimeFrame) {
    case '30_days':
      return Array.from({ length: 31 }, (_, i) => `${i} days`); // X-axis: 0 to 30 days
    case '3_months':
      return Array.from({ length: 10 }, (_, i) => `Days ${i * 10 + 1}-${(i + 1) * 10}`); // 3 months divided into 10 days
    case '1_year':
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 1 year divided into months
    default:
      return Array.from({ length: 31 }, (_, i) => `${i} days`); // Fallback
  }
};

// The following const functions is for the upcoming bar graph
const upcomingDaysFromToday = (date) => {
  const today = new Date();
  const reviewDate = new Date(date);
  const diffTime = reviewDate - today; // Time difference in milliseconds
  var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

  // If the review date is past (diffDays is negative), treat it as due today (index 0)
  if (diffDays < 0) {
    diffDays = 0;
  }
  return diffDays;
};
const groupUpcomingCards = (cards, selectTimeFrame) => {
  let upcomingDays;

  switch (selectTimeFrame) {
    case '30_days':
      upcomingDays = Array(31).fill(0);
      cards.forEach((card) => {
        const daysFromToday = upcomingDaysFromToday(card.next_review);
        if (daysFromToday >= 0 && daysFromToday < 31) {
          upcomingDays[daysFromToday] += 1; // Increment the count for that day
        }
      });
      break;

    case '3_months':
      upcomingDays = Array(10).fill(0); // 3 months divided into 10 days
      cards.forEach((card) => {
        const daysFromToday = upcomingDaysFromToday(card.next_review);
        const bucketIndex = Math.floor(daysFromToday / 10);
        if (daysFromToday >= 0 && bucketIndex < 10) {
          upcomingDays[bucketIndex] += 1; // Increment the count for that 10-day bucket
        }
      });
      break;

    case '1_year':
      upcomingDays = Array(12).fill(0); // 1 year divided into months
      cards.forEach((card) => {
        const reviewDate = new Date(card.next_review);
        const today = new Date();
        
        // Only count upcoming reviews within the same year or the next year
        if (reviewDate >= today || card.is_new) {
          const monthDiff = reviewDate.getFullYear() - today.getFullYear();
          const monthIndex = monthDiff == 0 ? reviewDate.getMonth() : reviewDate.getMonth() + 12;

          upcomingDays[monthIndex] += 1; // Increment the count for that month
        }
      });
      break;

    default:
      upcomingDays = Array(31).fill(0);
  }
  console.log('Upcoming Days Data:', upcomingDays);
  return upcomingDays;
};
const upcomingChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: { display: true, text: 'Upcoming Reviews', font: { size: 16 } },
    datalabels: { display: false },
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
const groupPreviousReviews = (cards, selectTimeFrame) => {
  let previousDays;

  switch (selectTimeFrame) {
    case '30_days':
      previousDays = Array(31).fill(0);
      cards.forEach((card) => {
        card.review_history.forEach((previousTime) => {
          const daysSinceLastReview = previousReviewFromToday(previousTime);
          if (daysSinceLastReview >= 0 && daysSinceLastReview < 31) {
            if (!card.is_new) {
              previousDays[daysSinceLastReview] += 1; // Increment the count for that day
            }
          }
        });
      });
      break;

    case '3_months':
      previousDays = Array(10).fill(0); // 3 months divided into 10-day buckets
      cards.forEach((card) => {
        card.review_history.forEach((previousTime) => {
          const daysSinceLastReview = previousReviewFromToday(previousTime);
          const bucketIndex = Math.floor(daysSinceLastReview / 10);
          if (daysSinceLastReview >= 0 && bucketIndex < 10) {
            if (!card.is_new) {
              previousDays[bucketIndex] += 1; // Increment the count for that bucket
            }
          }
        });
      });
      break;

    case '1_year':
      previousDays = Array(12).fill(0); // 1 year divided into months
      cards.forEach((card) => {
        card.review_history.forEach((previousTime) => {
          const reviewDate = new Date(previousTime);
          const today = new Date();
          const monthDiff = today.getFullYear() - reviewDate.getFullYear();
          const monthIndex = monthDiff === 0 ? reviewDate.getMonth() : reviewDate.getMonth() + 12;
          
          // Only count reviews within the last year
          if (reviewDate <= today) {
            if (!card.is_new) {
              previousDays[monthIndex] += 1; // Increment the count for that month
            }
          }
        });
      });
      break;

    default:
      previousDays = Array(31).fill(0);
  }

  return previousDays;
};

const previousChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: { display: true, text: 'Previous Reviews', font: { size: 16 } },
    datalabels: { display: false },
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
    datalabels: {
      display: true, align: 'center', color: '#fff', // White
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
    x: {
      beginAtZero: true, stacked: true, display: false,
      ticks: {
        callback: function (value) {
          return value + "%";
        },
      },
    },
    y: { stacked: true, display: false },
  },
};

function HoverPopup({ children }) {
  return (
    <div className="absolute bg-white p-4 border border-gray-300 rounded shadow-lg z-50">
      <h1 className="font-bold">Markdown Preview:</h1>
      {children}
    </div>
  );
}

function Card({ card }) {
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (event) => {
    setIsHovered(true);
    // Get the position of the element to position the popup
    const { top, left, height } = event.currentTarget.getBoundingClientRect();
    setPopupPosition({ top: top + height + window.scrollY + 5, left: left });
  };
  
  const handleMouseLeave = () => setIsHovered(false);

  console.log(isHovered);
  return (
    <div className="max-w-92 h-52 border border-black p-4 rounded-lg bg-white shadow-sm flex flex-col justify-between text-black">
      {/* <h2 className="truncate font-bold text-xl" >Question:{card.question}</h2> */}
      <h2
        className="truncate text-xl cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <strong>Question: {card.question}</strong>
        
        {/* Hover Popup */}
        {isHovered && (
        <HoverPopup style={{ top: popupPosition.top, left: popupPosition.left }}>
          <MarkdownPreviewer content={card.question} />
        </HoverPopup>
        )}
      </h2>
      <p className="truncate"><strong>Next Review:</strong> {new Date(card.next_review).toLocaleDateString()}</p>
      <p className="truncate"><strong>Last Reviewed:</strong> {new Date(card.last_reviewed).toLocaleDateString()}</p>
      <p className="truncate"><strong>Bucket: </strong>{card.bucket}</p>
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
      className="p-2 border border-black rounded"
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

export default StatsPage