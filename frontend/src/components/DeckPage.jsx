import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";
import Sidebar from "./SideBar";

function DeckPage() {
  const [deleteMode, setDeleteMode] = useState(false);
  const { deckId } = useParams();


  // Fetch reviews info
  const { data: deckCards, isLoading, error, refetch } = useQuery({
    queryFn: () =>
      fetch(`http://localhost:8000/api/decks/${deckId}/cards`).then((response) =>
        response.json()
      ),
  });

  // Refetch data whenever the deckId changes
  useEffect(() => {
    refetch();
  }, [deckId, refetch]);

  useEffect(() => {
    console.log("Deck Cards:", deckCards);
  }, [deckCards]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let reviewedCardsCount = 0;
  // Check if 'cards' property exists and is an array
  if (deckCards.cards && Array.isArray(deckCards.cards)) {
    reviewedCardsCount = deckCards.cards.filter(card => !card.is_new || (card.next_review && Date.parse(card.next_review) >= Date.now())).length;
  }

  const totalCardsCount = deckCards.cards.length; // Total number of cards in the deck

  // Calculate the percentage of cards that don't need review
  const percentage = totalCardsCount > 0 ? ((reviewedCardsCount / totalCardsCount) * 100).toFixed(2) : 100;

  const radius = 60;

  // Calculate the circumference of the circle
  const circumference = Math.PI * 2 * radius;

  // Calculate the length of the dash
  const dashLength = (percentage / 100) * circumference;

  // Calculate the length of the gap
  const gapLength = circumference - dashLength;

  const strokeDashoffset = circumference / 4;


  const changeMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleCardClick = async (cardId) => {
    if (deleteMode) {
      try {
        const response = await fetch(`http://localhost:8000/api/cards/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete card');
        }
        console.log("Deleted card with ID:", cardId);
        refetch();
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="w-[65vw]">
        <div className="flex flex-row">
          <div className="flex flex-col ">
            <h1 className="text-4xl font-bold my-4">{deckCards.deck_name}</h1>
            <Link to={`/review/${deckId}`} className="rounded-lg border border-transparent px-[100px] py-2 
              font-semibold bg-blue-500 hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
              active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s"}}>
              <button>Study</button>
            </Link>
          </div>

          <div className="flex flex-col ml-auto justify-center items-center mb-4">
            {/* JavaScript code to draw the graph */}
            <svg width="200" height="200" viewBox="0 20 200 150">
              <circle cx="100" cy="100" r={radius} fill="none" stroke="#ECEFF1" strokeWidth="7.5" />
              <circle cx="100" cy="100" r={radius} fill="none" stroke="#29A5DC" strokeWidth="7.5" strokeLinecap="round"
                      strokeDasharray={`${dashLength},${gapLength}`} strokeDashoffset={strokeDashoffset}>
                <title>Progress</title>
              </circle>
              <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16">
                {percentage}%
              </text>
            </svg>
            <button className="rounded-lg border border-transparent px-4 py-2 
              font-semibold bg-blue-500 hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
              active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s"}}>
                More Statistics</button>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between mt-2">
          <h1>Cards In This Deck ({deckCards.cards.length})</h1>
          <button className="rounded-lg border border-transparent px-2 py-1 
              font-semibold bg-blue-500 hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
              active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s"}} onClick={changeMode}>
                {deleteMode ? "Cancel" : "Delete"}</button>
        </div>

        <div className="h-[50vh] overflow-y-auto">
          {deckCards.cards.map(card => (
            <div className="grid grid-cols-2 gap-4 font-medium px-2" key={card.card_id}>
              <p className="border bg-white text-black mt-2 px-2 py-2" onClick={() => handleCardClick(card.card_id)}>{card.question}</p>
              <div className="border bg-white text-black mt-2 px-2 py-2 relative" onClick={() => handleCardClick(card.card_id)}>
                <p>{card.answer}</p>
                <Link to={`/edit/${card.card_id}`}>
                  <img src="../public/Edit_icon.png" alt="Edit_Icon" className="absolute top-0 right-0 h-6 w-8" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}


export default DeckPage