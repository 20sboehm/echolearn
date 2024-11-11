import { View, Text, TouchableOpacity, Animated, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import { useLocalSearchParams, Link } from 'expo-router';
import { Context } from '../../context/globalContext';
import { SafeAreaView } from 'react-native-safe-area-context'
import useReviewTimes from '../help/reviewTime';
import CustomButton from '../../components/CustomButton';

const Reviews = () => {
  const { deckIds } = useLocalSearchParams();
  const { studyAll } = useLocalSearchParams();
  const [reviews, setReviews] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [rotation, setRotation] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const globalContext = useContext(Context);
  const { domain, token } = globalContext;

  const onRefresh = async () => {
    setRefreshing(true);
    setFlipped(false);
    await fetchReview();
    setRefreshing(false);
  };

  const fetchReview = async () => {
    try {
      const queryDeckIds = Array.isArray(deckIds) ? deckIds.join(',') : deckIds;
      // for some weird reason it has to be api/reviews/ in-order to work
      let url = `${domain}/api/reviews/?deckIds=${queryDeckIds}`;

      // Add studyAll to the query string only if it's defined
      if (studyAll !== undefined) {
        url += `&studyAll=${studyAll}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const { decks: fetchedReview } = await response.json();
      setReviews(fetchedReview);
      setCurrentCardIndex(0);
      setFlipped(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const cardId = reviews?.[0]?.cards?.[currentCardIndex]?.card_id;
  const { reviewTimes, isLoading, error } = useReviewTimes(cardId, domain, token);

  const nextCard = () => {
    if (currentCardIndex < reviews[0]?.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      toggleFlip();
    }
  };

  const toggleFlip = () => {
    const toValue = flipped ? 0 : 360;
    setFlipped(!flipped);
    Animated.timing(rotation, {
      toValue,
      duration: 700,
      useNativeDriver: true,
    }).start();
  };

  const handleReviewOption = (option) => {
    const updatedCardData = {
      confidence: option === 'again' ? 1 : option === 'hard' ? 2 : option === 'good' ? 3 : 4,
    };

    // API request to update the card review time
    const card = reviews[0].cards[currentCardIndex];
    fetch(`${domain}/api/cards/review/${card.card_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCardData),
    })
      .then(response => {
        if (response.ok) {
          console.log(`Card ${card.card_id} updated with confidence level ${updatedCardData.confidence}`);
          nextCard();
        } else {
          console.error('Failed to update next_review');
        }
      })
      .catch(error => {
        console.error('Error updating next_review:', error);
      });
  };

  useEffect(() => {
    if (!deckIds) {
      return;
    }
    fetchReview();
  }, [deckIds, studyAll]);

  if (!deckIds) {
    return (
      <SafeAreaView className="bg-primary h-full flex items-center justify-center">
        <View className="mt-10 items-center">
          <Text className="text-3xl text-white text-center font-pextrabold mb-4">Please select a deck to start studying</Text>
          <Link href={`/decks`} replace={true} className="w-auto bg-blue-500 p-4 rounded">
            <Text className="text-white text-lg text-center font-psemibold">Go to Decks</Text>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

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
        {reviews && reviews.length > 0 ? (
          <View className="mt-10 ml-2">
            <Text className="text-3xl text-white font-pextrabold">{reviews[0].deck_name}</Text>

            {/* Display the current card */}
            <View className="mt-4 w-full h-[50vh] flex justify-center items-center perspective-1000">
              {/* Card wrapper to make it rotate */}
              <TouchableOpacity
                onPress={toggleFlip}
                className="relative w-full h-full"
              >
                {/* Animated view for card flipping */}
                <Animated.View
                  className="absolute w-full h-full flex justify-center items-center p-4 bg-lightPrimary shadow-md rounded-lg"
                  style={{
                    transform: [{ rotateY: rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) }],
                  }}
                >
                  <Text className="text-3xl font-psemibold text-white">{flipped
                    ? reviews[0].cards[currentCardIndex].answer
                    : reviews[0].cards[currentCardIndex].question}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Navigation buttons */}
            <View className="flex flex-row justify-between mt-4 px-4">
              {!flipped ? (// do nothing
                <>
                </>
              ) : (
                // Show the "Again", "Hard", "Good", "Easy" buttons after the card is flipped
                <>
                  <View className="items-center">
                    <Text className="text-white mb-1">
                      {reviewTimes?.again || '-'}
                    </Text>
                    <CustomButton
                      title="Again"
                      handlePress={() => handleReviewOption('again')}
                      containerStyles="bg-red-400 px-4"
                      textStyles="text-black"
                      isLoading={isLoading}
                    />
                  </View>

                  <View className="items-center">
                    <Text className="text-white mb-1">
                      {reviewTimes?.hard || '-'}
                    </Text>
                    <CustomButton
                      title="Hard"
                      handlePress={() => handleReviewOption('hard')}
                      containerStyles="bg-yellow-300 px-4"
                      textStyles="text-black"
                      isLoading={isLoading}
                    />
                  </View>

                  <View className="items-center">
                    <Text className="text-white mb-1">
                      {reviewTimes?.good || '-'}
                    </Text>
                    <CustomButton
                      title="Good"
                      handlePress={() => handleReviewOption('good')}
                      containerStyles="bg-blue-400 px-4"
                      textStyles="text-black"
                      isLoading={isLoading}
                    />
                  </View>

                  <View className="items-center">
                    <Text className="text-white mb-1">
                      {reviewTimes?.easy || '-'}
                    </Text>
                    <CustomButton
                      title="Easy"
                      handlePress={() => handleReviewOption('easy')}
                      containerStyles="bg-green-400 px-4"
                      textStyles="text-black"
                      isLoading={isLoading}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        ) : (
          <Text>Loading reviews...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reviews