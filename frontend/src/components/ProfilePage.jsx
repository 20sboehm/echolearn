import React, { useEffect, useState } from 'react';
import api from '../utils/api';

function ProfilePage() {
  const { _get, _patch } = api();
  const [profile, setProfile] = useState({ username: '', age: '', country: '', email: '' });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableAge, setEditableAge] = useState('');
  const [editableCountry, setEditableCountry] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await _get('/api/profile/me');
        const data = await response.json();
        setProfile(data);
        setEditableAge(data.age);
        setEditableCountry(data.country);
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
          <input
            type="text"
            value={editableCountry || ""}
            onChange={(e) => setEditableCountry(e.target.value)}
          />
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
    </div>
  );
}

export default ProfilePage;