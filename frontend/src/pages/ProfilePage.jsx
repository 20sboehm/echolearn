import React, { useEffect, useState } from 'react';
// import api from '../utils/api';
import { Link, useSearchParams } from 'react-router-dom';
import defaultAvatar from "../assets/defaltUser.png";
import FriendsPage from './FriendsPage';
import { useApi } from "../hooks";
import { useMutation, useQueryClient } from "react-query";

function ProfilePage() {
  const api = useApi();
  // const { _get, _patch, _post } = api();
  // profile
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  // const [profile, setProfile] = useState({ username: '', age: '', country: '', email: '', flip_mode: true, sidebar_open: false, light_mode: false });
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const [editableUsername, setEditableUsername] = useState('');
  const [editableEmail, setEditableEmail] = useState('');
  const [editableAge, setEditableAge] = useState('');
  const [editableCountry, setEditableCountry] = useState('');
  const [popupText, setPopupText] = useState("");

  // Setting
  const [flipOrSet, setFlipOrSet] = useState(true);
  const [sidebarClosed, setSidebarClosed] = useState(false);
  const [lightMode, setLightMode] = useState(false);

  // Tabs (other info)
  const [folders, setFolders] = useState([]);
  const [rootDecks, setRootDecks] = useState([]);
  const [RatedDeck, setRatedDeck] = useState([]);
  const [activeTab, setActiveTab] = useState('folders');

  // User avatar
  const apiClient = useApi();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  // Notification settings
  const [toggleNotifications, setToggleNotifications] = useState(false);
  const [notificationTime, setNotificationTime] = useState("");

  const selectedTabClassName = "bg-elSkyBlue text-white dark:bg-edMedGray";
  const unselectedTabClassName = "bg-elLightGray text-elDarkGray dark:bg-edDarkGray dark:text-white";
  const [isEditingField, setIsEditingField] = useState({
    username: false,
    email: false,
    phoneNumber: false,
    age: false,
    country: false,
  });

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
    "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
    "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan",
    "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
    "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
    "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
    "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
    "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  async function fetchProfile() {
    try {
      const endpoint = userId ? `/api/profile/me?userId=${userId}` : '/api/profile/me';
      const response = await api._get(endpoint);
      const data = await response.json();
      setProfile(data);
      setEditableUsername(data.username);
      setEditableEmail(data.email);
      setEditableAge(data.age);
      setEditableCountry(data.country);
      setAvatar(data.avatar || defaultAvatar);

      if (data.is_owner) {
        setFlipOrSet(data.flip_mode);
        setSidebarClosed(data.sidebar_open);
        setLightMode(data.light_mode);

        if (!data.light_mode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      const folderEndpoint = userId ? `/api/profile/folders_decks?userId=${userId}` : '/api/profile/folders_decks';
      const foldersResponse = await api._get(folderEndpoint);
      const foldersData = await foldersResponse.json();
      setFolders(foldersData.folders);
      setRootDecks(foldersData.decks);
      const RatedResponse = await api._get('/api/profile/ALLRatedDecks');
      const RatedDeck = await RatedResponse.json();
      setRatedDeck(RatedDeck);
    } catch (error) {
      console.log(error)
      setError('Failed to fetch profile data');
    }
  }

  const fetchUserSettings = async () => {
    try {
      const response = await api._get('/api/emails/get-notification-settings');
      const data = await response.json();

      setToggleNotifications(data.wants_notification);

      // Convert UTC ISO string to a Date object in local time
      const localTime = new Date(data.notification_time);  // Convert the ISO string to a Date object in local time
      const hours = localTime.getHours().toString().padStart(2, '0');  // Get the local hours and ensure two digits
      const minutes = localTime.getMinutes().toString().padStart(2, '0');  // Get the local minutes and ensure two digits
      const formattedTime = `${hours}:${minutes}`;  // Format as HH:mm

      setNotificationTime(formattedTime);
    } catch (error) {
      console.error('Failed to obtain notification settings.', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserSettings();
  }, []);

  // useEffect(() => {
  //   fetchUserSettings();
  // }, []);

  const uploadMutation = useMutation(
    async (formData) => {
      const response = await apiClient._postFile("/api/profile/upload_avatar", formData);
      if (!response.ok) throw new Error("Avatar upload fail");
      return response.json();
    },
    {
      onSuccess: (data) => {
        console.log("Success");
        setAvatar(data.avatar_url);
        console.log("Avatar URL:", data.avatar_url);
        setPreview(null);
        setFile(null);
        queryClient.invalidateQueries("profile", { refetchActive: true });
        window.location.reload();
      },
      onError: () => alert("Failed to upload avatar")
    }
  );

  const handleUpdateNotificationSettings = async () => {
    const [hours, minutes] = notificationTime.split(":");

    // Create a new Date object for today with the specified time in local time (provided by user)
    const now = new Date();
    now.setHours(parseInt(hours), parseInt(minutes), 0);

    // toISOString will automatically convert to UTC based off the current local time zone
    const notificationTimeUTC = now.toISOString();

    let data = {
      wants_notification: toggleNotifications,
      notification_time: notificationTimeUTC
    }

    const response = await api._post('/api/emails/update-notification-settings', data);

    if (response.ok) {
      console.log("Notification settings updated!");
    } else {
      let data = await response.json();
      console.log(data.error)
    }
  };

  // Edit handle here
  const handleEditClick = (field) => {
    if (!profile.is_owner) {
      setPopupText("Not able to edit other user");
      setTimeout(() => setPopupText(""), 1000);
      return;
    }
    setIsEditingField((prev) => ({ ...prev, [field]: true }));
  };

  // Save handle here
  const handleSaveClick = async (field) => {
    const updatedData = {};

    // Determine which fields need to be updated based on the current field being edited
    switch (field) {
      case 'username':
        updatedData.username = editableUsername;
        break;
      case 'email':
        updatedData.email = editableEmail;
        break;
      case 'age':
        updatedData.age = editableAge;
        break;
      case 'country':
        updatedData.country = editableCountry;
        break;
      default:
        return;
    }
    try {
      const response = await api._patch('/api/profile/me', updatedData);
      const data = await response.json();
      setProfile(data);
      // Reset the editing state for the specific field
      setIsEditingField((prevState) => ({
        ...prevState,
        [field]: false,
      }));
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  const handleCancelClick = (field) => {
    switch (field) {
      case 'username':
        setEditableUsername(profile.username);
        break;
      case 'email':
        setEditableEmail(profile.email);
        break;
      case 'age':
        setEditableAge(profile.age);
        break;
      case 'country':
        setEditableCountry(profile.country);
        break;
      default:
        return;
    }

    // Reset the editing state
    setIsEditingField((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };

  const handleFlipOrSetChange = async () => {
    const newFlipOrSet = !flipOrSet;
    setFlipOrSet(newFlipOrSet);
    try {
      const response = await api._patch('/api/profile/me', { flip_mode: newFlipOrSet });
    } catch (error) {
      setError('Failed to update flip or set setting');
    }
  };

  const handleSidebarChange = async () => {
    const newSidebarClosed = !sidebarClosed;
    setSidebarClosed(newSidebarClosed);
    try {
      const response = await api._patch('/api/profile/me', { sidebar_open: newSidebarClosed });
    } catch (error) {
      setError('Failed to update sidebar closed setting');
    }
  };

  const handleLightMode = async () => {
    const newLightMode = !lightMode;
    setLightMode(newLightMode);

    if (newLightMode == false) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      const response = await api._patch('/api/profile/me', { light_mode: newLightMode });
    } catch (error) {
      setError('Failed to update sidebar closed setting');
    }
  };

  // const uploadMutation = useMutation(
  //   async (formData) => {
  //     const response = await apiClient._postFile("/api/profile/upload_avatar", formData);
  //     if (!response.ok) throw new Error("Avatar upload fail");
  //     return response.json();
  //   },
  //   {
  //     onSuccess: (data) => {
  //       console.log("Success");
  //       setAvatar(data.avatar_url);
  //       console.log("Avatar URL:", data.avatar_url);
  //       setPreview(null);
  //       setFile(null);
  //       queryClient.invalidateQueries("profile", { refetchActive: true });
  //       window.location.reload();
  //     },
  //     onError: () => alert("Failed to upload avatar")
  //   }
  // );

  const handleAvatarChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 1 * 1024 * 1024) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      alert("avatar size need < 1MB");
    }
  };

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    uploadMutation.mutate(formData);
  };

  return (
    <div className={`w-3/4 text-left flex mt-4 ${profile.is_owner ? '' : 'justify-center'}`}>
      {/* Left column: User Profile Information */}
      <div className={`h-1/2 ml-4 ${profile.is_owner ? 'w-2/3' : 'w-2/4'}`}>
        {/* Profile header */}
        <div className="flex items-center -mt-2">

          <div className="profile-page">
            <div className={`relative w-[100px] h-[100px] ${profile.is_owner ? "cursor-pointer" : ""}`}
              {...(profile.is_owner && { onClick: () => document.getElementById('avatarInput').click() })}>
              <img
                src={preview || avatar}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
              />
            </div>

            {profile.is_owner && (
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            )}

            {profile.is_owner && file && (
              <button onClick={handleUpload} className="button-common button-blue">
                Upload
              </button>
            )}
          </div>

          <div className="ml-4">
            <h1 className="text-3xl font-bold text-elDark dark:text-edWhite">{profile.username}</h1>
          </div>
        </div>

        <div className='w-[95%]'>
          {/* Profile Details Section */}
          <div className="bg-elDarkGray dark:bg-edDarker p-4 rounded-lg mt-4">
            {/* Username */}
            <EditableField
              label="Name"
              value={editableUsername}
              isEditing={isEditingField.username}
              onEdit={() => handleEditClick('username')}
              onSave={() => handleSaveClick('username')}
              onCancel={() => handleCancelClick('username')}
              onChange={(newVal) => setEditableUsername(newVal)}
            />

            {/* Email */}
            <EditableField
              label="Email"
              value={editableEmail}
              isEditing={isEditingField.email}
              onEdit={() => handleEditClick('email')}
              onSave={() => handleSaveClick('email')}
              onCancel={() => handleCancelClick('email')}
              onChange={(newVal) => setEditableEmail(newVal)}
            />

            {/* Age */}
            <EditableField
              label="Age"
              value={editableAge}
              isEditing={isEditingField.age}
              inputType="number"
              onEdit={() => handleEditClick('age')}
              onSave={() => handleSaveClick('age')}
              onCancel={() => handleCancelClick('age')}
              onChange={(newVal) => setEditableAge(Number(newVal))}
            />

            {/* Country */}
            <EditableField
              label="Country"
              value={editableCountry}
              isEditing={isEditingField.country}
              inputType="select"
              options={countries}
              onEdit={() => handleEditClick('country')}
              onSave={() => handleSaveClick('country')}
              onCancel={() => handleCancelClick('country')}
              onChange={(newVal) => setEditableCountry(newVal)}
            />

          </div>
        </div>

        <div className='h-2/3 mt-2 text-elDark dark:text-edWhite'>
          {/* Tab Buttons */}
          <div className="flex space-x">
            <button
              className={`py-2 px-4 rounded-lg ${activeTab === 'folders' ? `${selectedTabClassName}` : `${unselectedTabClassName}`}`}
              onClick={() => profile.is_owner && setActiveTab('folders')}
            >
              Folders
            </button>
            <button
              className={`py-2 px-4 rounded-lg ${activeTab === 'ratedDecks' ? `${selectedTabClassName}` : `${unselectedTabClassName}`}`}
              onClick={() => profile.is_owner && setActiveTab('ratedDecks')}
            >
              Favorite Decks
            </button>
            <button
              className={`py-2 px-4 rounded-lg ${activeTab === 'friends' ? selectedTabClassName : unselectedTabClassName}`}
              onClick={() => profile.is_owner && setActiveTab('friends')}
            >
              Friends
            </button>
          </div>

          {/* Container for Tabs and Content */}
          <div className="w-[95%] bg-elSkyBlue dark:bg-edMedGray rounded-lg p-4 shadow-md overflow-x-auto max-h-64">

            {/* Display Content Based on Active Tab */}
            {activeTab === 'folders' && (
              <div>
                <h2 className="text-xl font-bold text-white">Folders and Decks</h2>
                {folders.length > 0 ? (
                  folders.map((folder) => <Folder key={folder.folder_id} folder={folder} is_owner={profile.is_owner} />)
                ) : (
                  <p>No folders or decks available</p>
                )}
                {rootDecks.length > 0 ? (
                  rootDecks.map((deck) => (
                    <Link key={deck.deck_id} to={`/decks/public/${deck.deck_id}`} className="flex items-center">
                      <span className="mx-2 mt-2">📚</span>
                      <p className="overflow-x-auto whitespace-nowrap">{deck.name}</p>
                    </Link>
                  ))
                ) : (
                  null
                )}
              </div>
            )}

            {activeTab === 'ratedDecks' && (
              <div>
                <h2 className="text-xl font-bold text-white">favorite Decks</h2>
                {RatedDeck.length > 0 ? (
                  RatedDeck.map((rDeck) => (
                    <Link key={rDeck.deck_id} to={`/decks/public/${rDeck.deck_id}`} style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="mr-2">📚</span>
                      <p className="overflow-x-auto whitespace-nowrap">{rDeck.name}</p>
                    </Link>
                  ))
                ) : (
                  <p className='text-elDark dark:text-white'>No favorite deck</p>
                )}
              </div>
            )}

            {/* Friends Tab Content */}
            {activeTab === 'friends' && (
              <div>
                <FriendsPage />
              </div>
            )}
          </div>

        </div>
      </div>

      {profile.is_owner && (
        <div className="w-1/3">
          <div className='pl-10 pb-4 border border-elDark dark:border-edWhite rounded-lg'>
            <h2 className="text-2xl mt-2 font-bold text-elDark dark:text-edWhite">Settings</h2>
            {/* Review Animation */}
            <ToggleSetting
              label="Review animation:"
              leftLabel="Flash card"
              rightLabel="Question set"
              value={flipOrSet}
              onChange={handleFlipOrSetChange}
            />

            {/* Sidebar default setting */}
            <ToggleSetting
              label="Sidebar default state:"
              leftLabel="Open"
              rightLabel="Close"
              value={sidebarClosed}
              onChange={handleSidebarChange}
            />

            {/* light mode setting */}
            <ToggleSetting
              label="Color theme:"
              leftLabel="Light mode"
              rightLabel="Dark mode"
              value={lightMode}
              onChange={handleLightMode}
            />

            <h2 className='mt-8 border-t py-4 font-semibold'>Notification Settings</h2>

            <input type='checkbox' id='toggleEmailNotifs' name='toggleEmailNotifs' checked={toggleNotifications}
              onChange={(e) => { setToggleNotifications(!toggleNotifications) }} />
            <label htmlFor="toggleEmailNotifs" className='ml-2'>Enable Email Notifications</label>

            <div>
              <input type="time" id='notifTime' name='notifTime' value={notificationTime} onChange={(e) => { setNotificationTime(e.target.value) }}
                className='text-black mt-2 p-1' />
              <label htmlFor="notifTime" className='ml-2' >Time</label>
            </div>

            <button className='button-common p-1.5 mt-4' onClick={handleUpdateNotificationSettings}>Update Notification Settings</button>

            {/* Possible add setting for profile visible level (public, friend only, private) */}
          </div>
        </div>
      )}
      {/* Popup message display */}
      {popupText && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 mb-4 bg-edRed text-white p-2 rounded shadow-lg">
          {popupText}
        </div>
      )}
    </div>
  );
}


