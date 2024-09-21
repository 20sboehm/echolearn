import React, { useState, useEffect } from 'react';
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useApi } from "../hooks";
import folderImg from "../assets/Folder.png";
import decksImg from "../assets/Deck.png";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './SideBar.css';

const SidebarOpenClose = ({ sidebarOpen, sidebarWidth }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: (sidebarOpen && sidebarWidth !== 0) ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s ease",
        width: "18px",
        height: "18px",
      }}
    >
      <path
        d="M11 6L18 12L11 18"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="2" y1="12" x2="18" y2="12"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const ExpandContractIcon = ({ isExpanded }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: isExpanded ? "rotate(270deg)" : "rotate(90deg)", // Rotates 180 degrees when expanded
        transition: "transform 0.3s ease",
        width: "18px",
        height: "18px",
      }}
    >
      <path
        d="M11 6L18 12L11 18"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="2" y1="12" x2="18" y2="12"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

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

const Folder = ({ folder, onRightClick, folderStates, toggleFolder, setContextMenu, selected, setSelected }) => {

  const handleLeftClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setSelected(folder);
    toggleFolder(folder.folder_id);
  };

  return (
    <div className="mt-2">
      <div onClick={handleLeftClick} onContextMenu={(e) => onRightClick(e, folder)} className={`cursor-pointer text-base text-eWhite flex items-center select-none ${selected === folder ? 'bg-gray-500' : ''}`}>
        <ChevronIcon isOpen={folderStates[folder.folder_id]} />
        <p className="overflow-x-auto">{folder.name}</p>
      </div>
      {folderStates[folder.folder_id] && (
        <div className="ml-2 border-l border-eGray">
          {folder.decks.map((deck, index) => (
            <div key={index} className="text-eWhite flex items-center select-none text-base ml-2 mt-2 hover:text-eBlue" onContextMenu={(e) => onRightClick(e, deck)}>
              <Link to={`/decks/${deck.deck_id}`}>
                <p className="overflow-x-auto whitespace-nowrap">{deck.name}</p>
              </Link>
            </div>
          ))}
          {folder.children &&
            folder.children.map((child, index) => (
              <Folder key={index} folder={child} className="mt-2" onRightClick={onRightClick} folderStates={folderStates} toggleFolder={toggleFolder} setContextMenu={setContextMenu} selected={selected} setSelected={setSelected} />
            ))}
        </div>
      )}
    </div>
  );
};


const Sidebar = ({ refetchTrigger }) => {
  const api = useApi();
  const [sidebarData, setSidebarData] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // For right-click menu
  const [newName, setNewName] = useState('');
  const [selected, setSelected] = useState(null);
  const [createType, setCreateType] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [folderStates, setFolderStates] = useState({});
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchSidebarData = () => {
    api._get('/api/sidebar')
      .then((response) => response.json())
      .then((data) => {
        setSidebarData(data);

        const initialFolderStates = {};
        const initializeFolderStates = (folders) => {
          folders.forEach((folder) => {
            initialFolderStates[folder.folder_id] = false; // All folders are initially closed
            if (folder.children) {
              initializeFolderStates(folder.children); // Recursively initialize nested folders
            }
          });
        };
        initializeFolderStates(data.folders);
        setFolderStates(initialFolderStates);
      })
      .catch((error) => {
        console.log('An error occurred fetching sidebar:', error);
      });
  };

  useEffect(() => {
    fetchSidebarData();
  }, [refetchTrigger]);

  const sidebarShow = () => {
    if (sidebarOpen) {
      setSidebarWidth(0);
    } else {
      setSidebarWidth(250);
    }
    setSidebarOpen(!sidebarOpen);
  };

  // Handle folder open/close state
  const toggleFolder = (folderId) => {
    setFolderStates((prevState) => ({
      ...prevState,
      [folderId]: !prevState[folderId],
    }));
  };

  const isAnyFolderOpen = Object.values(folderStates).some((isOpen) => isOpen);

  const handleExpandCollapseAll = () => {
    const newState = !isAnyFolderOpen; // Collapse all if any folder is open, else expand all
    const updatedFolderStates = {};
    const updateAllFolderStates = (folders) => {
      folders.forEach((folder) => {
        updatedFolderStates[folder.folder_id] = newState; // Set all folders (root and nested) to the new expanded/collapsed state
        if (folder.children) {
          updateAllFolderStates(folder.children); // Recursively update nested folders
        }
      });
    };
    updateAllFolderStates(sidebarData.folders);
    setFolderStates(updatedFolderStates);
  };

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

  const buttonCreate = (type) => {
    if (type == "deck" && selected == null) {
      alert("Please select a folder to create deck");
      return;
    }
    setCreateType(type);
    setShowInput(true);
    setContextMenu(null);
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
        setNewName('');
        fetchSidebarData();
        setContextMenu(null);
        setShowInput(false);
        setCreateType('');
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
      <button
        onClick={sidebarShow}
        style={{ left: `${sidebarWidth}px` }}
        className={`text-eWhite px-2 py-1 absolute top-[4rem] z-50`}
      >
        <SidebarOpenClose sidebarOpen={sidebarOpen} sidebarWidth={sidebarWidth} />
      </button>
      <ResizableBox
        width={sidebarWidth}
        height={Infinity}
        axis="x"
        resizeHandles={['e']}
        minConstraints={[0, Infinity]} // Minimum width
        maxConstraints={[600, Infinity]} // Maximum width
        className="bg-eDark h-[calc(100%-4rem)] border-r border-eDarkGray p-2"
        style={{ overflow: 'hidden', position: 'absolute', left: '0', zIndex: '1' }}
        onResize={(e, { size }) => setSidebarWidth(size.width)}
        handle={<span className="sizehandle" />}
      >
        <div className="h-[92vh] overflow-y-auto">
          <div className='flex justify-between border-b border-eGray'>
            <h2 className='font-bold text-1xl text-eWhite whitespace-nowrap'>Deck Library</h2>
            <div className='flex items-center'>
              <button onClick={() => buttonCreate('folder')}><img src={folderImg} className='w-6 h-6' alt="Folder"></img></button>
              <button onClick={() => buttonCreate('deck')}><img src={decksImg} className='w-6 h-6' alt="Decks"></img></button>
              <button onClick={handleExpandCollapseAll}>
                <ExpandContractIcon isExpanded={isAnyFolderOpen} />
              </button>
            </div>
          </div>
          {sidebarData && sidebarData.folders ? (
            sidebarData.folders.length > 0 ? (
              sidebarData.folders.map((folder, index) => (
                <Folder key={index} folder={folder} onRightClick={handleRightClick} folderStates={folderStates} toggleFolder={toggleFolder} setContextMenu={setContextMenu} selected={selected} setSelected={setSelected} />
              ))
            ) : (
              <p>You have no decks!</p>
            )

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

      {showInput && (
        <div style={{ position: 'absolute', top: '50px', left: '50px', background: 'black', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', zIndex: 9999, color: 'white' }}>
          <input
            type="text"
            placeholder={`Enter ${createType} name`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: '5px', borderRadius: '3px', width: '100%', color: 'black' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreate();
              }
            }}
          />
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handleCreate}>Create</button>
            <button onClick={() => { setNewName(''); setShowInput(false); setCreateType(''); }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Sidebar;