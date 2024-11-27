import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Routes, Route, useParams } from "react-router-dom";

import { useAuth } from "./hooks";
import { AuthProvider } from "./context/auth";
import { useApi } from './hooks';
import { useLocation } from 'react-router-dom';

import Header from "./components/Header";
import LandingPage from "./pages/LandingPage"
import HomePage from "./pages/HomePage";
import CreateCardPage from "./pages/CreateCardPage";
import ReviewPage from "./pages/ReviewPage";
import HelpPage from "./pages/HelpPage";
import DeckPage from './pages/DeckPage';
import EditCardPage from './pages/EditCardPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import FeaturePage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import StatsPage from './pages/StatsPage';
import FriendsPage from './pages/FriendsPage';
import CommunityPage from './pages/CommunityPage';
import QuizletParserPage from './pages/QuizletParserPage';
import MyImagesPage from './pages/MyImagesPage';
import QuizPage from "./pages/QuizPage";
import AnkiParserPage from './pages/AnkiParserPage'
import AIGenerateCards from './pages/AICreateCards'
import SharedDeck from './pages/SharedWith'
import StudyPage from './pages/StudyPage'
import EditAll from './pages/EditAllPage'
import MultipleInput from './pages/MultipleInputPage'
import LeaderBoard from './pages/LeaderBoard'
import TeamPage from './pages/TeamPage'
import TutorialPage from './pages/TutorialPage'

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
      <Route path="/cards" element={<CreateCardPage />} />
      <Route path="/quizletparser" element={<QuizletParserPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/study" element={<StudyPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/edit/:cardId" element={<EditCardPage />} />
      <Route path="/decks/:deckId" element={<DeckPage />} />
      <Route path="/decks/public/:deckId" element={<DeckPage publicAccess={true} />} />
      <Route path="/shared" element={<SharedDeck />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/stats/:deckId" element={<StatsPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="*" element={<ErrorPage statusCode="404" errorMessage="Page not found" />} />
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="/myimages" element={<MyImagesPage />} />
      <Route path="/quiz/:deckId" element={<QuizPage />} />
      <Route path="/ankiparser" element={<AnkiParserPage />} />
      <Route path="/aigeneratecards" element={<AIGenerateCards />} />
      <Route path="/editall/:deckId" element={<EditAll />} />
      <Route path="/multipleinput" element = {<MultipleInput/>}/>
      <Route path="/leaderboard" element = {<LeaderBoard/>}/>
    </Routes>
  );
}

function UnauthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<FeaturePage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/tutorial" element={<TutorialPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function Main({ setBgClass }) {
  const { isLoggedIn, token } = useAuth();
  console.log("isLoggedIn: " + isLoggedIn);
  console.log("token: " + !!token);
  const api = useApi();

  useEffect(() => {
    if (!isLoggedIn) {
      setBgClass('bg-edBase');
    } else {
      setBgClass('bg-elBase dark:bg-edBase');
    }
  }, [isLoggedIn, setBgClass]);

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
  const [bgClass, setBgClass] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className={`min-w-screen min-h-screen flex flex-col font-base text-edWhite ${bgClass}`}>
            <Header />
            <Main setBgClass={setBgClass} />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;
