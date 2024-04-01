import { useState } from 'react'
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Routes, Route, useParams } from "react-router-dom";
import './App.css'
import CardPage from "./components/CardPage";
import CardCreate from "./components/CardCreate";
import User from "./components/UserPage";
import Review from "./components/ReviewPage";
import Landing from "./components/LandingPage";

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
          <Route path="/user" element={<User />} />
          <Route path="/" element={<Landing />} />
          <Route path="/review" element={<Review />} />
          <Route path="/help" element={<h1>This is the helpr page</h1>} />
          <Route path="/create" element={<CardCreate />} />
          <Route path="/cards/:cardId" element={<CardPage />} />
          <Route path="*" element={<Navigate to="/error/404/Page%20Not%20Found" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App;
