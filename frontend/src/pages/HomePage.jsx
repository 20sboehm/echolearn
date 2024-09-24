import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";
import ScrollContainer from "../components/ScrollContainer";
import { useApi } from "../hooks";
import LoadingSpinner from "../components/LoadingSpinner";

function TaskList() {
  const api = useApi();

  const { data: decks, isLoadingDecks, errorDecks } = useQuery({
    queryKey: ["decks"],
    queryFn: () =>
      api._get('/api/decks').then((response) => response.json()),
    onError: () => {
      console.log(`An error occurred fetching decks ${errorDecks.text}`)
    }
  })

  const { data: cards, isLoadingCards, errorCards } = useQuery({
    queryKey: ["cards"],
    queryFn: () =>
      api._get('/api/cards').then((response) => response.json()),
    onError: () => {
      console.log(`An error occurred fetching cards ${errorCards.text}`)
    }
  })

  if (isLoadingDecks || isLoadingCards) {
    return <LoadingSpinner />
  }

  if (decks && cards) {
    return (
      <div className="text-3xl text-left border border-eGray rounded-lg">
        <ul className="w-[50vw] p-2">
          <li className="grid grid-cols-9 gap-4 mb-2 text-eWhite border-b border-eGray p-2">
            <div className="col-span-3">Deck</div>
            <div className="col-span-2">New</div>
            <div className="col-span-2">Review</div>
          </li>
          <ScrollContainer className="border">
            {decks.map((deck) => {
              const newCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.is_new === true).length;
              const reviewCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.is_new === false && Date.parse(card.next_review) < Date.now()).length;

              if (newCardsCount === 0 && reviewCardsCount === 0) {
                return null;
              }

              return (
                <li key={deck.deck_id} className="grid grid-cols-9 gap-4 font-medium text-eWhite text-2xl px-2 py-5 hover:bg-eHLT">
                  <div className="col-span-3"> {/* Make the highlight only show up when hovering over the text itself, not the grid cell */}
                    <Link to={`/decks/${deck.deck_id}`} className="hover:text-eBlue hover:border-eBlue border p-2 rounded-md">{deck.name}</Link>
                  </div>
                  <div className="col-span-2">{newCardsCount}</div>
                  <div className="col-span-2">{reviewCardsCount}</div>
                  <div className="col-span-2">
                    <Link to={`/review/${deck.deck_id}`} className="rounded-lg border-2 px-4 py-2 border-eBlue text-eBlue
                     font-semibold bg-eDarker hover:border-eWhite hover:text-eWhite active:scale-[0.97] active:bg-[#333] 
                     active:border-[#555]"
                    //  style={{ transition: "border-color 0.10s, color 0.10s" }}
                    >
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
      <div className="flex">
        <div>
          <SideBar />
        </div>
        <div className="flex flex-col mt-10 ">
          <h1 className="font-bold text-[3em] italic mb-4">TO DO</h1>
          <TaskList />
        </div>
      </div>
    </>
  )
}

export default HomePage
