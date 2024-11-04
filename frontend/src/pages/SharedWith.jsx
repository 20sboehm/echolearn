import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks';

function SharedWith() {
  const api = useApi();
  const { _get } = api;

  const [sharedDecks, setSharedDecks] = useState([]);
  const [error, setError] = useState(null);

  const fetchSharedDecks = async () => {
    try {
      const response = await _get(`/api/shared`);
      if (response.ok) {
        const data = await response.json();
        setSharedDecks(data.Decks);  // 这里从 `data.Decks` 获取共享的 decks 列表
      }
    } catch {
      setError('Failed to fetch shared decks');
    }
  };

  useEffect(() => {
    fetchSharedDecks();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-white">Shared With Me</h2>
      {error && <p className="text-red-500">{error}</p>}

      {sharedDecks.length > 0 ? (
        <ul className="mt-4">
          {sharedDecks.map((deck) => (
            <li key={deck.deck_id} className="mb-2">
              <Link to={`/decks/public/${deck.deck_id}`} className="flex items-center text-white">
                <span className="mr-2">📚</span>
                <p className="overflow-x-auto whitespace-nowrap">{deck.name}</p> {/* 注意这里的字段 `deck.name` */}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-elDark dark:text-white">No decks shared with you.</p>
      )}
    </div>
  );
}

export default SharedWith;