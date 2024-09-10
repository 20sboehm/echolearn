import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const { _get, _patch } = api();
  const [profile, setProfile] = useState({ username: '', age: '', country: '', email: '' });
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableAge, setEditableAge] = useState('');
  const [editableCountry, setEditableCountry] = useState('');

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

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await _get('/api/profile/me');
        const data = await response.json();
        setProfile(data);
        setEditableAge(data.age);
        setEditableCountry(data.country);

        const foldersResponse = await _get('/api/profile/folders_decks');
        const foldersData = await foldersResponse.json();
        setFolders(foldersData);
      } catch (error) {
        setError('Failed to fetch profile data');
      }
    }

    fetchProfile();
  }, []);

  // Edit handle here
  const handleEditClick = () => {
    setEditableAge(profile.age);
    setEditableCountry(profile.country);
    setIsEditing(true);
  };

  // Save handle here
  const handleSaveClick = async () => {
    try {
      const response = await _patch('/api/profile/me', {
        age: editableAge,
        country: editableCountry
      });
      const data = await response.json();
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="ml-0 w-3/4 text-left">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>

      {/* Age */}
      <p>
        <strong>Age:</strong>
        {isEditing ? (
          <input
            type="number"
            value={editableAge}
            onChange={(e) => setEditableAge(Number(e.target.value))}
          />
        ) : (
          profile.age
        )}
      </p>

      {/* Country */}
      <p>
        <strong>Country:</strong>
        {isEditing ? (
          <select
            value={editableCountry}
            onChange={(e) => setEditableCountry(e.target.value)}
            className="border p-2 rounded"
          >
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        ) : (
          profile.country
        )}
      </p>

      {/* Edit and Save button */}
      {isEditing ? (
        <button
        onClick={handleSaveClick}
        className="mt-2 border px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
      >
        Save
      </button>
    ) : (
      <button
        onClick={handleEditClick}
        className="mt-2 border px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        Edit
      </button>
      )}

      {/* Display Folders and Decks */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">Folders and Decks</h2>
        {folders.length > 0 ? (
          folders.map(folder => (
            <div key={folder.folder_id} className="mt-2">
              <p><strong>{folder.name}:</strong></p>
              <ul className="ml-4">
                {folder.decks.length > 0 ? (
                  folder.decks.map(deck => (
                    <li key={deck.deck_id}>
                      <Link to={`/decks/${deck.deck_id}`} className="text-blue-500 hover:underline">
                        {deck.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>No deck in this folder</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No folders or decks available</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;