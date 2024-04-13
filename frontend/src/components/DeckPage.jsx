import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";
import Sidebar from "./SideBar";

const percentage = 33.3; // 33.3% percentage

const radius = 60;

// Calculate the circumference of the circle
const circumference = Math.PI * 2 * radius;

// Calculate the length of the dash
const dashLength = (percentage / 100) * circumference;

// Calculate the length of the gap
const gapLength = circumference - dashLength;

const strokeDashoffset = circumference / 4;

const dummyData = {
  "deck_id": 1,
  "deck_name": "Dummy Title",
  "cards": [
    {
      "card_id": 1,
      "question": "What is Hello World",
      "answer": "Everything",
    },
    {
      "card_id": 2,
      "question": "What is our project name",
      "answer": "EchoLearn",
    },
    {
      "card_id": 3,
      "question": "Question holder",
      "answer": "Answer holder",
    },
    {
      "card_id": 4,
      "question": "Question holder",
      "answer": "Answer holder",
    },
    {
      "card_id": 5,
      "question": "Question holder",
      "answer": "Answer holder",
    },
    {
      "card_id": 6,
      "question": "Question holder",
      "answer": "Answer holder",
    },
    {
      "card_id": 7,
      "question": "Question holder",
      "answer": "Answer holder",
    },
    {
      "card_id": 8,
      "question": "Question holder",
      "answer": "Answer holder",
    }
  ]
}

function DeckPage() {
  const { deckId } = useParams();
  return (
    <>
      <Sidebar />
      <div className="w-[65vw]">
        <div className="flex flex-row">
          <div className="flex flex-col ">
            <h1 className="text-4xl font-bold my-4">{dummyData.deck_name}</h1>
            <Link to={`/review/${deckId}`} className="rounded-lg border border-transparent px-[100px] py-2 
              font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
              active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s"}}>
              <button>Study</button>
            </Link>
          </div>

          <div className="flex flex-col ml-auto justify-center items-center">
            <p>At the deck page of id: {deckId}</p>
            {/* JavaScript code to draw the graph */}
            <svg width="200" height="200" viewBox="0 20 200 150">
              <circle cx="100" cy="100" r={radius} fill="none" stroke="#ECEFF1" strokeWidth="7.5" />
              <circle cx="100" cy="100" r={radius} fill="none" stroke="#29A5DC" strokeWidth="7.5" strokeLinecap="round"
                      strokeDasharray={`${dashLength},${gapLength}`} strokeDashoffset={strokeDashoffset}>
                <title>Progress</title>
              </circle>
              <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16">
                {percentage}%
              </text>
            </svg>
            {/* className="mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" blue button */}
            <button className="rounded-lg border border-transparent px-4 py-2 
              font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
              active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s"}}>
                More Statistics</button>
          </div>
        </div>

        <div className="h-[50vh] overflow-y-auto">
          {dummyData.cards.map(card => (
            <div className="grid grid-cols-2 gap-4 font-medium px-2" key={card.card_id}>
              <p className="border bg-white text-black mt-2 px-2 py-2">{card.question}</p>
              <div className="border bg-white text-black mt-2 px-2 py-2 relative">
                <p>{card.answer}</p>
                <Link to={`/edit/${card.card_id}`}>
                  <img src="../public/Edit_icon.png" alt="Edit_Icon" className="absolute top-0 right-0 h-6 w-8" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}


export default DeckPage