import { useQuery } from "react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SideBar from "./SideBar";
import ScrollContainer from "./ScrollContainer";

function TaskList() {
  const { data: decks, isLoadingDecks, errorDecks } = useQuery({
    queryKey: ["decks"],
    queryFn: () =>
      fetch(`http://127.0.0.1:8000/api/decks`).then((response) =>
        response.json()
      ),
    onError: () => {
      console.log(`An error occurred fetching decks ${errorDecks.text}`)
    }
  })

  const { data: cards, isLoadingCards, errorCards } = useQuery({
    queryKey: ["cards"],
    queryFn: () =>
      fetch(`http://127.0.0.1:8000/api/cards`).then((response) =>
        response.json()
      ),
    onError: () => {
      console.log(`An error occurred fetching cards ${errorCards.text}`)
    }
  })

  if (decks && cards) {
    return (
      <div className="text-3xl text-left border border-gray-400 rounded-lg">
        <ul className="w-[50vw] p-2">
          <li className="grid grid-cols-4 gap-4 mb-2 text-gray-300 border-b border-gray-400 p-2">
            <div className="">Deck</div>
            <div>New</div>
            <div>Review</div>
          </li>
          <ScrollContainer className="border">
            {decks.map((deck) => {
              const newCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.created_at === card.last_reviewed).length;
              const reviewCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.created_at !== card.last_reviewed && Date.parse(card.next_review) < Date.now()).length;
              
              if (newCardsCount === 0 && reviewCardsCount === 0) {
                return null;
              }

              return (
                <li key={deck.deck_id} className="grid grid-cols-4 gap-4 font-medium text-gray-400 text-2xl px-2 py-5">
                  <div className="">{deck.name}</div>
                  <div>{newCardsCount}</div>
                  <div>{reviewCardsCount}</div>
                  <div>
                    <Link to={`/review/${deck.deck_id}`} className="rounded-lg border border-transparent px-4 py-2 
                     font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
                     active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>
                      <button>Review</button>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ScrollContainer>
        </ul>
      </div>
    );
  }
}

function HomePage() {
  return (
    <>
      <div className="mt-10">
        <SideBar />
        <h1 className=" font-bold text-[3em] italic mb-4">TO DO</h1>
        <TaskList />
      </div>
    </>
  )
}

export default HomePage
