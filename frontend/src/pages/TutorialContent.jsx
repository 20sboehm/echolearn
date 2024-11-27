import React from "react"
import CreateCard from "../assets/CreateCard.png"
import Community from "../assets/Community.png"
import PublicView from "../assets/PublicDeckView.png"
import DeckPage from "../assets/DeckPage.png"
import HomePage from "../assets/TO-DOList.png"
import Sidebar from "../assets/Sidebar.png"

function TutorialContent({ topic }) {

  switch (topic) {
    case "Card Creation":
      return (
        <div className="text-white overflow-y-auto max-h-screen">
          <h2 className="text-2xl font-bold mb-4">Card Creation</h2>
          <p className="text-lg">In the header, you'll see a "Create Card" option, which will take you to this page.</p>
          <img src={CreateCard} className="w-[400px] h-auto max-h-[80vh] overflow-y-auto" />
          <p className="text-lg mt-4">
            This page is our Markdown editor, allowing you to design your cards exactly how you want.
            There are two sections: one for the question and one for the answer. Each follow with two view.
            In the top view, you can type Markdown, use the tools to assist with formatting, or with hotkeys to quickly insert markdown.
            The bottom view will display a live preview of how the Markdown will appear on your card.
          </p>
          <p className="text-lg mt-2">
            Additionally, there are four options at the top of the page to help you create cards:
            you can import decks from Quizlet or Anki, let AI generate cards for you, or create multiple cards at once.
            Each option includes detailed instructions on the page to guide you through the process.
          </p>
        </div>
      );
    case "Community":
      return (
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">Community</h2>
          <p className="text-lg">In the header, you'll find a "Community" option that leads to this page.</p>
          <img src={Community} className="w-[400px] h-auto max-h-[80vh] overflow-y-auto" />
          <p className="text-lg mt-4">
            This page showcases all public decks. At the top, you can use the search bar to find topics of interest.
            Each public deck displays details such as the deck name, description, author, rating, and number of favorites.
            You can click on the author's name to visit their profile page or select the right-facing arrow to view the deck details.
          </p>
          <p className="text-lg mt-4">On the deck details page, you can study the deck directly or copy it to your library if you wish.</p>
          <img src={PublicView} className="w-[400px] h-auto max-h-[80vh] overflow-y-auto" />
        </div>
      );
    case "Deck Page":
      return (
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">Deck Page</h2>
          <p className="text-lg">This is likly what you will be seeing when you navigate into a deck.</p>
          <img src={DeckPage} className="w-[500px] h-auto max-h-[80vh] overflow-y-auto" />
          <p className="text-lg mt-4">
            The "Study (N)" button will review all the cards that are due for review.
            The "Study All" button lets you review all the cards in the deck.
          </p>
          <p className="text-lg mt-4">You can also click the "Quiz" button to test yourself. The "Statistics" button will navigate you to a page showing deck statistics, where you can view the number of upcoming/previous reviews and your correct review rate.</p>
          <p className="text-lg mt-4">The "Edit All" button will take you to an edit page where you can update all the cards in the deck at once. Alternatively, you can click the edit icon on each card to edit them individually.</p>
          <p className="text-lg mt-4">The "Public/Private" setting indicates whether your deck is public (available to the community) or private.</p>
          <p className="text-lg mt-4">The bar graph displays the percentage of cards you are caught up on.</p>
        </div>
      );
    case "Home Page":
      return (
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">Home Page</h2>
          <p className="text-lg">
            Once you log in, you will be directed to the home page. The home page contains a Task List that shows the number of cards you need to review for each deck.
            "New" indicates how many cards you haven't studied yet, while "Review" shows the number of cards that are due for review.
          </p>
          <img src={HomePage} className="w-[500px] h-auto max-h-[80vh] overflow-y-auto" />
          <p className="text-lg mt-4">You can click on a deck name to navigate to its deck page. Alternatively, you can click the "Study" button to start studying that deck right away.</p>
          <p className="text-lg">If you want to review all the decks in your Task List, you can click the "Study All" button.</p>
        </div>
      );
    case "Sidebar":
      return (
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
          <p className="text-lg">This is the sidebar, you will see on most of the page</p>
          <img src={Sidebar} className="w-[250px] h-auto max-h-[80vh] overflow-y-auto" />
          <p className="text-lg mt-2">
            The sidebar displays all the folders you have created, making it easy to access a deck by clicking on it.
            You can create, rename, or delete folders and decks by right-clicking on them or by using the "Create Folder" and "Create Deck" buttons at the top.
            To use these options, you must first select a folder, which will be highlighted in gray when selected.
          </p>
          <p className="text-lg mt-2">
            An "Expand and Collapse" button is available at the top, allowing you to expand all your folders with one click and collapse them with another.
            Additionally, when you hover over the sidebar's border, it turns blue, indicating that you can drag it to adjust its width.
          </p>
          <p className="text-lg mt-2">A "Close Sidebar" button, represented by a left arrow, is located at the top right of the sidebar. Clicking it will hide the sidebar, and clicking again will reopen it.</p>
        </div>
      );
  }
}

export default TutorialContent