import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";
import Sidebar from "./SideBar";

const dummyData = {
  "deck_id": 1,
  "deck_name": "Deck Title",
  "cards": [
    {
      "card_id": 1,
      "question": "What is Hello World",
      "answer": "Everything",
    },
    {
      "card_id": 2,
      "question": "What is our project name",
      "answer": "EchoLearn",
    }
  ]
}

function DeckPage() {
  const { deckId } = useParams();
  return (
    <>
      <Sidebar />
      <div className="flex flex-col">
        <h1 className="">{dummyData.deck_name}</h1>
        <Link to={`/review/${deckId}`} className="rounded-lg border border-transparent px-4 py-2 font-semibold bg-[#1a1a1a]">
          <button>Study</button>
        </Link>
      </div>

      <div>
          {dummyData.cards.map(card => (
            <div className="grid grid-cols-2 gap-4 font-medium" key={card.card_id}>
              <p className="border bg-white text-black mt-2 px-2 py-2">{card.question}</p>
              <p className="border bg-white text-black mt-2 px-2 py-2">{card.answer}</p>
            </div>
          ))}
      </div>
      <p>At the deck page of id: {deckId}</p>
    </>
  )
}


export default DeckPage