//  Starting from down here is helper methods to make the code look nicer
const ToggleSetting = ({ label, leftLabel, rightLabel, value, onChange }) => {
  return (
    <div className="flex flex-col mt-4">
      <label className="flex items-center">
        <p className="text-big font-bold text-elDark dark:text-edWhite">{label}</p>
      </label>
      <div className="flex items-center mt-2">
        <span className="mr-4 text-elDark dark:text-edWhite">{leftLabel}</span>

        {/* Toggle Switch */}
        <div onClick={onChange} className="flex items-center w-12 h-6 rounded-full bg-gray-700 dark:bg-edDarkGray cursor-pointer p-1 transition-colors duration-300">
          {/* Ball that moves left or right */}
          <div
            className={`w-4 h-4 bg-elBlack dark:bg-white rounded-full shadow-md transform transition-transform duration-300 ${value ? 'translate-x-0' : 'translate-x-6'}`}
          ></div>
        </div>

        <span className="ml-4 text-elDark dark:text-edWhite">{rightLabel}</span>
      </div>
    </div>
  );
};

// Folder component to handle folder and nested folders
const Folder = ({ folder, onRightClick, is_owner }) => {
  const [openFolder, setOpenFolder] = useState(false);

  const handleOpenFolder = () => {
    setOpenFolder(!openFolder);
  };

  return (
    <div className="mt-2 text-elDark dark:text-edWhite">
      <div
        onClick={handleOpenFolder}
        onContextMenu={(e) => onRightClick(e, folder)}
        className="cursor-pointer eWhite flex"
      >
        <span className="w-6 h-6 ml-2">{openFolder ? "📂" : "📁"}</span>
        <p className="overflow-x-auto">{folder.name}</p>
      </div>

      {openFolder && (
        <div className="ml-4">

          {/* Displays decks in the folder */}
          {folder.decks.length > 0 ? (
            folder.decks.map((deck) => (
              <div key={deck.deck_id} className="flex items-center ml-2" onContextMenu={(e) => onRightClick(e, deck)}>
                <Link to={is_owner ? `/decks/${deck.deck_id}` : `/decks/public/${deck.deck_id}`} style={{ display: "flex", alignItems: "center" }}>
                  <span className="mr-2">📚</span>
                  <p className="overflow-x-auto whitespace-nowrap">{deck.name}</p>
                </Link>
              </div>
            ))
          ) :
            // (<p className=''>No decks in this folder</p>)
            null}

          {/* Show subfolders */}
          {folder.children && folder.children.length > 0 && (
            <div className="ml-3">
              {folder.children.map((childFolder) => (
                <Folder key={childFolder.folder_id} folder={childFolder} onRightClick={onRightClick} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


const EditableField = ({ label, value, isEditing, inputType = 'text', options = [], onEdit, onSave, onCancel, onChange }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <strong className="mr-2">{label}:</strong>
        {isEditing ? (
          // select will be use for Country
          inputType === 'select' ? (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="bg-gray-800 p-2 rounded"
            >
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={inputType}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="bg-gray-800 p-2 rounded"
            />
          )
        ) : (
          value
        )}
      </div>

      {/* Save or Edit button */}
      {isEditing ? (
        <div>
          <button
            className="bg-green-500 px-4 my-2 rounded hover:bg-green-600 transition mr-2 text-white"
            onClick={onSave}
          >
            Save
          </button>
          <button
            className="bg-red-500 px-4 my-2 rounded hover:bg-red-600 transition text-white"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="bg-gray-600 px-4 my-2 rounded hover:bg-gray-500 transition"
          onClick={onEdit}
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default ProfilePage;