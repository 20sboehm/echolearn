import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function FriendsPage() {
  const { _get, _delete, _post } = api();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const fetchFriends = async () => {
    try {
      const response = await _get('/api/friends');
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends);
        setPendingRequests(data.pendingRequests);
      } else {
        setError('Failed to fetch friends list');
      }
    } catch {
      setError('Failed to fetch friends list');
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await _get(`/api/friends/search/${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setError('Failed to search users');
      }
    } catch {
      setError('Failed to search users');
    }
  };

  const handleSendRequest = async (friendId) => {
    try {
      const response = await _post(`/api/friends/${friendId}/request`);
      if (response.ok) {
        updateSearchResultStatus(friendId, 'pending_sent');
      } else {
        setError('Failed to send request');
      }
    } catch {
      setError('Failed to send request');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const response = await _delete(`/api/friends/${friendId}/delete`);
      if (response.ok) {
        setFriends(friends.filter(friend => friend.id !== friendId));
        updateSearchResultStatus(friendId, 'none');
      } else {
        setError('Failed to remove friend');
      }
    } catch {
      setError('Failed to remove friend');
    }
  };

  const handleAcceptRequest = async (friendId) => {
    try {
      const response = await _post(`/api/friends/${friendId}/accept`);
      if (response.ok) {
        setPendingRequests(pendingRequests.filter(req => req.id !== friendId));
        updateSearchResultStatus(friendId, 'friend');
        const newFriend = pendingRequests.find(req => req.id === friendId);
        if (newFriend) setFriends([...friends, newFriend]);
      } else {
        setError('Failed to accept request');
      }
    } catch {
      setError('Failed to accept request');
    }
  };

  const handleRejectRequest = async (friendId) => {
    try {
      const response = await _delete(`/api/friends/${friendId}/reject`);
      if (response.ok) {
        setPendingRequests(pendingRequests.filter(req => req.id !== friendId));
        updateSearchResultStatus(friendId, 'none');
      } else {
        setError('Failed to reject request');
      }
    } catch {
      setError('Failed to reject request');
    }
  };

  const updateSearchResultStatus = (friendId, status) => {
    setSearchResults(
      searchResults.map(user =>
        user.id === friendId ? { ...user, status } : user
      )
    );
  };

  return (
    <div className="ml-0 w-3/4 text-left">
      <h1 className="text-2xl font-bold text-white">Friends List</h1>
      {error && <p className='text-elDark dark:text-white'>{error}</p>}

      {friends.length > 0 ? (
        <ul className="mt-4">
          {friends.map(friend => (
            <li key={friend.id} className="flex justify-between mb-2">
              <span className='text-elDark dark:text-white'>{friend.username}</span>
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
        <p className='text-elDark dark:text-white'>No friends yet.</p>
      )}

      {pendingRequests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-elDark dark:text-white">Pending Friends</h2>
          <ul className="mt-4">
            {pendingRequests.map(request => (
              <li key={request.id} className="flex justify-between mb-2">
                <span className='text-elDark dark:text-white'>{request.username}</span>
                <div>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-bold text-white">Add New Friend</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username"
          className="border rounded px-2 py-1 text-elDark"
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <ul className="mt-4">
          {searchResults.map(user => (
            <li key={user.id} className="flex justify-between mb-2">
              <span className='text-elDark dark:text-white'>{user.username}</span>
              {user.status === 'friend' ? (
                <button
                  className="px-2 py-1 rounded bg-gray-500 text-white cursor-not-allowed"
                  disabled
                >
                  Friend
                </button>
              ) : user.status === 'pending_received' ? (
                <div>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleAcceptRequest(user.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                    onClick={() => handleRejectRequest(user.id)}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <button
                  className={`px-2 py-1 rounded ${
                    user.status === 'pending_sent'
                      ? 'bg-yellow-500 text-white cursor-not-allowed'
                      : 'bg-green-500 text-white'
                  }`}
                  onClick={() =>
                    user.status === 'none' ? handleSendRequest(user.id) : null
                  }
                  disabled={user.status !== 'none'}
                >
                  {user.status === 'pending_sent'
                    ? 'Pending'
                    : 'Add'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FriendsPage;