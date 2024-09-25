import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";
import ScrollContainer from "../components/ScrollContainer";
import { useApi } from "../hooks";
import LoadingSpinner from "../components/LoadingSpinner";

function HomePage() {
  return (
    <>
      <div className="flex">
        <div>
          <SideBar />
        </div>
        <div className="flex flex-col mt-10 ">
          <h1 className="font-bold text-[2rem] mb-6 border-b border-edMedGray">Today</h1>
          <TaskList />
        </div>
      </div>
    </>
  )
}

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
      <div className="text-2xl text-left border border-edMedGray rounded-md">
        <ul className="w-[80vw] sm:[75vw] md:w-[50vw] text-xs sm:text-sm lg:text-xl">
          <li className="flex font-semibold border-edGray px-2 py-3 rounded-t-lg bg-elCloudWhite dark:bg-edDark">
            <div className="w-[55%]">Deck</div>
            <div className="w-[15%]">New</div>
            <div className="w-[15%]">Review</div>
          </li>
          <ScrollContainer className="border">
            {decks.map((deck) => {
              return <DeckRow key={deck.deck_id} deck={deck} cards={cards} />
            })}
          </ScrollContainer>
        </ul>
      </div>
    );
  }
}

function DeckRow({ deck, cards }) {
  const newCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.is_new === true).length;
  const reviewCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.is_new === false && Date.parse(card.next_review) < Date.now()).length;

  if (newCardsCount === 0 && reviewCardsCount === 0) {
    return null;
  }

  return (
    <li className="flex px-2 py-2 hover:bg-edHLT border-edMedGray border-t">
      <div className="flex items-center w-[55%]">
        <Link to={`/decks/${deck.deck_id}`} className="hover:text-edBlue hover:border-edBlue">{deck.name}</Link>
      </div>
      <div className="flex items-center w-[15%]">{newCardsCount}</div>
      <div className="flex items-center w-[15%]">{reviewCardsCount}</div>
      <div className="flex justify-center items-center w-[15%]">
        <Link to={`/review/${deck.deck_id}`} className="block rounded-sm sm:rounded-lg border-2 px-1 py-0.5 sm:px-3 sm:py-1 text-center font-medium active:scale-[0.97]
                  bg-elBlue dark:bg-edDarker text-elBase dark:text-edBlue border-edBlue hover:bg-elHLT dark:hover:border-edWhite hover:text-elBlack dark:hover:text-edWhite"
        >
          Review
        </Link>
      </div>
    </li>
  );
}

export default HomePage
