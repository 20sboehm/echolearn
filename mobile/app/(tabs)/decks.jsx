import { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Context } from '../../context/globalContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarkdownPreviewer from '../help/markdownPreviewer';

const Decks = () => {
  const { deckId } = useLocalSearchParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const globalContext = useContext(Context);
  const { domain, token } = globalContext;

  const [decks, setDecks] = useState([]); // To hold all decks if deckId is null
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all decks if deckId is null
  const fetchDecks = async () => {
    try {
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

      // If deckId is provided, fetch specific deck and cards
      if (deckId) {
        fetchDeck(deckId);
      }
    } catch (error) {
      console.error("Error fetching decks:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDeck = async (deckId) => {
    try {
      const response = await fetch(`${domain}/api/decks/${deckId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error("Failed to fetch deck");
      const fetchedDeck = await response.json();
      setDeck(fetchedDeck);
      fetchCards(deckId);
    } catch (error) {
      console.error("Error fetching deck:", error);
    }
  };

  const fetchCards = async (deckId) => {
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
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (deckId) {
        await fetchDeck(deckId);
      } else {
        await fetchDecks();
      }
    };
    fetchData();
  }, [deckId]);

  const onRefresh = () => {
    setRefreshing(true);
    if (deckId) {
      fetchDeck(deckId);  // Fetch the specific deck if deckId is provided
    } else {
      fetchDecks();  // Otherwise, fetch all decks
    }
  };

  // <Text className="text-white font-psemibold border border-r border-gray-300 w-[45vw] p-4 bg-gray-700">{card.question}</Text>
  // <Text className="text-white font-psemibold border border-r border-gray-300 w-[45vw] p-4 bg-gray-700">{card.answer}</Text>
  // <MarkdownPreviewer content={card.question} className="text-white w-[45vw] bg-gray-700" />
  // <MarkdownPreviewer content={card.answer} />

  // Show loading indicator while fetching data
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (deckId) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff" // iOS indicator color
              colors={['#0000ff']} // Android indicator color
            />
          }
        >
          <View className="mt-10 ml-2">
            <Link href="/decks" className='bg-gray-700 p-2 w-[30vw] mb-4'>
              <Text className="text-gray-300 text-lg rounded mb-4">Back</Text>
            </Link>
            {/* Conditionally render deck name */}
            {deck ? (
              <Text className="text-3xl text-white font-pextrabold">{deck.name}</Text>
            ) : (
              <Text className="text-white">Deck not found</Text>
            )}
            <View className="flex flex-row mt-2">
              <Link href={`/reviews?deckIds=${deck?.deck_id}`} className="w-[20vw] text-center bg-blue-500 p-2 rounded mr-4">
                <Text className="text-white">Study</Text>
              </Link>
              <Link href={`/reviews?deckIds=${deck?.deck_id}&studyAll=true`} className="w-[20vw] text-center bg-blue-500 p-2 rounded">
                <Text className="text-white">Study All</Text>
              </Link>
            </View>
          </View>

          {/* Display sorted cards */}
          <View className="mt-5 ml-2">
            <Text className="text-xl text-white font-pbold">Cards:</Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-gray-300 font-pblack w-[45vw] text-center">Question:</Text>
              <Text className="text-gray-300 font-pblack w-[50vw] text-center">Answer:</Text>
            </View>
            <ScrollView className="mt-2 pb-10 h-[65vh]">
              {cards.length > 0 ? (
                cards.map((card) => (
                  <View key={card.card_id} className="p-2">
                    <View className="flex-row justify-between items-center border-b border-gray-300 pb-4">
                      <MarkdownPreviewer
                        content={card.question}
                        className="border border-gray-300 w-[45vw] p-4 bg-gray-700 mr-4"
                      />
                      <MarkdownPreviewer
                        content={card.answer}
                        className="border border-gray-300 w-[45vw] p-4 bg-gray-700"
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400">No cards inside the deck.</Text>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If deckId is null/undefined, show all deck names
  return (
    <SafeAreaView className="bg-primary h-full" refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor="#fff" // iOS indicator color
        colors={['#0000ff']} // Android indicator color
      />
    }>
      <ScrollView className="mb-2 pb-10 h-[65vh]">
        <Text className="text-3xl text-white font-pextrabold m-4">Choose a Deck:</Text>
        {decks.length > 0 ? (
          decks.map((deck) => (
            <TouchableOpacity key={deck.deck_id.toString()} onPress={() => setLoading(true)}>
              <View className="p-4 border-b border-gray-300">
                <Link href={`/decks?deckId=${deck.deck_id}`} className="flex-1 mt-1">
                  <Text className="text-white font-psemibold">{deck.name}</Text>
                </Link>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-white">No decks available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Decks;
