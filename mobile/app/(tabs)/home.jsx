import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context/globalContext'; // Import your global context
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(""); // State for error messages
  const globalContext = useContext(Context);
  const { domain, token } = globalContext; // Get domain and token from context

  useEffect(() => {
    const fetchDecksAndCards = async () => {
      try {
        // Fetch decks
        const decksResponse = await fetch(`${domain}/api/decks`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!decksResponse.ok) throw new Error("Failed to fetch decks");

        const fetchedDecks = await decksResponse.json();
        setDecks(fetchedDecks);

        // Fetch cards
        const cardsResponse = await fetch(`${domain}/api/cards`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!cardsResponse.ok) throw new Error("Failed to fetch cards");

        const fetchedCards = await cardsResponse.json();
        setCards(fetchedCards);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDecksAndCards();
  }, [domain, token]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading indicator
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>; // Show error message
  }

  const DeckRow = ({ deck }) => {
    const newCardsCount = cards.filter(card => card.deck_id === deck.deck_id && card.is_new).length;
    const reviewCardsCount = cards.filter(
      card => card.deck_id === deck.deck_id && !card.is_new && Date.parse(card.next_review) < Date.now()
    ).length;

    if (newCardsCount === 0 && reviewCardsCount === 0) {
      return null; // Skip decks with no new or review cards
    }

    return (
      <View className="flex-row justify-between p-4 border-b border-gray-300">
        <Text className="text-white flex-1">{deck.name}</Text>
        <Text className="text-white flex-0.5 mr-5">{newCardsCount}</Text>
        <Text className="text-white flex-0.5 mr-5">{reviewCardsCount}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Review', { deckIds: deck.deck_id })}
          className="bg-blue-500 p-2 rounded"
        >
          <Text className="text-white">Study</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="min-h-[85vh]">
        <Text className="text-2xl font-bold mb-4 text-white">Today's Task List</Text>
        <View className="flex-row justify-between p-4 border-b border-gray-300 bg-gray-700">
          <Text className="text-white flex-1 font-bold">Deck</Text>
          <Text className="text-white flex-0.5 font-bold mr-5">New</Text>
          <Text className="text-white flex-0.5 font-bold mr-10">Review</Text>
        </View>
        <FlatList
          data={decks}
          keyExtractor={(item) => item.deck_id.toString()}
          renderItem={({ item }) => <DeckRow deck={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
