import { useState, useEffect } from "react";
import TODOImg from "../assets/TO-DOList.png"
import CCardImg from "../assets/CreateCard.png"
import MarkdownImg from "../assets/Markdown.png"
import CommunityImg from "../assets/Community.png"
import SidebarImg from "../assets/Sidebar.png"
import DeckViewImg from "../assets/DeckPage.png"
import ReviewViewImg from "../assets/ReviewPage.png"
import SpaceRepeImg from "../assets/growth.png"
import ProfileImg from "../assets/Profile.png"
import CopyImg from "../assets/CopyDeck.png"
import AnkiImg from '../assets/Anki.png'
import MulitInputImg from '../assets/MultiInput.png'

const topics = [
  {
    title: "Task List",
    guide: "On the home page, the Task List shows decks needing review, the number of unreviewed cards, and cards due for a follow-up review. Start a review by clicking 'Study' or access the deck page by clicking the deck name. In the upper right, the 'Study All' option lets you study all decks listed in the Task List.",
    image: TODOImg,
  },
  {
    title: "Community",
    guide: "The Community page displays all the public decks shared within our community. You can click on the author's name to view their profile. Additionally, clicking the right curved arrow will show you the details of the deck where you can copy the deck into your library.",
    image: CommunityImg,
  },
  {
    title: "Copy Deck",
    guide: "After clicking the curved arrow on the Community page, you can either click the heart icon to favorite the deck or select the 'Copy Deck' button. This will display all your folders, prompting you to choose the folder which you want to copy the deck.",
    image: CopyImg,
  },
  {
    title: "Profile Page",
    guide: "On the Profile page, you can change your name, email, age, and country. At the bottom, there are tabs that allow you to switch between your folders, favorite decks, and friends. Finally, on the right, you can modify your account settings.",
    image: ProfileImg,
  },
  {
    title: "Create Card",
    guide: "The Create Card page offers two markdown editors where you can format text with bold, italics, underlining, LaTeX, and more. You can also add images, videos, or website URLs to your cards. At the top, the 'quizlet parser' will direct you to a page where you can upload your existing Quizlet decks. Please select a deck to which the card will be added before creating.",
    image: CCardImg,
  },
  {
    title: "Multi Card Creation",
    guide: "{Will be fill when multi card input is done}",
    image: AnkiImg,
  },
  {
    title: "Simple Markdown Tutorial",
    guide: [
      "Bold: **<text>**",
      "Italic: *<text>>*",
      "Underline: __<text>__",
      "Code snippet: `code`",
      "Page break: ---",
      "Image Links: ![alt](url)",
      "Links: [text](url)",
      "Header 1: #<text>",
      "Header 2: ##<text>",
    ],
    format: "list",
    image: MarkdownImg,
  },
  {
    title: "Sidebar",
    guide: "The sidebar displays all the folders you have created, allowing you to access a deck by clicking on it. You can create, rename, or delete folders and decks by right-clicking, or by using the 'Create Folder' and 'Create Deck' buttons at the top. To do this, you need to select a folder first. There is also an 'Expand and Collapse' button at the top to expand all your folders with one click, and collapse them with another. When you hover over the border, it will turn blue, indicating that you can drag to adjust the width of the sidebar. Additionally, a close sidebar button (represented as a left arrow) is available on the top right to close the sidebar.",
    image: SidebarImg,
  },
  {
    title: "Deck Page",
    guide: "On the Deck Page, the top section displays the deck name, followed by buttons for 'Study' and 'Study All,' which take you to the review page. The 'Quiz' button leads you to the quiz page, while 'Statistics' takes you to the statistics page, which shows additional data about your deck. The 'Public/Private' indicator shows whether your current deck is public or private to the community. The 'Delete Deck' button will delete the entire deck. The graph on the right illustrates your mastery level. The 'Quick Create Card' option provides a small area for entering simple text to create a quick card. Alternatively, you can click 'Create Card' to go to the create card page for more complex card creation. Clicking the 'Toggle Delete Card' button activates delete mode, allowing you to remove the cards you wish to delete. At the bottom, all the cards in the deck are displayed, and you can click the edit icon to edit the card or click the speaker icon to let the computer speak the card for you.",
    image: DeckViewImg,
  },
  {
    title: "Review page",
    guide: "The Review page displays the cards you need to review. In the top right corner, you can choose which animation to use for reviewing: either the question set or the flashcard. When you reveal the answer, four choices will appear, asking how confident you feel about knowing the question. Each choice indicates the time for your next review of that card. You can also press the space key to reveal or flip the card, and use the number keys (1 to 4) to select your answer choice.",
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
    image: MulitInputImg,
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
  const VISIBLE_CARDS = 6;

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
      <div className="w-1/3 p-4 overflow-y-auto text-elDark dark:text-edWhite">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full p-2 border rounded text-white bg-elDarkGray dark:bg-edDark"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="mt-4">
          {filteredTopics.map((topic, index) => (
            <li
              key={index}
              className={`p-2 border-b border-black dark:border-white ${selectedTopic === topic ? "bg-elStrongHLT dark:bg-edHLT" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              {topic.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Vertical 3D Card Stack */}
      <div className="w-2/3 h-[calc(100vh-4rem)] p-4 flex items-center justify-center relative overflow-hidden text-black">
        {Array.from({ length: VISIBLE_CARDS * 2 + 1 }).map((_, i) => {
          const index = (currentIndex + i - VISIBLE_CARDS + topics.length) % topics.length;
          const positionFromCenter = i - VISIBLE_CARDS;
          const isSelected = selectedTopic === topics[index];

          return (
            <div
              // key={`$index}-${i}`} could avoid the error but would lost the animation???
              key={index}
              style={calculateCardStyle(positionFromCenter, isSelected)} // Pass isSelected to calculate card style
              className={`absolute w-full p-4 dark:bg-white dark:text-black border-2 shadow-xl border-black rounded-lg bg-white flex flex-col items-center ${isSelected ? "shadow-xl h-[90vh]" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              <h2 className="text-2xl font-bold mb-4">{topics[index].title}</h2>
              <div className="mt-2">
                {Array.isArray(topics[index].guide) && topics[index].format === "list" ? (
                  <ul className={`grid gap-2 grid-cols-1" ml-6`}>
                    {(isSelected ? topics[index].guide : topics[index].guide.slice(0, 1)).map((item, idx) => (
                      <li key={idx} className="flex">
                        <span className="font-semibold">{item.split(":")[0]}:</span> {/* Label */}
                        <span className="ml-2">{item.split(":")[1]}</span> {/* Example */}
                      </li>
                    ))}
                    {!isSelected && topics[index].guide.length > 1 && <li>...</li>}
                  </ul>
                ) : (
                  <p>
                    {isSelected
                      ? topics[index].guide
                      : `${topics[index].guide.substring(0, 80)}...`}
                  </p>
                )}
              </div>
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
