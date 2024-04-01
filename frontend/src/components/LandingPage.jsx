import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "./LandingPage.css";
import Header from "./Header";

function Landing() {
  return (
    <div>
      <Header />
      <h1>This is the landing page</h1>
    </div>
  )
}

export default Landing