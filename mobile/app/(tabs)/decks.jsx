import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import { useLocalSearchParams, Link } from 'expo-router';
import { Context } from '../../context/globalContext';
import { SafeAreaView } from 'react-native-safe-area-context'

const Decks = () => {
  const { deckId } = useLocalSearchParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const globalContext = useContext(Context);
  const { domain, token } = globalContext;


  const fetchDeck = async () => {
    try {
      console.log(deckId);
      const response = await fetch(`${domain}/api/decks/${deckId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error("Failed to fetch decks");
      const fetchedDeck = await response.json();
      setDeck(fetchedDeck);
      console.log(fetchedDeck);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchCards = async () => {
    try {
      const response = await fetch(`${domain}/api/decks/${deckId}/cards`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error("Failed to fetch cards");
      const { cards: fetchedCards } = await response.json();
      // Sort cards according to deck's order_List

      setCards(fetchedCards);
      console.log(fetchedCards);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (deckId) {
      const fetchData = async () => {
        await fetchDeck();
        await fetchCards();
        setLoading(false);
      };
      fetchData();
    }
  }, [deckId]);

  // Show loading indicator while fetching data
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }


  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="mt-10 ml-2">
        <Text className="text-3xl text-white font-pextrabold">{deck.name}</Text>
        <Link href={`/reviews?deckIds=${deck.deck_id}`} className="mt-2 w-[20vw] text-center bg-blue-500 p-2 rounded">
          <Text className="text-white">Study</Text>
        </Link>
      </View>

      {/* Display sorted cards */}
      <View className="mt-5 ml-2">
        <Text className="text-xl text-white font-pbold">Cards:</Text>
        <ScrollView className="mt-2 pb-10">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <View key={card.card_id} className="mt-2 p-2 border-b border-gray-300">
              <Text className="text-white font-semibold">Q{index + 1}: {card.question}</Text>
              <Text className="text-gray-300">A: {card.answer}</Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-400">No cards available.</Text>
        )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Decks