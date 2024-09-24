import { useState } from "react";
import TODOImg from "../assets/TO-DOList.png"
import CCardImg from "../assets/CreateCard.png"
import CDeckImg from "../assets/CreateDeck.png"
import CFolderImg from "../assets/CreateFolder.png"
import SidebarImg from "../assets/Sidebar.png"
import DeckViewImg from "../assets/DeckPage.png"
import ReviewViewImg from "../assets/ReviewPage.png"
import SpaceRepeImg from "../assets/growth.png"
const topics = [
  {
    title: "TO DO list",
    guide: "On the home page, the TO-DO list will show which decks need review, the number of cards you haven't reviewed, and the cards that need to be reviewed again. You can easily start reviewing by clicking the 'Review' button or access the deck page by clicking on the deck name.",
    image: TODOImg,
  },
  {
    title: "Create Folder",
    guide: "On the create folder page, type in the desired folder name and press 'Submit' to create the folder.",
    image: CFolderImg,
  },
  {
    title: "Create Deck",
    guide: "On the create deck page, enter a name for the deck. The description is optional, but you must select a folder you have created to proceed with creating the deck.",
    image: CDeckImg,
  },
  {
    title: "Create Card",
    guide: "The create card page provides two online editors. In these editors, you can bold, italicize, underline text, and enter LaTeX. Additionally, you can insert images, videos, or website URLs into the cards. You also need to select a deck to which the card will be added.",
    image: CCardImg,
  },
  {
    title: "Multi Card Creation",
    guide: "{Will be fill when multi card input is done}",
    image: "",
  },
  {
    title: "Sidebar",
    guide: "The sidebar displays all the folders you have created, and you can access a deck by clicking on it. You can also create, rename, or delete folders and decks by right-clicking or clicking on the three dots on the right.",
    image: SidebarImg,
  },
  {
    title: "Deck page",
    guide: "On the deck page, the top section displays the deck name followed by a 'Review' button, which takes you to the review page. The graph on the right shows your mastery level, and you can click 'More Statistics' to view additional data. At the bottom, all the cards in the deck are displayed. You can click the edit button in the top corner of a card to edit the card. Clicking the 'Delete' button activates delete mode, allowing you to delete the cards you want.",
    image: DeckViewImg,
  },
  {
    title: "Review page",
    guide: "The review page will only shows the cards that you need to review. On the top right you can choice what animation you like to use to review, question set or flashcard. When you reveal the answer it will show up 4 choice ask you how confident you feel you know the question, each choice will follow with a time, telling you when will be your next review time for the card. ",
    image: ReviewViewImg,
  },
  {
    title: "Space repetition",
    guide: "Spaced repetition is a learning technique that involves reviewing information at increasing intervals over time, which helps strengthen your recall and makes it easier to retain the information for longer periods.",
    image: SpaceRepeImg,
  },
  {
    title: "Import Quizlet or Anki",
    guide: "{will be fill after import is done}",
    image: "",
  },
];

const cardsData = [
  { top: "10vh", left: "10vw", width: "15%", height: "15%" }, // "TO DO"
  { top: "33vh", left: "3vw", width: "12%", height: "12%" }, // "Create Folder"
  { top: "70vh", left: "0vw", width: "18%", height: "18%" },  // "Create Deck"
  { top: "65vh", left: "27vw", width: "20%", height: "20%" }, // "Create Card"
  { top: "5vh", left: "48vw", width: "20%", height: "20%" }, // "Multi Card Creation"
  { top: "13vh", left: "32vw", width: "15%", height: "15%" }, // "sidebar"
  { top: "48vh", left: "40vw", width: "12%", height: "12%" }, // "Deck Page"
  { top: "70vh", left: "47vw", width: "22%", height: "22%" }, // "Study Page"
  { top: "37vh", left: "18vw", width: "25%", height: "25%" }, // "Space reptition"
  { top: "33vh", left: "54vw", width: "17%", height: "17%" }, // "Import Quizlet or Anki"
];

function HelpPage() {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCardClick = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(topic);
    }
  };

  const calculateTransform = (index) => {
    const card = cardsData[index];
    // Calculate the percentage-based translation
    const translateX = `calc(0vw - ${card.left})`;
    const translateY = `calc(0vh - ${card.top})`;

    return `translate(${translateX}, ${translateY})`;
  };

  return (
    <div className="flex w-screen h-[calc(100vh-4rem)]">

      <div className="w-1/3 p-4 overflow-y-auto">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full p-2 border rounded bg-[#151515]"
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
              width: selectedTopic === topic ? '100%' : cardsData[index].width,
              height: selectedTopic === topic ? '100%' : cardsData[index].height,
            }}
            className={`bg-white text-black absolute p-4 border rounded transition-transform duration-300 ease-in-out ${selectedTopic === topic ? 'shadow-xl' : ''
              } ${cardsData[index].width} flex flex-col items-center`}
            onClick={() => handleCardClick(topic)}
          >
            <h2 className="text-2xl font-bold mb-4">{topic.title}</h2>
            {selectedTopic === topic && <p className="mt-2">{topic.guide}</p>}
            {selectedTopic === topic && <img src={topic.image} alt={topic.title} className="mt-4 mx-auto max-w-full h-auto overflow-y-auto" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpPage