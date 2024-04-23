import { useQuery } from "react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SideBar from "./SideBar.jsx";
import "./Create.css";

function Create() {
  const [folders, setFolderValue] = useState("");
  const [decks, setDeckValue] = useState("");

  // Define functions to handle dropdown value changes
  const folderChange = (event) => {
    setFolderValue(event.target.value);
  };

  const deckChange = (event) => {
    setDeckValue(event.target.value);
  };

  return (
    <div className="card-create-page">
      <SideBar />
      <div className="selection">
        {/* Folder Dropdown, later will change to folder that the user has */}
        <select className="dropDown" value={folders} onChange={folderChange}>
          <option value="">Folders</option>
          <option value="option1">5530</option>
          <option value="option2">Computer System</option>
        </select>

        {/* Deck Dropdown, later will need change to depend on which folder choiced */}
        <select className="dropDown" value={decks} onChange={deckChange}>
          <option value="">Decks</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <h2>Following will be the text editor to create cards</h2>
    </div>
  );
}

export default Create;