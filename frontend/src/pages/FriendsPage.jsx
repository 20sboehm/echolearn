import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function FriendsPage() {
  const { _get, _delete, _post } = api();
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 获取好友列表
  useEffect(() => {
    async function fetchFriends() {
      try {
        const response = await _get('/api/friends');
        if (response.ok) {
          const data = await response.json();
          setFriends(data);
        } else {
          setError('Failed to fetch friends list');
        }
      } catch (error) {
        setError('Failed to fetch friends list');
      }
    }
    fetchFriends();
  }, []);

  // 处理删除好友
  const handleRemoveFriend = async (friendId) => {
    try {
      const response = await _delete(`/api/friends/${friendId}/delete`);
      if (response.ok) {
        setFriends(friends.filter(friend => friend.id !== friendId));
      } else {
        setError('Failed to remove friend');
      }
    } catch (error) {
      setError('Failed to remove friend');
    }
  };

  // 处理搜索用户
  const handleSearch = async () => {
    try {
        const response = await _get(`/api/friends/search/${searchQuery}`);
        // const response = await _post(`/api/friends/1/add`);
        // const response = await _delete(`/api/friends/1/delete`);
        if (response.ok) {
            const data = await response.json();
            setSearchResults(data);
        } else {
            setError('Failed to search users');
        }
    } catch (error) {
        setError('Failed to search users');
    }
};

  // 处理添加好友
  const handleAddFriend = async (friendId) => {
    try {
      const response = await _post(`/api/friends/${friendId}/add`);
      if (response.ok) {
        // 添加成功后可以重新获取好友列表，或者直接更新 friends 状态
        setFriends([...friends, searchResults.find(user => user.id === friendId)]);
        setSearchResults(searchResults.filter(user => user.id !== friendId));
      } else {
        setError('Failed to add friend');
      }
    } catch (error) {
      setError('Failed to add friend');
    }
  };

  return (
    <div className="ml-0 w-3/4 text-left">
      <h1 className="text-2xl font-bold">Friends List</h1>
      {error && <p>{error}</p>}
      
      {/* 好友列表 */}
      {friends.length > 0 ? (
        <ul className="mt-4">
        {friends.map(friend => (
          <li key={friend.id} className="flex justify-between mb-2">
            <span>{friend.username}</span>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleRemoveFriend(friend.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      ) : (
        <p>No friends yet.</p>
      )}

      {/* 搜索框 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">Add New Friend</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username"
          className="border rounded px-2 py-1"
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>

      {/* 搜索结果 */}
      {searchResults.length > 0 && (
        <ul className="mt-4">
        {searchResults.map(user => (
          <li key={user.id} className="flex justify-between mb-2">
            <span>{user.username}</span>
            <button
              className="bg-green-500 text-white px-2 py-1 rounded"
              onClick={() => handleAddFriend(user.id)}
            >
              Add Friend
            </button>
          </li>
        ))}
      </ul>
      )}

      <Link to="/profile" className="mt-4 block text-blue-500">
        Back to Profile
      </Link>
    </div>
  );
}

export default FriendsPage;