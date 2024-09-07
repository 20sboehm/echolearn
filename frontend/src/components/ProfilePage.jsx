import React, { useEffect, useState } from 'react';
import api from '../utils/api'; // 修正导入路径为 api

function ProfilePage() {
  const { _get } = api(); // 使用 _get 方法
  const [profile, setProfile] = useState({ age: '', country: '' });
  const [error, setError] = useState(null); // 错误状态

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
      <p><strong>Age:</strong> {profile.age}</p>
      <p><strong>Country:</strong> {profile.country}</p>
    </div>
  );
}

export default ProfilePage;