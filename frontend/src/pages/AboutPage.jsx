import logoImg from "../assets/echolearn-logo-white.png"
import CreateCard from "../assets/CreateCard.png"
import Community from "../assets/Community.png"
import PublicView from "../assets/PublicDeckView.png"
import DeckPage from "../assets/DeckPage.png"
import HomePage from "../assets/TO-DOList.png"
import Sidebar from "../assets/Sidebar.png"
import architecture from "../assets/Architecture.png"

const aboutText = `EchoLearn will provide users with the ability to retain knowledge over an extended period of time.
This will be accomplished through the use of flashcards and spaced repetition—a memorization technique in which flashcard reviews are spaced at increasing intervals.
This makes it simple and efficient for users to recall knowledge long after they first learn it.<br>

The purpose of EchoLearn is to remedy the problem of forgetting the things you’ve learned, whether that be personal information, or knowledge you need for your job or degree.
It can be thought of as a personal knowledge repository, where you can store everything you want to remember in an intuitive, organized application that is accessible from any device with a web browser.

Some technology we used:
Front End: React, Tailwind
Back End: Django Ninja
Database: SQLite
Deploy: AWS EC2
Image storage: AWS S3`;

function AboutPage() {
  return (
    <>
      <div className="flex flex-col items-center w-full h-screen bg-gradient-to-t from-customBlue to-featureBackground">
        <div className="flex flex-row h-24 items-center mt-4 mb-8">
          <h1 className="text-4xl font-bold text-white mr-4">About Page</h1>
        </div>
        <div className="flex flex-row w-full px-16">
          <div className="flex flex-col w-1/2 text-black"> 
            <p className="pb-4">
              EchoLearn will provide users with the ability to retain knowledge over an extended period of time.
              This will be accomplished through the use of flashcards and spaced repetition—a memorization technique in which flashcard reviews are spaced at increasing intervals.
              This makes it simple and efficient for users to recall knowledge long after they first learn it.
            </p>
            <p className="pb-4">
              The purpose of EchoLearn is to remedy the problem of forgetting the things you’ve learned, whether that be personal information, or knowledge you need for your job or degree.
              It can be thought of as a personal knowledge repository, where you can store everything you want to remember in an intuitive, organized application that is accessible from any device with a web browser. 
            </p>
            <p>
              Some technology we used:
              <br /> Front End: React, Tailwind
              <br /> Back End: Django Ninja
              <br /> Database: SQLite
              <br /> Deploy: AWS EC2
              <br /> Image Storage: AWS S3
            </p>
            <div className="flex items-center mb-4">
            <span className="text-white">Architecture</span> 
              <img src={architecture} className="w-[400px] h-auto max-h-[80vh] "></img>  
            </div>
              <div className="flex items-center mb-4">
                <span className="text-white">Home Page</span> 
                  <img src={HomePage} className="w-[400px] h-auto max-h-[80vh] "></img>  
              </div>
            </div>
          <div className="flex flex-col w-1/2 items-center">  
            <div className="flex items-center mb-4">
            <span className="text-white">Create Card</span>  
              <img src={CreateCard} className="w-[400px] h-auto max-h-[80vh] "></img>
            </div>
            <div className="flex items-center mb-4">
            <span className="text-white">Community</span>  
              <img src={Community} className="w-[400px] h-auto max-h-[80vh] "></img>
            </div>
            <div className="flex items-center mb-4">
              <span className="text-white">Deck Page</span>  
              <img src={DeckPage} className="w-[400px] h-auto max-h-[80vh] "></img>
            </div>   
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutPage