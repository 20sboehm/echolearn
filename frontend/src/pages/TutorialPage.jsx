import { useState } from "react";
import TutorialContent from "./TutorialContent";

const Topics = ["Home Page", "Card Creation", "Deck Page", "Sidebar", "Community"]

function TutorialPage() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  return (
    <>
      <div className="flex w-full h-screen bg-featureBackground">
        {/* left nav */}
        <div className="w-1/6 px-10 pt-2 h-full border-r-2 border-blue-200">
          <div className="w-[80%]">
            <ul className="space-y-2">
              {Topics.map((topic, index) => (
                <li key={index} className={`text-lg ${selectedTopic === topic ? "text-yellow-300 font-bold" : "text-gray-700 hover:text-blue-500"}`} onClick={() => setSelectedTopic(topic)}>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-6">
          {selectedTopic ? (
            <TutorialContent topic={selectedTopic} />
          ) : (
            <>
              <h1 className="text-3xl text-white font-bold">Welcome to the Tutorial Page</h1>
              <p className="mt-4 text-lg text-white">Select a topic from the left to learn more about it.</p>
              <p className="text-lg text-white mt-2">We also have small question icons that you can hover over to display helpful tips about the page you're on, available once you're logged in.</p>
              <p className="text-lg text-white mt-2">Additionally, there's a help page in the header, also accessible after you log in, that explains the functionality of each page.</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default TutorialPage