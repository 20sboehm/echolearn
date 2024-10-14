import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Routes, Route, useParams } from "react-router-dom";

import { useAuth } from "./hooks";
import { AuthProvider } from "./context/auth";
import { useApi } from './hooks';

import Header from "./components/Header";
import LandingPage from "./pages/LandingPage"
import HomePage from "./pages/HomePage";
import CreateCard from "./pages/CreateCard";
import ReviewPage from "./pages/ReviewPage";
import HelpPage from "./pages/HelpPage";
import DeckPage from './pages/DeckPage';
import EditPage from './pages/EditPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import FeaturePage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import StatsPage from './pages/StatsPage';
import CommunityPage from './pages/community'
import QuizletParserPage from './pages/QuizletParserPage'

const queryClient = new QueryClient();

function ErrorPage({ statusCode, errorMessage }) {
  return (
    <>
      <h1 className="mt-20 text-[3rem] font-bold">{statusCode}</h1>
      <p className="mt-2 text-[1.5rem]">{errorMessage}</p>
    </>
  );
}

function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cards" element={<CreateCard />} />
      <Route path="/quizletparser" element={<QuizletParserPage />} />
      <Route path="/review/:deckId" element={<ReviewPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/edit/:cardId" element={<EditPage />} />
      <Route path="/decks/:deckId" element={<DeckPage />} />
      <Route path="/decks/public/:deckId" element={<DeckPage publicAccess={true} />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/stats/:deckId" element={<StatsPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="*" element={<ErrorPage statusCode="404" errorMessage="Page not found" />} />
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

  const api = useApi();

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (isLoggedIn) {
        try {
          const response = await api._get('/api/profile/me');
          const data = await response.json();

          // Apply the theme globally based on user preference
          if (data.light_mode === false) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (error) {
          console.error('Failed to fetch user settings', error);
        } finally {
          // Remove the 'theme-pending' class once the theme is applied
          document.documentElement.classList.remove('theme-pending');
        }
      } else {
        // If the user isn't logged in, just remove the class
        document.documentElement.classList.remove('theme-pending');
      }
    };

    fetchUserSettings();
  }, [isLoggedIn, api]);


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
          <div className="min-w-screen min-h-screen flex flex-col font-base text-edWhite bg-elBase dark:bg-edBase">
            <Header />
            <Main />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;
