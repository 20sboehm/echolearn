import React, { useState, useEffect } from 'react';
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useApi } from "../hooks";
import folderOpenImg from "../assets/folder-open.png";
import folderCloseImg from "../assets/folder-close.png";
import decksImg from "../assets/decks.png";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const Folder = ({ folder }) => {
  const [openFolder, setOpenFolder] = useState(false);

  const handleOpenFolder = () => {
    setOpenFolder(!openFolder);
  };

  return (
    <div className="mt-2">
      <div onClick={handleOpenFolder} className="cursor-pointer text-black flex">
        <img
          src={openFolder ? folderOpenImg : folderCloseImg}
          alt={openFolder ? "Open folder" : "Closed folder"}
          className="w-6 h-6 ml-2 mr-2" />
        <p className="overflow-x-auto">{folder.name}</p>
      </div>
      {openFolder && (
        <div className="ml-4">
          {folder.decks.map((deck, index) => (
            <div key={index} className="text-black flex items-center">
              <div>
                <Link to={`/decks/${deck.deck_id}`} style={{ display: "flex", alignItems: "center" }}>
                  <img src={decksImg} alt="Deck" className="w-10 h-10" />
                  <p className="overflow-x-auto whitespace-nowrap">{deck.name}</p>
                </Link>
              </div>
            </div>
          ))}
          {folder.children &&
            folder.children.map((child, index) => (
              <Folder key={index} folder={child} className="mt-2" />
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

  return (
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
            <Folder key={index} folder={folder} />
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </ResizableBox>
  );
};


export default Sidebar;