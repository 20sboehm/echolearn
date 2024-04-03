import { useState } from 'react'
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Routes, Route, useParams } from "react-router-dom";
import './App.css'

import LandingPage from "./components/LandingPage"
import HomePage from "./components/UserPage";
import CreateCard from "./components/CreateCard"
import CreateDeck from "./components/CreateDeck"
import CreateFolder from "./components/CreateFolder"
import Review from "./components/ReviewPage";
import Help from "./components/HelpPage"
import Create from "./components/Create";
import CardPage from "./components/CardPage";

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* /user and /guest should be one page? Depend on if the user login or not to display what screen */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cards" element={<CreateCard />} />
          <Route path="/decks" element={<CreateDeck />} />
          <Route path="/folders" element={<CreateFolder />} />
          <Route path="/review" element={<Review />} />
          <Route path="/help" element={<h1>This is the help page</h1>} />
          <Route path="/create" element={<Create />} />
          <Route path="/cards/:cardId" element={<CardPage />} />
          <Route path="*" element={<Navigate to="/error/404/Page%20Not%20Found" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App;
