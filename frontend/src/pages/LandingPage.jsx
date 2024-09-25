import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import studyImg from "../assets/study.png"
import growthImg from "../assets/growth.png"
import ideaImg from "../assets/idea.png"
import userImg from "../assets/user.png"

function Landing() {
  return (
    <>
      <LandingBody />
    </>
  )
}

function LandingBody() {
  return (
    <>
      <div className="flex justify-between w-full">
        {/* bg-gradient-to-r from-[#9fcece] via-[#7fd8d8] to-[#42dcdc]    82deff */}
        <div className="h-[50vh] w-2/3 bg-customBlue text-black p-8 flex flex-col">
          <h3 className="ml-28 text-4xl font-bold mb-4 mt-8">Learn Efficiently, Remember Forever</h3>
          <p className="ml-28 text-2xl">Unlock your learning potential with EchoLearn. Our smart flashcard system makes remembering information easy and fun.</p>
        </div>
        <img src={studyImg} alt="Study PNG" className="w-1/3"></img>
      </div>
      <div className="flex justify-between w-full mt-4">
        <div className="flex flex-col items-center flex-grow">
          <img src={growthImg} alt="growth PNG" className="w-1/3 mt-2"></img>
          <h3 className="mt-4 text-2xl font-bold text-center">Spaced repetition made simple</h3>
          <p className="mt-2 font-normal text-center max-w-md mx-auto">EchoLearn predicts when you will forget information, and times your reviews accordingly.</p>
        </div>
        <div className="flex flex-col items-center flex-grow">
          <img src={ideaImg} alt="idea PNG" className="w-1/3 mt-2"></img>
          <h3 className="mt-4 text-2xl font-bold text-center">Intelligent flashcards</h3>
          <p className="mt-2 font-normal text-center max-w-md mx-auto">With EchoLearn, card reviews are automatically scheduled to optimize memorization. This means you can focus on learning.</p>
        </div>
        <div className="flex flex-col items-center flex-grow">
          <img src={userImg} alt="user PNG" className="w-1/3 mt-2"></img>
          <h3 className="mt-4 text-2xl font-bold text-center">Free and open source</h3>
          <p className="mt-2 font-normal text-center max-w-md mx-auto">Our team has a commitment  to making learning accessible; this means all of your favorite flashcard app features at no cost.</p>
        </div>
      </div>
    </>
  )
}

export default Landing