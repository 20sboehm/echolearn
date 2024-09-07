import React, { useEffect, useState } from 'react';
import api from '../utils/api';

function ProfilePage() {
  const { _get } = api();
  const [profile, setProfile] = useState({ username: '', age: '', country: '' }); // 添加 username
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await _get('/api/profile/me');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError('Failed to fetch profile data');
      }
    }

    fetchProfile();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Age:</strong> {profile.age}</p>
      <p><strong>Country:</strong> {profile.country}</p>
    </div>
  );
}

export default ProfilePage;