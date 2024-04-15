import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "./LandingPage.css";
import Header from "./Header";

function LandingBody() {
  return (
    <div className="landingBody">
      <div className="landingMiddle">
        <div className="middleText">
          <h3>Learn Efficiently, Remember Forever</h3>
          <p>Unlock your learning potential with EchoLearn. Our smart flashcard system makes remembering information easy and fun.</p>
        </div>
        <img src="../public/Study.png" alt="Study PNG"></img>
      </div>
      <div className="landingBottom">
        <div>
          <p>Place holder for the img</p>
          <h3>Spaced repetition made simple</h3>
          <p>EchoLearn predicts when you will forget information, and times your reviews accordingly.</p>
        </div>
        <div>
          <p>Place holder for the img</p>
          <h3>Intelligent flashcards</h3>
          <p>With EchoLearn, card reviews are automatically scheduled to optimize memorization. This means you can focus on learning.</p>
        </div>
        <div>
          <p>Place holder for the img</p>
          <h3>Free and open source</h3>
          <p>Our team has a commitment  to making learning accessible; this means all of your favorite flashcard app features at no cost.</p>
        </div>
      </div>
    </div>
  )
}

function Landing() {
  return (
    <div className="landingPage">
      <Header />
      <LandingBody />
    </div>
  )
}

export default Landing