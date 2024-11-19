import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks';

function ShareDeck({ deck_id }) {
  const api = useApi();
  const { _get, _post, _delete } = api;

  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchFriends = async () => {
    try {
      const response = await _get('/api/friends');
      if (response.ok) {
        const data = await response.json();

        const friendsWithShareStatus = await Promise.all(
          data.friends.map(async (friend) => {
            const shareResponse = await _get(`/api/decks/${deck_id}/is_shared/${friend.id}`);
            return {
              ...friend,
              isShared: shareResponse.ok && await shareResponse.json(),
            };
          })
        );

        setFriends(friendsWithShareStatus);
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

  const handleShareDeck = async (userId) => {
    try {
      const response = await _post(`/api/decks/${deck_id}/share/${userId}`);
      if (response.ok) {
        setSuccessMessage('Deck shared successfully!');
        setError(null);
        fetchFriends();
      } else {
        setError('Failed to share the deck');
      }
    } catch {
      setError('Failed to share the deck');
    }
  };

  const handleUnshareDeck = async (userId) => {
    try {
      const response = await _delete(`/api/decks/${deck_id}/unshare/${userId}`);
      if (response.ok) {
        setSuccessMessage('Deck unshared successfully!');
        fetchFriends();
      } else {
        setError('Failed to unshare the deck');
      }
    } catch {
      setError('Failed to unshare the deck');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-black">Share Deck with Friends</h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {friends.length > 0 ? (
        <ul className="mt-4">
          {friends.map(friend => (
            <li key={friend.id} className="flex justify-between mb-2">
              <span className="text-black">{friend.username}</span>
              <button
                className={`px-2 py-1 rounded ${friend.isShared ? 'button-red' : 'button-blue'} text-white`}
                onClick={() => friend.isShared ? handleUnshareDeck(friend.id) : handleShareDeck(friend.id)}
              >
                {friend.isShared ? 'Unshare' : 'Share'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-elDark dark:text-white">No friends available to share.</p>
      )}
    </div>
  );
}

export default ShareDeck;