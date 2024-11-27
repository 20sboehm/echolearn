import React from "react"
import CreateCard from "../assets/CreateCard.png"

function TutorialContent({ topic }) {

  switch (topic) {
    case "Card Creation":
      return (
        <div className="text-white overflow-y-auto max-h-screen">
          <h2 className="text-2xl font-bold mb-4">Card Creation</h2>
          <p className="text-lg">
            Learn how to create and manage your flashcards effectively in this section.
          </p>
          <img src={CreateCard} className="mx-auto max-w-full h-auto max-h-[80vh] overflow-y-auto"/>
        </div>
      );
    case "Community":
      return (
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">Community</h2>
          <p className="text-lg">
            Discover how to connect with others, share decks, and participate in discussions.
          </p>
        </div>
      );
    case "Deck Page":
      return (
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">Deck Page</h2>
          <p className="text-lg">
            Explore how to navigate and customize your decks on the Deck Page.
          </p>
        </div>
      );
    case "Review Page":
      return (
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">Review Page</h2>
          <p className="text-lg">
            Understand how to review your cards using our spaced repetition system.
          </p>
        </div>
      );
    case "Sidebar":
      return (
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
          <p className="text-lg">
            Learn how to utilize the sidebar for quick navigation and easy access to features.
          </p>
        </div>
      );
  }
}

export default TutorialContent
