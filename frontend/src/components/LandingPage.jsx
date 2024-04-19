import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";

function LandingBody() {
  return (
    <>
      <div className="flex justify-between">
        <div className="h-[50vh] bg-customBlue text-black p-8 flex flex-col">
          <h3 className="text-4xl font-bold mb-4">Learn Efficiently, Remember Forever</h3>
          <p>Unlock your learning potential with EchoLearn. Our smart flashcard system makes remembering information easy and fun.</p>
        </div>
        <img src="../public/Study.png" alt="Study PNG" className="w-1/3"></img>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col items-center flex-grow">
          <img src="../public/growth.png" alt="growth PNG" className="w-1/3 mt-2"></img>
          <h3 className="text-2xl font-bold text-center">Spaced repetition made simple</h3>
          <p className="text-center max-w-md mx-auto">EchoLearn predicts when you will forget information, and times your reviews accordingly.</p>
        </div>
        <div className="flex flex-col items-center flex-grow">
          <img src="../public/idea.png" alt="idea PNG" className="w-1/3 mt-2"></img>
          <h3 className="text-2xl font-bold text-center">Intelligent flashcards</h3>
          <p className="text-center max-w-md mx-auto">With EchoLearn, card reviews are automatically scheduled to optimize memorization. This means you can focus on learning.</p>
        </div>
        <div className="flex flex-col items-center flex-grow">
          <img src="../public/user.png" alt="user PNG" className="w-1/3 mt-2"></img>
          <h3 className="text-2xl font-bold text-center">Free and open source</h3>
          <p className="text-center max-w-md mx-auto">Our team has a commitment  to making learning accessible; this means all of your favorite flashcard app features at no cost.</p>
        </div>
      </div>
    </>
  )
}

function Landing() {
  return (
    <>
      <LandingBody />
    </>
  )
}

export default Landing