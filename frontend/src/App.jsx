import { useState } from 'react'
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Routes, Route, useParams } from "react-router-dom";
import './App.css'
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
          <Route path="/cards/:cardId" element={<CardPage />} />
          <Route path="*" element={<Navigate to="/error/404/Page%20Not%20Found" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App;
