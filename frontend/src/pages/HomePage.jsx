import { useQuery } from "react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks";
import Sidebar from "../components/SideBar";
import ScrollContainer from "../components/ScrollContainer";
import LoadingSpinner from "../components/LoadingSpinner";
import QuestionMarkHoverHelp from "../components/QuestionMarkHoverHelp";

const todoTextList = [
  "This list shows you all decks containing cards that are up for review.",
  "Click on one of the deck names to go to the deck page.",
  'The "New" column lists cards that are new.',
  'The "Review" column lists cards that are up for review but have been reviewed at least once in the past.',
  'Click "Study All" to review all due cards.',
  'Click "Study" to review all due cards from a specific deck.'
]

function HomePage() {
  const [sidebarWidth, setSidebarWidth] = useState(250);

  return (
    <>
      <div className="flex w-full h-full">
        <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="flex flex-col flex-grow mt-10 overflow-x-auto items-center">
          <div className="mx-auto">
            {/* <h1 className="font-bold text-[2rem] mb-6 text-elDark border-b border-elDarkGray dark:text-edWhite dark:border-edDividerGray">Today's Task List</h1> */}
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
    const studyableDeckIds = decks
      .filter((deck) => {
        const newCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.is_new === true).length;
        const reviewCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.is_new === false && Date.parse(card.next_review) < Date.now()).length;
        return newCardsCount > 0 || reviewCardsCount > 0;
      })
      .map((deck) => deck.deck_id);

    console.log(studyableDeckIds)

    const deckIdsQueryParam = studyableDeckIds.join(',');

    if (studyableDeckIds.length > 0) {
      return (
        <div className="text-2xl text-left">
          <div className="flex justify-between items-center border-b border-elDarkGray dark:border-edDividerGray mb-4">
            <div className="flex items-center">
              <h1 className="font-bold text-[2rem] text-elDark dark:text-edWhite mr-4">
                Today's Task List
              </h1>
              <QuestionMarkHoverHelp title="TODO List" helpTextList={todoTextList} heightInRem={36} />
            </div>
            <Link to={`/review?deckIds=${deckIdsQueryParam}`}>
              <button className="mb-2 text-xl button-common">Study All</button>
            </Link>
          </div>
          <ul className="w-[80vw] sm:[75vw] md:w-[50vw] text-xs sm:text-sm lg:text-xl">
            <li className="overflow-y-auto flex font-semibold px-2 py-3 rounded-t-lg text-elCloudWhite bg-elLightBlue dark:bg-edDark dark:text-edWhite
          border-x border-t border-elLightBlue dark:border-edMedGray"
              style={{ scrollbarGutter: "stable" }}>
              <div className="w-[50%]">Deck</div>
              <div className="w-[17.5%]">New</div>
              <div className="w-[15%]">Review</div>
              <div className="w-[15%] mr-4"></div>
            </li>
            <ScrollContainer className="border-x border-b border-elDividerGray dark:border-edMedGray">
              {decks.map((deck) => {
                return <DeckRow key={deck.deck_id} deck={deck} cards={cards} />
              })}
            </ScrollContainer>
          </ul>
        </div >
      );
    } else {
      return (
        <>
          <div className="w-[80vw] sm:[75vw] md:w-[50vw] flex justify-between items-center border-b border-elDarkGray dark:border-edDividerGray mb-4">
            <h1 className="font-bold text-[2rem] text-elDark dark:text-edWhite">
              Today's Task List
            </h1>
          </div>
          <div className="mt-4 text-2xl">No more reviews for now!</div>
          <div className="mt-4 italic">Go to a deck or click "Create Card" in the header to add new cards</div>
        </>
      )
    }
  }
}

function DeckRow({ deck, cards }) {
  const newCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.is_new === true).length;
  const reviewCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.is_new === false && Date.parse(card.next_review) < Date.now()).length;

  if (newCardsCount === 0 && reviewCardsCount === 0) {
    return null;
  }

  return (
    <li className="flex px-2 py-2 text-elDark hover:bg-elStrongHLT dark:text-edWhite dark:hover:bg-edHLT dark:border-edDividerGray border-t">
      <div className="flex items-center w-[50%]">
        <Link to={`/decks/${deck.deck_id}`} className="hover:text-eBlue hover:text-elSkyBlue dark:hover:text-edLightBlue">{deck.name}</Link>
      </div>
      <div className="flex items-center w-[17.5%]">{newCardsCount}</div>
      <div className="flex items-center w-[15%]">{reviewCardsCount}</div>
      <Link to={`/review?deckIds=${deck.deck_id}`} className="button-common w-[15%] mr-4 py-1">
        Study
      </Link>
    </li >
  );
}

export default HomePage
