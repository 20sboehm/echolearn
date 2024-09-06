import React, { useState, useEffect } from 'react';
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useApi } from "../hooks";
import folderOpenImg from "../assets/folder-open.png";
import folderCloseImg from "../assets/folder-close.png";
import decksImg from "../assets/decks.png";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const Folder = ({ folder, onRightClick }) => {
  const [openFolder, setOpenFolder] = useState(false);

  const handleOpenFolder = () => {
    setOpenFolder(!openFolder);
  };

  return (
    <div className="mt-2">
      <div onClick={handleOpenFolder} onContextMenu={(e) => onRightClick(e, folder)} className="cursor-pointer text-black flex">
        <img
          src={openFolder ? folderOpenImg : folderCloseImg}
          alt={openFolder ? "Open folder" : "Closed folder"}
          className="w-6 h-6 ml-2 mr-2" />
        <p className="overflow-x-auto">{folder.name}</p>
      </div>
      {openFolder && (
        <div className="ml-4">
          {folder.decks.map((deck, index) => (
            <div key={index} className="text-black flex items-center" onContextMenu={(e) => onRightClick(e, deck)}>
              <Link to={`/decks/${deck.deck_id}`} style={{ display: "flex", alignItems: "center" }}>
                <img src={decksImg} alt="Deck" className="w-10 h-10" />
                <p className="overflow-x-auto whitespace-nowrap">{deck.name}</p>
              </Link>
            </div>
          ))}
          {folder.children &&
            folder.children.map((child, index) => (
              <Folder key={index} folder={child} className="mt-2" onRightClick={onRightClick} />
            ))}
        </div>
      )}
    </div>
  );
};


const Sidebar = () => {
  const api = useApi();
  const [sidebarData, setSidebarData] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // For right-click menu
  const [newDeckName, setNewDeckName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);

  const fetchSidebarData = () => {
    api._get('/api/sidebar')
      .then((response) => response.json())
      .then((data) => {
        setSidebarData(data);
      })
      .catch((error) => {
        console.log('An error occurred fetching sidebar:', error);
      });
  };

  useEffect(() => {
    fetchSidebarData();
  }, []);

  console.log("sidebar" + sidebarData);
  const handleRightClick = (event, item) => {
    event.preventDefault();
    if (item.folder_id) {
      // User right click on the folder
      setSelectedFolder(item);
      setSelectedDeck(null);
    } else {
      // User right click on the deck
      setSelectedDeck(item);
      setSelectedFolder(null);
    }
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const handleCreateDeck = async () => {

    console.log(selectedDeck);

    const newDeck = {
      folder_id: selectedFolder ? selectedFolder.folder_id : selectedDeck.parent_folder_id,
      name: newDeckName,
    };

    try {
      const response = await api._post("/api/decks", newDeck);
      if (response.status === 201) {
        fetchSidebarData();
        setContextMenu(null);
      } else {
        console.error("Failed to create deck", response);
      }
    } catch (error) {
      console.error("Error creating deck", error);
    }
    setNewDeckName('');
  };

  return (
    <div>
      <ResizableBox
        width={250}
        height={Infinity}
        axis="x"
        resizeHandles={['e']}
        minConstraints={[100, Infinity]} // Minimum width
        maxConstraints={[600, Infinity]} // Maximum width
        className="bg-white h-[92vh]"
        style={{ overflow: 'hidden', position: 'absolute', left: '0', zIndex: '1' }}
      >
        <div className="h-[92vh] overflow-y-auto">
          {sidebarData && sidebarData.folders ? (
            sidebarData.folders.map((folder, index) => (
              <Folder key={index} folder={folder} onRightClick={handleRightClick} />
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </ResizableBox>
      {contextMenu && (
        <div
          style={{
            position: "absolute",
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            backgroundColor: "white",
            color: "black",
            border: "1px solid black",
            padding: "10px",
            zIndex: 9999,
          }}
        >
          <h3>Create New Deck</h3>
          <input
            type="text"
            placeholder="Deck Name"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            style={{ color: 'white' }}
          />
          <button className="m-2" onClick={handleCreateDeck}>Create</button>
          <button onClick={() => { setNewDeckName; setContextMenu(null); }}>Cancel</button>
        </div>
      )}
    </div>
  );
};


export default Sidebar;