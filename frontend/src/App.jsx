import { useState } from 'react'
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Routes, Route, useParams } from "react-router-dom";

import LandingPage from "./components/LandingPage"
import HomePage from "./components/UserPage";
import CreateCard from "./components/CreateCard"
import CreateDeck from "./components/CreateDeck"
import CreateFolder from "./components/CreateFolder"
import ReviewPage from "./components/ReviewPage";
import HelpPage from "./components/HelpPage"
import DeckPage from './components/DeckPage';
import EditPage from './components/EditPage';
import Header from "./components/Header"
import Login from './components/Login';
import SignUp from './components/SignUp';

const queryClient = new QueryClient();

function ErrorPage() {
  const { statusCode, errorMessage } = useParams();

  return (
    <>
      <h1>{statusCode} Error</h1>
      <p>{errorMessage}</p>
    </>
  );
}

function Main() {
  return (
    <main className="w-full h-full flex flex-col items-center">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cards" element={<CreateCard />} />
        <Route path="/decks" element={<CreateDeck />} />
        <Route path="/folders" element={<CreateFolder />} />
        <Route path="/review/:deckId" element={<ReviewPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/edit/:cardId" element={<EditPage />} />
        <Route path="/decks/:deckId" element={<DeckPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/error/404/Page%20Not%20Found" />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="w-screen h-screen flex flex-col text-[1.2em] font-medium bg-[#242424] text-gray-200">
          <Header />
          <Main />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App;
