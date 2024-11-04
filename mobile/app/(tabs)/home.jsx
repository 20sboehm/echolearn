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
  const { domain, token, userObj } = globalContext; // Get domain and token from context

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

        // Combine decks with card counts
        const decksWithCounts = fetchedDecks.map(deck => {
          const newCardsCount = fetchedCards.filter(card => card.deck_id === deck.deck_id && card.is_new).length;
          const reviewCardsCount = fetchedCards.filter(
            card => card.deck_id === deck.deck_id && !card.is_new && Date.parse(card.next_review) < Date.now()
          ).length;
          return {
            ...deck,
            totalCount: newCardsCount + reviewCardsCount, // Total count for sorting
            newCardsCount,
            reviewCardsCount,
          };
        });

        // Sort decks by total count (descending)
        decksWithCounts.sort((a, b) => b.totalCount - a.totalCount);

        setDecks(decksWithCounts);
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
      <View className="flex-row justify-between p-4 mt-2 border-b border-gray-300">
        <Text className="text-white font-psemibold mt-1 flex-1">{deck.name}</Text>
        <Text className="text-white flex-0.5 mt-1 mr-10">{newCardsCount}</Text>
        <Text className="text-white flex-0.5 mt-1 mr-8">{reviewCardsCount}</Text>
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
      <View className="pt-12 my-6 min-h-[85vh]">
        <Text className="text-4xl text-white font-pextrabold mb-4">Welcome back, {userObj.username}!</Text>
        <Text className="text-xl font-pbold mb-4 text-white">Upcoming reviews</Text>
        <View className="flex-row justify-between items-center p-4 border-b border-gray-300 bg-gray-700">
          <Text className="text-white flex-1 font-bold">Deck</Text>
          <Text className="text-white flex-0.5 font-bold mr-5">New</Text>
          <Text className="text-white flex-0.5 font-bold mr-16">Review</Text>
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
