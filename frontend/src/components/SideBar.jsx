import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useApi } from "../hooks";
import { ResizableBox } from 'react-resizable';
import { DeckCreateIcon, FolderCreateIcon, ExpandContractAllIcon, SidebarOpenClose, ChevronIcon } from './Icons';
import 'react-resizable/css/styles.css';

const Sidebar = ({ refetchTrigger, onResize, sidebarWidth, setSidebarWidth }) => {
  const api = useApi();
  const [sidebarData, setSidebarData] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // For right-click menu
  const [newName, setNewName] = useState('');
  const [selected, setSelected] = useState(null);
  const [createType, setCreateType] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [folderStates, setFolderStates] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const folderRef = useRef(null);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const draggingItemRef = useRef(null);

  // Click outside handler to unselect the folder or deck
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the clicked element is inside any of the specified elements
      const isInsideFolder = folderRef.current && folderRef.current.contains(event.target);
      const isInsideButtons = buttonRef.current && buttonRef.current.contains(event.target);
      const isInsidePopup = popupRef.current && popupRef.current.contains(event.target);

      // Only unselect if the click is outside of all specified elements
      if (!isInsideFolder && !isInsideButtons && !isInsidePopup) {
        setSelected(null);
        setContextMenu(null);
      }
    };

    // Add the event listener for clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSidebarData = () => {
    api._get('/api/sidebar')
      .then((response) => response.json())
      .then((data) => {
        setSidebarData(data);

        setFolderStates((prevFolderStates) => {
          const newFolderStates = { ...prevFolderStates }; // Start with existing folder states

          const initializeFolderStates = (folders) => {
            folders.forEach((folder) => {
              // Only initialize folders that don't have a state yet
              if (!(folder.folder_id in newFolderStates)) {
                newFolderStates[folder.folder_id] = false; // Default is closed
              }
              if (folder.children) {
                initializeFolderStates(folder.children); // Recursively initialize nested folders
              }
            });
          };
          initializeFolderStates(data.folders);
          return newFolderStates;
        });
      })
      .catch((error) => {
        console.log('An error occurred fetching sidebar:', error);
      });
  };

  useEffect(() => {
    fetchSidebarData();
  }, [refetchTrigger]);

  const { data: userSettings, loading } = useQuery(
    ['userSettings'],
    async () => {
      let response = await api._get('/api/profile/me');
      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.detail || 'An error occurred';
        throw new Error(`${response.status}: ${message}`);
      }
      return response.json(); // Ensure we return the response data
    },
    {
      onSuccess: (data) => {
        setSidebarOpen(data?.sidebar_open);
        if (data?.sidebar_open == false) {
          setSidebarWidth(10);
        }
      }
    }
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  const sidebarShow = () => {
    if (sidebarOpen) {
      setSidebarWidth(10);
      onResize(10);
      setSidebarOpen(true);
    } else {
      setSidebarWidth(250);
      onResize(250);
      setSidebarOpen(false);
    }
    setSidebarOpen(!sidebarOpen);
  };

  const handleResize = (e, { size }) => {
    setSidebarWidth(size.width);
    if (onResize) {
      onResize(size.width);
    }
    if (size.width === 10) {
      setSidebarOpen(false);
    } else if (size.width > 10 && !sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  // Handle folder open/close state
  const toggleFolder = (folderId) => {
    // console.log("toggling folder 2")
    // console.log(folderId)
    console.log(folderStates)
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
      // null should only happen if user is creating a top level item
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


  // Drag-and-Drop Handlers
  const handleDragStart = (e, item) => {
    e.stopPropagation();
    draggingItemRef.current = item;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetFolder) => {
    e.stopPropagation();

    if (!draggingItemRef.current) return;

    // Determine if the dragged item is a folder or deck
    const isFolder = draggingItemRef.current.folder_id !== undefined && draggingItemRef.current.deck_id == undefined;
    const itemId = isFolder ? draggingItemRef.current.folder_id : draggingItemRef.current.deck_id;
    const targetId = targetFolder ? targetFolder.folder_id : null;

    if (itemId === targetId && isFolder) return; // Prevent dropping onto itself

    const endpoint = isFolder
      ? `/api/folders/${itemId}/move${targetId !== null ? `?target_folder_id=${targetId}` : ''}`
      : `/api/decks/${itemId}/move${targetId !== null ? `?target_folder_id=${targetId}` : ''}`;
  

    console.log(endpoint);
    try {
      const response = await api._patch(endpoint);
      if (response.status === 200) {
        fetchSidebarData(); // Refetch the sidebar data
      } else {
        console.error('Failed to move item', response);
      }
    } catch (error) {
      console.error('Error moving item', error);
    }
  };


  return (
    <div onContextMenu={(e) => handleRightClick(e)} onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, null)}>
      <button
        onClick={sidebarShow}
        style={{ left: `calc(${sidebarWidth}px)` }}
        className={`px-1 py-1 m-1 absolute top-[4rem] z-50 hover:bg-elLavender dark:hover:bg-edStrongHLT rounded-md`}
      >
        <SidebarOpenClose sidebarOpen={sidebarOpen} sidebarWidth={sidebarWidth} />
      </button>

      {/* WARNING - ResizableBox does not seem to use `box-sizing: border box` which can cause some issues if you aren't careful */}
      <ResizableBox
        width={sidebarWidth}
        height={Infinity}
        axis="x"
        resizeHandles={['e']}
        minConstraints={[10, Infinity]} // Minimum width
        maxConstraints={[1200, Infinity]} // Maximum width
        className="h-full bg-elGray dark:bg-edDark border-r border-elDividerGray dark:border-edDividerGray group"
        style={{ overflow: 'hidden' }}
        onResize={handleResize}
        handle={<div className="absolute top-0 right-0 h-full w-2 cursor-default hover:cursor-ew-resize bg-transparent hover:bg-edBlue z-10 transition duration-200" />}
      >
        <div className="h-[92vh] overflow-y-auto p-2">
          <div className='flex justify-between border-b border-elDark dark:border-edGray'>
            <h2 className='font-bold text-xl text-elDark dark:text-edWhite whitespace-nowrap'>Deck Library</h2>
            <div ref={buttonRef} className='flex items-center'>
              <button onClick={() => buttonCreate('deck')} className='hover:bg-elLavender dark:hover:bg-edStrongHLT mr-1 rounded-md'><DeckCreateIcon /></button>
              <button onClick={() => buttonCreate('folder')} className='hover:bg-elLavender dark:hover:bg-edStrongHLT mr-1 rounded-md'><FolderCreateIcon /></button>
              <button onClick={handleExpandCollapseAll} className='hover:bg-elLavender dark:hover:bg-edStrongHLT rounded-md'>
                <ExpandContractAllIcon isExpanded={isAnyFolderOpen} />
              </button>
            </div>
          </div>
          {sidebarData && sidebarData.folders ? (
            sidebarData.folders.length > 0 ? (
              sidebarData.folders.map((folder, index) => (
                <Folder key={index} folder={folder} onRightClick={handleRightClick} folderStates={folderStates} toggleFolder={toggleFolder} setContextMenu={setContextMenu} selected={selected} setSelected={setSelected} folderRef={folderRef} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver} />
              ))
            ) : (
              <p>You have no decks!</p>
            )

          ) : (
            <div className='text-black'>Loading...</div>
          )}

          {/* Render root-level decks */}
          {sidebarData && sidebarData.decks && sidebarData.decks.length > 0 && (
            <div className="mb-4">
              {sidebarData.decks.map((deck, index) => (
                <div
                  key={index}
                  className="text-elDark dark:text-edWhite flex items-center select-none mt-2"
                  onContextMenu={(e) => handleRightClick(e, deck)}
                  onDragStart={(e) => handleDragStart(e, deck)}
                  onDrop={(e) => handleDrop(e, null)}
                  onDragOver={handleDragOver}
                >
                  <Link to={`/decks/${deck.deck_id}`}>
                    <p className="overflow-x-auto whitespace-nowrap hover:text-edBlue">~ {deck.name}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </ResizableBox>

      {contextMenu && (
        <div
          ref={popupRef}
          className="absolute bg-edDarker text-white p-2 z-[9999] flex flex-col rounded-md border border-eGray"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          {selected && ( // Right-click on folder or deck
            <>
              <div
                className='px-1 py-1 cursor-pointer text-[1rem] hover:bg-eHLT'
                onClick={() => setCreateType('deck')}
              >
                Create Deck
              </div>
              <div
                className='px-1 py-1 cursor-pointer text-[1rem] hover:bg-eHLT'
                onClick={() => setCreateType('folder')}
              >
                Create Folder
              </div>
              <div
                className='px-1 py-1 cursor-pointer text-[1rem] hover:bg-eHLT'
                onClick={() => {
                  setRenaming(true);
                  setNewName(selected.name);
                }}
              >
                Rename
              </div>
              <div
                className='px-1 py-1 cursor-pointer text-[1rem] hover:bg-eHLT'
                onClick={handleDelete}
              >
                Delete
              </div>
              <div
                className='px-1 py-1 cursor-pointer text-[1rem] hover:bg-eHLT text-eRed'
                onClick={() => { setNewName(''); setContextMenu(null); setCreateType(''); }}>
                Cancel
              </div>
            </>
          )}

          {!selected && ( // Right-click on empty space
            <>
              <div
                className='px-1 py-1 cursor-pointer text-[1rem] hover:bg-eHLT'
                onClick={() => setCreateType('folder')}
              >
                Create Folder
              </div>
              <div
                className='px-1 py-1 cursor-pointer text-[1rem] hover:bg-eHLT'
                onClick={() => setCreateType('deck')}
              >
                Create Deck
              </div>
              <div
                className='px-1 py-1 cursor-pointer text-[1rem] hover:bg-eHLT text-eRed'
                onClick={() => { setNewName(''); setContextMenu(null); setCreateType(''); }}>
                Cancel
              </div>
            </>
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
                {/* <button onClick={() => { setNewName(''); setContextMenu(null); setCreateType('') }}>Cancel</button> */}
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
        <div ref={popupRef} style={{ position: 'absolute', top: '50px', left: '50px', background: 'black', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', zIndex: 9999, color: 'white' }}>
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

const Folder = ({ folder, onRightClick, folderStates, toggleFolder, setContextMenu, selected, setSelected, folderRef, onDragStart, onDrop, onDragOver }) => {

  const handleLeftClick = (event) => {
    // console.log("clicked")
    // console.log(folder)

    event.preventDefault();
    event.stopPropagation();


    setSelected(folder);
    toggleFolder(folder.folder_id);
  };

  return (
    <div ref={folderRef} className="mt-2" draggable onDragStart={(e) => onDragStart(e, folder)} onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, folder)}>
      <div onClick={handleLeftClick} onContextMenu={(e) => onRightClick(e, folder)}
        className={`cursor-pointer text-elDark dark:text-edWhite flex items-center select-none ${selected === folder ? 'bg-gray-300 dark:bg-edMedGray' : ''}`}>
        <ChevronIcon
          isOpen={folderStates[folder.folder_id]}
        />
        <p className="overflow-x-auto">{folder.name}</p>
      </div>
      {folderStates[folder.folder_id] && (
        <div className="ml-2 border-l border-edGray">
          {folder.decks.map((deck, index) => (
            <div key={index} className="text-elDark dark:text-edWhite flex items-center select-none ml-2 mt-2" onContextMenu={(e) => onRightClick(e, deck)} draggable onDragStart={(e) => onDragStart(e, deck)} onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, folder)}>
              <Link to={`/decks/${deck.deck_id}`}>
                <p className="overflow-x-auto whitespace-nowrap hover:text-edBlue">{deck.name}</p>
              </Link>
            </div>
          ))}
          {folder.children &&
            folder.children.map((child, index) => (
              <Folder key={index} folder={child} className="mt-2" onRightClick={onRightClick} folderStates={folderStates} toggleFolder={toggleFolder} setContextMenu={setContextMenu} selected={selected} setSelected={setSelected} folderRef={folderRef} onDragStart={onDragStart} onDrop={onDrop} onDragOver={onDragOver}
              />
            ))}
        </div>
      )}
    </div>
  );
};


export default Sidebar;