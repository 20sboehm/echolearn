import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from 'react-query';
import { Link, useParams } from "react-router-dom";
import "./SideBar.css";
import { useApi } from "../api";
import folderOpenImg from "../assets/folder-open.png"
import folderCloseImg from "../assets/folder-close.png"
import decksImg from "../assets/decks.png"

function SidebarContent({ isOpen, sidebarRef }) {
  const api = useApi();

  const [folderCreated, setFolderCreated] = useState(false);
  const [openFolderIds, setOpenFolderIds] = useState([]);
  const [sidebarData, setSidebarData] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [folderEdit, setFolderEdit] = useState(0);

  // Fetch sidebar info when the sidebar is opened for the first time
  useEffect(() => {
    if (isOpen) {
      fetchSidebarData();
    }

  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (contextMenu && (!sidebarRef.current || !sidebarRef.current.contains(event.target))) {
        setContextMenu(null); // Close the context menu
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setContextMenu(null); // Close on ESC key
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [contextMenu]);

  const fetchSidebarData = () => {
    api._get('/api/sidebar')
      .then((response) => response.json())
      .then((data) => {
        setSidebarData(data);
        setFolderCreated(true);
      })
      .catch((error) => {
        console.log('An error occurred fetching sidebar:', error);
      });
  };

  const handleCreateFolder = () => {
    setNewFolderName('');
    setContextMenu(null);
    setShowNewFolderInput(!showNewFolderInput);
    fetchSidebarData();
  };

  /**
   *  Following is the post request when user trying to create a folder with the context-menu
   */
  const sendPostRequest = () => {
    if (newFolderName.trim() === '') {
      setShowNewFolderInput(false);
      return;
    }
    createFolderMutation.mutate({ name: newFolderName, owner_id: 1 });
  }

  const createFolderMutation = useMutation(async (formData) => {
    const response = await api._post('/api/folders', formData);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return response.json();
  },
    {
      onSuccess: () => {
        setShowNewFolderInput(false);
        fetchSidebarData();
      },
    });

  /**
   *  Following is the Patch request when user trying to edit a folder name with the context-menu
   */
  const handleEditFolder = (folder_id, name) => {
    setNewFolderName(name)
    setFolderEdit(folder_id)
    setContextMenu(null);
  }

  const sendPatchRequest = () => {
    if (newFolderName.trim() === '') {
      alert("Detect blank folder name, please rename")
      return;
    }
    // depending how the backend is this will change
    editFolderMutation.mutate({ folder_id: folderEdit, name: newFolderName });
  }

  const editFolderMutation = useMutation(async (formData) => {

    const response = await api._patch(`/api/folders/${formData.folder_id}`, formData);
    // const response = await fetch('Waiting on backend', {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData),
    // });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return response.json();
  },
    {
      onSuccess: () => {
        setFolderEdit(0);
        fetchSidebarData();
      },
    });

  /**
   *  Following is the delete request when user trying to delete a folder with the context-menu
   */
  const sendDeleteRequest = async (folder_id) => {
    const response = await api._delete(`/api/folders/${folder_id}`);
    console.log("STATUS: " + response.status);
    if (response.status === 204) {
      setContextMenu(null);
      fetchSidebarData();
    } else {
      alert("Fail to delete folder, please make sure there isn't decks inside the folder to delete");
    }
  }


  const createDefaultFolder = () => {
    setFolderCreated(true);
  };

  const openFolder = (folderId) => {
    if (openFolderIds.includes(folderId)) {
      setOpenFolderIds(openFolderIds.filter(id => id !== folderId));
    } else {
      setOpenFolderIds(openFolderIds.concat(folderId));
    }
  };

  const handleContextMenu = (event, folderId, name) => {
    event.preventDefault();
    var x = event.nativeEvent.pageX
    var y = event.nativeEvent.pageY
    if (x > 230) {
      x = 200;
    }
    if (y > 650) {
      y = 550;
    }
    setContextMenu({
      x: x,
      y: y - event.nativeEvent.offsetY,
      folderId: folderId,
      name: name
    });
  };

  if (!folderCreated) {
    return (
      <div className="sidebar" ref={sidebarRef}>
        <button onClick={createDefaultFolder}>Create</button>
      </div>
    );
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef} style={{ overflowY: "auto" }}>
      <div className="Folders">
        <ul>
          {sidebarData.Folders.map(folder => (
            <li key={folder.folder_id} onClick={() => openFolder(folder.folder_id)} onContextMenu={(e) => handleContextMenu(e, folder.folder_id, folder.name)} className="mb-4 select-none">
              <div className="cursor-pointer" style={{ display: "flex", alignItems: "center" }}>
                {
                  folderEdit === folder.folder_id ? (
                    <textarea
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onClick={(e) => e.stopPropagation()} // Stop event propagation
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          sendPatchRequest();
                        }
                      }}
                      style={{ width: '100%', height: '50px', background: 'white', color: 'black' }}
                    />
                  ) : (
                    <>
                      <div className="folderContainer">
                        <img src={openFolderIds.includes(folder.folder_id) ? folderOpenImg : folderCloseImg}
                          style={{ width: openFolderIds.includes(folder.folder_id) ? "15%" : "12%", marginRight: "8px" }} />
                        <span>{folder.name}</span>
                      </div>
                      <div className="tripleDotContainer" onClick={(e) => handleContextMenu(e, folder.folder_id, folder.name)}>
                        <div className="tripleDot">⋮</div>
                      </div>
                    </>
                  )
                }
              </div>
              {openFolderIds.includes(folder.folder_id) && (
                <ul>
                  {folder.decks.map(deck => (
                    <li key={deck.deck_id} className="select-none">
                      <Link to={`/decks/${deck.deck_id}`} style={{ display: "flex", alignItems: "center" }}>
                        <img src={decksImg} style={{ width: "25%" }} />
                        {deck.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      {showNewFolderInput && (
        <div>
          <textarea
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendPostRequest();
              }
            }}
            placeholder="Enter folder name"
            style={{ width: '100%', height: '50px', background: 'white', color: 'black' }}
          />
        </div>
      )}
      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y}
        onClose={() => setContextMenu(null)}
        folderId={contextMenu.folderId}
        name={contextMenu.name}
        createFolder={handleCreateFolder}
        folderEdit={handleEditFolder}
        folderDelete={sendDeleteRequest} />}
    </div>
  );
}


function SidebarButton({ isOpen, toggleSidebar, sidebarRef }) {
  return (
    <button className={`sidebarButton p-2 py-1 rounded-md bg-[#383838] ${isOpen ? "open" : ""}`} onClick={toggleSidebar}>
      {isOpen ? "←" : "→"}
    </button>
  );
}

function ContextMenu({ x, y, folderId, name, createFolder, folderEdit, folderDelete }) {
  return (
    <ul className="context-menu" style={{ top: y - 30, left: x, position: 'absolute', backgroundColor: 'black', border: '1px solid #ccc' }}>
      <li onClick={createFolder} style={{ padding: '5px 15px', cursor: 'pointer' }}>Create</li>
      <li onClick={() => folderEdit(folderId, name)} style={{ padding: '5px 15px', cursor: 'pointer' }}>Rename</li>
      <li onClick={() => folderDelete(folderId)} style={{ padding: '5px 15px', cursor: 'pointer' }}>Delete</li>
    </ul>
  );
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <SidebarContent isOpen={isOpen} sidebarRef={sidebarRef} />
      <SidebarButton isOpen={isOpen} toggleSidebar={toggleSidebar} sidebarRef={sidebarRef} />
    </div>
  );
}

export default Sidebar;
