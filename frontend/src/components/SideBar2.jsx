import React, { useState, useEffect } from 'react';
import { useQuery } from "react-query";
import { useApi } from "../hooks";
import folderOpenImg from "../assets/folder-open.png";
import folderCloseImg from "../assets/folder-close.png";
import decksImg from "../assets/decks.png";

const Folder = ({ folder }) => {
  const [openFolder, setOpenFolder] = useState(false);

  const handleOpenFolder = () => {
    setOpenFolder(!openFolder);
  };

  return (
    <div>
      <div onClick={handleOpenFolder} className="cursor-pointer text-black flex">
      <img
          src={openFolder ? folderOpenImg : folderCloseImg}
          alt={openFolder ? "Open folder" : "Closed folder"}
          className="w-6 h-6 ml-2 mr-2 mb-2"/>
        <p className="overflow-x-auto">{folder.name}</p>
      </div>
      {openFolder && (
        <div className="ml-4">
          {folder.decks.map((deck, index) => (
            <div key={index} className="text-black flex items-center">
              <img src={decksImg} alt="Deck" className="w-10 h-10"/>
              <div className="overflow-x-auto">
                <p className="whitespace-nowrap">{deck.name}</p>
              </div>
            </div>
          ))}
          {folder.children &&
            folder.children.map((child, index) => (
              <Folder key={index} folder={child} />
            ))}
        </div>
      )}
    </div>
  );
};


const Sidebar = () => {
  const api = useApi();
  const [sidebarData, setSidebarData] = useState(null);
  
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

  console.log(sidebarData);

  return (
    // NOTE: will need to test on other computer who has bigger screen, h-screen looks wrong on my side -- Wilson
    <div className="w-64 h-[92vh] fixed left-0 bg-gray-200 overflow-x-auto overflow-y-auto">
      {sidebarData && sidebarData.folders ? (
        sidebarData.folders.map((folder, index) => (
          <Folder key={index} folder={folder} />
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};


export default Sidebar;