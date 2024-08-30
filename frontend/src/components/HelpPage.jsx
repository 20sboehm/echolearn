import { useState } from "react";
const topics = [
  { 
    title: "TO DO list",
    guide: "On the home page, the TO-DO list will show which decks need review, the number of cards you haven't reviewed, and the cards that need to be reviewed again. You can easily start reviewing by clicking the 'Review' button or access the deck page by clicking on the deck name."
  },
  { 
    title: "Create Folder", 
    guide: "the"
  },
  { 
    title: "Create Deck", 
    guide: "the" 
  },
  { 
    title: "Create Card", 
    guide: "the" 
  },
  { 
    title: "Sidebar", 
    guide: "the" 
  },
  { 
    title: "How to study", 
    guide: "the" 
  },
];

const cardsData = [
  { top: "10vh", left: "10vw", width: "15%", height: "15%" }, // "TO DO"
  { top: "33vh", left: "50vw", width: "13%", height: "13%" }, // "Create Folder"
  { top: "70vh", left: "0vw", width: "18%", height: "18%" },  // "Create Deck"
  { top: "40vh", left: "20vw", width: "20%", height: "20%" }, // "Create Card"
  { top: "10vh", left: "33vw", width: "15%", height: "15%" }, // "sidebar"
  { top: "70vh", left: "47vw", width: "22%", height: "22%" }, // "how to study"
];

function HelpPage() {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  const calculateTransform = (index) => {
    const card = cardsData[index];
    // Calculate the percentage-based translation
    const translateX = `calc(5vw - ${card.left})`;
    const translateY = `calc(5vh - ${card.top})`;

    return `translate(${translateX}, ${translateY})`;
  };

  return (
    <div className="flex w-full h-screen">

      <div className="w-1/3 p-4 overflow-y-auto">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="mt-4">
          {filteredTopics.map((topic, index) => (
            <li key={index} className={`p-2 border-b ${selectedTopic === topic ? 'bg-gray-600' : ''
              }`}
              onClick={() => setSelectedTopic(topic)}>
              {topic.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 p-4 relative overflow-hidden">
        {topics.map((topic, index) => (
          <div
            key={index}
            style={{
              top: cardsData[index].top,
              left: cardsData[index].left,
              transform: selectedTopic === topic ? calculateTransform(index) : 'none',
              transition: 'transform .8s ease, width .8s ease, height .8s ease',
              zIndex: selectedTopic === topic ? 10 : 1,
              width: selectedTopic === topic ? '85%' : cardsData[index].width,
              height: selectedTopic === topic ? '85%' : cardsData[index].height,
            }}
            className={`bg-white text-black absolute p-4 border rounded transition-transform duration-300 ease-in-out ${selectedTopic === topic ? 'shadow-xl' : ''
              } ${cardsData[index].width} flex flex-col items-center`}
            onClick={() => setSelectedTopic(topic)}
          >
            <h2 className="text-2xl font-bold mb-4">{topic.title}</h2>
            {selectedTopic === topic && <p className="mt-2">{topic.guide}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpPage