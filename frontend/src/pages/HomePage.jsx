import { useQuery } from "react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/SideBar";
import ScrollContainer from "../components/ScrollContainer";
import { useApi } from "../hooks";
import LoadingSpinner from "../components/LoadingSpinner";

function HomePage() {
  const [sidebarWidth, setSidebarWidth] = useState(250);

  return (
    <>
      <div className="flex w-full h-full">
        <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="flex flex-col flex-grow mt-10 overflow-x-auto items-center">
          <div className="mx-auto">
            <h1 className="font-bold text-[2rem] mb-6 text-elDark border-b border-elDarkGray dark:text-edWhite dark:border-edMedGray">Today's Task List</h1>
            <TaskList />
          </div>
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
          <li className="flex font-semibold border-eGray px-2 py-3 rounded-t-lg text-elCloudWhite bg-elLightBlue dark:bg-edDark dark:text-edWhite">
            <div className="w-[45%]">Deck</div>
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
    <li className="flex px-2 py-2 text-elDark hover:bg-elStrongHLT dark:text-edWhite dark:hover:bg-edHLT dark:border-edMedGray border-t">
      <div className="flex items-center w-[45%]">
        <Link to={`/decks/${deck.deck_id}`} className="hover:text-eBlue hover:border-eBlue">{deck.name}</Link>
      </div>
      <div className="flex items-center w-[15%]">{newCardsCount}</div>
      <div className="flex items-center w-[15%]">{reviewCardsCount}</div>
      <div className="flex justify-center items-center w-[15%]">
        {/*         <Link to={`/review/${deck.deck_id}`} className="block rounded-sm sm:rounded-lg px-1 py-0.5 sm:px-4 sm:py-1.5 text-center font-normal
                  bg-eBlue text-eWhite hover:bg-eLightBlue"
        > */}
        <Link to={`/review/${deck.deck_id}`} className="block rounded-sm sm:rounded-lg border-2 ml-8 mr-4 px-1 py-0.5 sm:px-3 sm:py-1 text-center font-medium active:scale-[0.97]
                  text-elDark border-elDarkGray hover:border-elLightBlue hover:text-elLightBlue dark:bg-edDarker dark:text-edBlue dark:border-edBlue dark:hover:border-edWhite dark:hover:text-edWhite">
          Review
        </Link>
        <Link to={`/review/${deck.deck_id}?studyAll=true`} className="block rounded-sm sm:rounded-lg border-2 px-1 py-0.5 sm:px-3 sm:py-1 text-center font-medium active:scale-[0.97]
                  text-elDark border-elDarkGray hover:border-elLightBlue hover:text-elLightBlue dark:bg-edDarker dark:text-edBlue dark:border-edBlue dark:hover:border-edWhite dark:hover:text-edWhite">
          ReviewAll
        </Link>
      </div>
    </li>
  );
}

export default HomePage
