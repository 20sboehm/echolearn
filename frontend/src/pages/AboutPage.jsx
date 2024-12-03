import logoImg from "../assets/echolearn-logo-white.png"
import CreateCard from "../assets/CreateCard.png"
import Community from "../assets/Community.png"
import PublicView from "../assets/PublicDeckView.png"
import DeckPage from "../assets/DeckPage.png"
import HomePage from "../assets/TO-DOList.png"
import Sidebar from "../assets/Sidebar.png"
import architecture from "../assets/Architecture.png"

function AboutPage() {
  return (
    <>
      {/* <div className="flex flex-col items-center w-full bg-gradient-to-t from-customBlue to-featureBackground"> */}
      <div className="flex flex-col items-center w-full bg-gradient-to-t from-[#025497] to-[#013865]">
        <div className="flex flex-row h-24 items-center mt-4 mb-8">
          <img src={logoImg} className="w-16 h-16"></img>
          <h1 className="text-4xl font-bold text-white ml-4">EchoLearn</h1>
        </div>
        <div className="flex justify-center items-center w-[60vw] px-16">
          <div className="flex flex-col w-[80vw] text-center text-white">
            <p className="pb-4 text-lg">
              EchoLearn will provide users with the ability to retain knowledge over an extended period of time.
              This will be accomplished through the use of flashcards and spaced repetition—a memorization technique in which flashcard reviews are spaced at increasing intervals.
              This makes it simple and efficient for users to recall knowledge long after they first learn it.
            </p>
            <h2 className="text-2xl text-center text-white font-semibold pb-2 pt-4 mt-4 border-t">Mission</h2>
            <p className="pb-4 text-lg border-b">
              The purpose of EchoLearn is to remedy the problem of forgetting the things you’ve learned, whether that be personal information, or knowledge you need for your job or degree.
              It can be thought of as a personal knowledge repository, where you can store everything you want to remember in an intuitive, organized application that is accessible from any device with a web browser.
            </p>
            <div className="flex flex-row items-start justify-center text-white w-full p-6 border-b">
              <div className="mr-8">
                <h2 className="text-2xl font-bold text-white mb-4">Technologies & Architecture</h2>

                <div className="text-left mb-2">
                  <ul className="list-inside space-y-1">
                    <li><strong>FrontEnd:</strong> React, Tailwind</li>
                    <li><strong>BackEnd:</strong> Django Ninja</li>
                    <li><strong>Database:</strong> SQLite</li>
                    <li><strong>Deploy:</strong> AWS EC2</li>
                    <li><strong>Image Storage:</strong> AWS S3</li>
                  </ul>
                </div>
              </div>


              <div className="flex flex-col items-center">
                <img src={architecture} alt="System Architecture" className="w-[400px] h-auto max-h-[80vh] rounded-md shadow-lg" />
              </div>
            </div>
            <div className="flex flex-row justify-center items-start flex-wrap text-gray-800 gap-6 mb-6 pt-4">
              {/* Create Card */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-white font-semibold">Create Card Page</span>
                <img src={CreateCard} className="w-[400px] h-auto max-h-[80vh]"></img>
              </div>

              {/* Community */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-white font-semibold">Community Page</span>
                <img src={Community} className="w-[400px] h-auto max-h-[80vh]"></img>
              </div>

              {/* Home Page */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-white font-semibold">Home Page</span>
                <img src={HomePage} className="w-[400px] h-auto max-h-[80vh]"></img>
              </div>

              {/* Deck Page */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-white font-semibold">Deck Page</span>
                <img src={DeckPage} className="w-[400px] h-auto max-h-[80vh]"></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutPage