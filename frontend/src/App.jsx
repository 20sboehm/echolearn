import { useState } from 'react'
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Routes, Route, useParams } from "react-router-dom";

import { useAuth } from "./hooks";
import { AuthProvider } from "./context/auth";

import LandingPage from "./components/LandingPage"
import HomePage from "./components/HomePage";
import CreateCard from "./components/CreateCard";
import CreateDeck from "./components/CreateDeck";
import CreateFolder from "./components/CreateFolder";
import ReviewPage from "./components/ReviewPage";
import HelpPage from "./components/HelpPage";
import DeckPage from './components/DeckPage';
import EditPage from './components/EditPage';
import Header from "./components/Header";
import Login from './components/Login';
import SignUp from './components/SignUp';
import FeaturePage from './components/FeaturesPage';
import AboutPage from './components/AboutPage';
import ProfilePage from './components/ProfilePage';
import StatsPage from './components/StatsPage';
import CommunityPage from './components/community'

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

function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cards" element={<CreateCard />} />
      <Route path="/decks" element={<CreateDeck />} />
      <Route path="/folders" element={<CreateFolder />} />
      <Route path="/review/:deckId" element={<ReviewPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/edit/:cardId" element={<EditPage />} />
      <Route path="/decks/:deckId" element={<DeckPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/stats/:deckId" element={<StatsPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="*" element={<Navigate to="/error/404/Page%20Not%20Found" />} />
    </Routes>
  );
}

function UnauthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<FeaturePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function Main() {
  const { isLoggedIn, token } = useAuth();
  console.log("isLoggedIn: " + isLoggedIn);
  console.log("token: " + !!token);

  return (
    <main className="w-full h-full flex flex-col items-center">
      {isLoggedIn ?
        <AuthenticatedRoutes /> :
        <UnauthenticatedRoutes />
      }
    </main>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {/* bg-[#242424] */}
          <div className="w-screen h-screen flex flex-col text-[1.2em] font-base text-eWhite bg-eBase">
            <Header />
            <Main />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;
