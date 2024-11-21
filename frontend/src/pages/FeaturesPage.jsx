import { useState } from "react";
import './FeaturesPage.css';

const cardCSS = "flex flex-col items-center justify-center bg-white text-black rounded-lg shadow-2xl p-6"

const featureCards = [
  {
    picture: "📝",
    title: "Spaced repetition",
    description: "Spaced repetition is a technique where you review information at increasing intervals to retain knowledge in long-term memory."
    // "Space repetition is effective memorize algorithm that Echolearn use to help you gain long-term recall",
  },
  {
    picture: "📥",
    title: "Import Quizlet or Anki decks",
    description: "User can easily import Quizlet or Anki deck to generate Echolearn decks",
  },
  {
    picture: "🎥",
    title: "Image or video cards",
    description: "When creating cards user can import picture or video to the cards",
  },
  {
    picture: "🎙️",
    title: "Voice input and output",
    description: "User also can use there speak to input text and Echolearn provided voice output for mulit-language",
  },
  {
    picture: "📁",
    title: "Folder hierarchy",
    description: "Echolearn provided sidebar for user to easily organize their folders and decks",
  },
  {
    picture: "📧",
    title: "Email reminder",
    description: "Daily reminder if there is cards to review and can close anytime",
  },
]

function FeaturePage() {
  const [flippedIndex, setFlippedIndex] = useState(null);

  const handleCardClick = (index) => {
    setFlippedIndex(index === flippedIndex ? null : index);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full h-screen bg-featureBackground text-white">
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold">FEATURES</h1>
          <p className="text-xl mt-2">Overview of our key features. Make Echolearn your next memory.</p>
        </div>

        <div className="w-4/5 text-gray-800 rounded-lg mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[70vh]">
            {featureCards.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6" onClick={() => handleCardClick(index)}>
                <div className={`flipCard ${flippedIndex === index ? 'flipped' : ''}`}>
                  <div className="cardInner">
                    <div className={`cardFront ${cardCSS}`}>
                      <div className="text-4xl mb-4">{feature.picture}</div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    </div>
                    <div className={`cardBack ${cardCSS}`}>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

export default FeaturePage