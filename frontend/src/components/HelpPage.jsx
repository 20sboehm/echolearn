import { useState, useEffect } from "react";
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

function HelpPage() {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(2); // Index for focused card
  const [scrollThreshold, setScrollThreshold] = useState(0);
  const [scale, setScale] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  const SCROLL_SENSITIVITY = 30; // How much scroll distance is needed to trigger index change
  const SPACE_BETWEEN_CARDS = 90; // Adjust this value to space out cards more
  const VISIBLE_CARDS = 5;

  const handleWheel = (e) => {
    // Prevent scrolling if a card is expanded
    if (isExpanded) {
      e.preventDefault(); // Prevent the default page scroll
      return;
    }

    setScrollThreshold((prevThreshold) => {
      const newThreshold = prevThreshold + e.deltaY;
      if (newThreshold > SCROLL_SENSITIVITY) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % topics.length); // Wrap around to the first card
        return 0;
      }

      if (newThreshold < -SCROLL_SENSITIVITY) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + topics.length) % topics.length); // Wrap around to the last card
        return 0;
      }
      return newThreshold; // Update threshold without changing the index
    });
    e.preventDefault();
  };

  const handleCardClick = (index) => {
    if (selectedTopic === topics[index]) {
      setScale(1);
      setSelectedTopic(null);
      setIsExpanded(false);
    } else {
      setCurrentIndex(index);
      setSelectedTopic(topics[index]);
      setScale(1.1);
      setIsExpanded(true);
      setTimeout(() => { setScale(1); }, 200);
    }
  };

  const calculateCardStyle = (positionFromCenter, isSelected) => {
    const baseScale = 1 - Math.abs(positionFromCenter) * 0.12; // Base scale based on position from center
    const zoomInScale = isSelected ? scale : baseScale * 0.8; // Use the scale state for the selected card
    const translateY = positionFromCenter * SPACE_BETWEEN_CARDS; // Control space between cards

    return {
      transform: `translateY(${translateY}px) scale(${zoomInScale})`,
      opacity: zoomInScale > 0.6 ? zoomInScale : 0.6,
      transition: "transform 0.5s ease, opacity 0.5s ease",
      zIndex: Math.round(zoomInScale * 10),
    };
  };

  useEffect(() => {
    // Attach the wheel event to allow scrolling between cards
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentIndex, isExpanded]);

  return (
    <div className="flex w-screen h-[calc(100vh-4rem)] relative">
      {/* Search Input */}
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
            <li
              key={index}
              className={`p-2 border-b ${selectedTopic === topic ? "bg-gray-600" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              {topic.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Vertical 3D Card Stack */}
      <div className="w-2/3 h-[calc(100vh-4rem)] p-4 flex items-center justify-center relative overflow-hidden">
        {Array.from({ length: VISIBLE_CARDS * 2 + 1 }).map((_, i) => {
          const index = (currentIndex + i - VISIBLE_CARDS + topics.length) % topics.length;
          const positionFromCenter = i - VISIBLE_CARDS;
          const isSelected = selectedTopic === topics[index];

          return (
            <div
              key={index}
              style={calculateCardStyle(positionFromCenter, isSelected)} // Pass isSelected to calculate card style
              className={`absolute w-full p-4 bg-white text-black border rounded flex flex-col items-center ${isSelected ? "shadow-xl h-[90vh]" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              <h2 className="text-2xl font-bold mb-4">{topics[index].title}</h2>
              <p className="mt-2">
                {isSelected
                  ? topics[index].guide
                  : `${topics[index].guide.substring(0, 80)}...`}
              </p>
              {isSelected && (
                <img
                  src={topics[index].image}
                  alt={topics[index].title}
                  className="mt-4 mx-auto max-w-full h-auto overflow-y-auto"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HelpPage;
