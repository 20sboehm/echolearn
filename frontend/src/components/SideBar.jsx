import React, { useState, useEffect } from 'react';
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useApi } from "../hooks";
// import folderOpenImg from "../assets/folder-open.png";
// import folderCloseImg from "../assets/folder-close.png";
// import decksImg from "../assets/decks.png";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ChevronIcon = ({ isOpen }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", // Point right when closed, down when open
        transition: "transform 0.3s ease",
        width: "18px",
        height: "18px",
      }}
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="#FFFFFF" // Change stroke to white
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Folder = ({ folder, onRightClick }) => {
  const [openFolder, setOpenFolder] = useState(false);

  const handleOpenFolder = () => {
    setOpenFolder(!openFolder);
  };

  return (
    <div className="mt-2">
      <div onClick={handleOpenFolder} onContextMenu={(e) => onRightClick(e, folder)} className="cursor-pointer text-base text-eWhite flex items-center select-none">
        {/* <img
          src={openFolder ? folderOpenImg : folderCloseImg}
          alt={openFolder ? "Open folder" : "Closed folder"}
          className="w-6 h-6 ml-2 mr-2" /> */}
        <ChevronIcon isOpen={openFolder} />
        <p className="overflow-x-auto">{folder.name}</p>
      </div>
      {openFolder && (
        <div className="ml-2 pl-2 border-l border-eGray">
          {folder.decks.map((deck, index) => (
            <div key={index} className="text-eWhite flex items-center select-none text-base ml-2 mt-2 hover:text-eBlue" onContextMenu={(e) => onRightClick(e, deck)}>
              {/* <Link to={`/decks/${deck.deck_id}`} style={{ display: "flex", alignItems: "center" }}> */}
              <Link to={`/decks/${deck.deck_id}`}>
                {/* <img src={decksImg} alt="Deck" className="w-10 h-10" /> */}
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
  const [newName, setNewName] = useState('');
  const [selected, setSelected] = useState(null);
  const [createType, setCreateType] = useState('');
  const [renaming, setRenaming] = useState(false);

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

  const handleRightClick = (event, folder = null) => {
    event.preventDefault();
    event.stopPropagation();

    setNewName('');
    setContextMenu({ x: event.clientX, y: event.clientY });
    setCreateType('');
    setRenaming(false);

    if (folder) {
      setSelected(folder); // Right-click on folder/deck
    } else {
      setSelected(null); // Right-click on empty space
    }
  };

  // Following are the logic for create both folder and deck
  const handleCreate = async () => {
    if (newName.trim() === '') {
      alert("Name can't be empty")
      return;
    }

    let newItem = {
      name: newName,
      // null should only happen if user is creating a top level folder
      folder_id: selected?.parent_folder_id || selected?.folder_id || null,
    };
    const endpoint = createType === 'deck' ? "/api/decks" : "/api/folders";

    try {
      const response = await api._post(endpoint, newItem);
      if (response.status === 201) {
        fetchSidebarData();
        setContextMenu(null);
      } else {
        console.error(`Failed to create ${createType}`, response);
      }
    } catch (error) {
      console.error(`Error creating ${createType}`, error);
    }
  };


  // Following are the logic for rename both folder and deck
  const handleRename = async () => {
    if (newName.trim() === '') {
      alert("Name cannot be empty");
      return;
    }

    let endpoint = '';
    try {
      if (selected.folder_id) {
        endpoint = `/api/folders/${selected.folder_id}`;
      } else if (selected.deck_id) {
        endpoint = `/api/decks/${selected.deck_id}`;
      }

      const response = await api._patch(endpoint, { name: newName });
      if (response.status === 200) {
        fetchSidebarData();
        setRenaming(false);
        setContextMenu(null);
      } else {
        console.error("Failed to rename", response);
      }
    } catch (error) {
      console.error("Error renaming", error);
    }
  };

  // Following are the logic of deleting folder and deck
  const handleDelete = async () => {
    if (!selected) return;

    let endpoint = '';
    try {
      if (selected.folder_id) {
        endpoint = `/api/folders/${selected.folder_id}`;
      } else if (selected.deck_id) {
        endpoint = `/api/decks/${selected.deck_id}`;
      }

      const response = await api._delete(endpoint);
      if (response.status === 204) {
        fetchSidebarData();
        setContextMenu(null);
      } else {
        alert("Cannot delete folder with items inside.");
      }
    } catch (error) {
      console.error("Error deleting", error);
    }
  };

  return (
    <div onContextMenu={(e) => handleRightClick(e)}>
      <ResizableBox
        width={250}
        height={Infinity}
        axis="x"
        resizeHandles={['e']}
        minConstraints={[50, Infinity]} // Minimum width
        maxConstraints={[600, Infinity]} // Maximum width
        className="bg-eDark h-[calc(100%-4rem)] border-r border-eDarkGray"
        style={{ overflow: 'hidden', position: 'absolute', left: '0', zIndex: '1' }}
      >
        <div className="h-[92vh] overflow-y-auto">
          <h2 className='font-bold text-2xl text-black'>Sidebar:</h2>
          {sidebarData && sidebarData.folders ? (
            sidebarData.folders.map((folder, index) => (
              <Folder key={index} folder={folder} onRightClick={handleRightClick} />
            ))
          ) : (
            <div className='text-black'>Loading...</div>
          )}
        </div>
      </ResizableBox>

      {contextMenu && (
        <div
          style={{
            position: "absolute",
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            backgroundColor: "black",
            color: "white",
            padding: "10px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            borderRadius: "5px",
          }}
        >
          {selected && ( // Right-click on folder or deck
            <>
              <div
                style={{ padding: "8px 12px", cursor: "pointer" }}
                onClick={() => setCreateType('deck')}
              >
                Create Deck
              </div>
              <div
                style={{ padding: "8px 12px", cursor: "pointer" }}
                onClick={() => setCreateType('folder')}
              >
                Create Folder
              </div>
              <div
                style={{ padding: "8px 12px", cursor: "pointer" }}
                onClick={() => {
                  setRenaming(true);
                  setNewName(selected.name);
                }}
              >
                Rename
              </div>
              <div
                style={{ padding: "8px 12px", cursor: "pointer" }}
                onClick={handleDelete}
              >
                Delete
              </div>
            </>
          )}

          {!selected && ( // Right-click on empty space
            <div
              style={{ padding: "8px 12px", cursor: "pointer" }}
              onClick={() => setCreateType('folder')}
            >
              Create Folder
            </div>
          )}

          {/* Input for creating new deck or folder */}
          {createType && (
            <div style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder={`Enter ${createType} name`}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{
                  color: 'black',
                  backgroundColor: 'white',
                  padding: '5px',
                  borderRadius: '3px',
                  width: '100%',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreate();
                  }
                }}
              />
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleCreate}>Create</button>
                <button onClick={() => { setNewName(''); setContextMenu(null); setCreateType('') }}>Cancel</button>
              </div>
            </div>
          )}

          {renaming && (
            <div style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Enter new name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{
                  color: 'black',
                  backgroundColor: 'white',
                  padding: '5px',
                  borderRadius: '3px',
                  width: '100%',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRename();
                  }
                }}
              />
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleRename}>Rename</button>
                <button onClick={() => { setNewName(''); setContextMenu(null); setRenaming(false); }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default Sidebar;