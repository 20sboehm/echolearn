import { View, Text, Button, TouchableOpacity, Animated, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import { useLocalSearchParams } from 'expo-router';
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
  const globalContext = useContext(Context);
  const { domain, token } = globalContext;

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
    } catch (error) {
      console.error(error.message);
    }
  };

  const cardId = reviews?.[0]?.cards?.[currentCardIndex]?.card_id;
  const { reviewTimes, isLoading, error } = useReviewTimes(cardId, domain, token);


  const nextCard = () => {
    if (currentCardIndex < reviews[0]?.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const toggleFlip = () => {
    const toValue = flipped ? 0 : 360; // If flipped, reset to 0, otherwise go to 180
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
    if (deckIds) {
      fetchReview();
    }
  }, [deckIds, studyAll]);

  return (
    <SafeAreaView className="bg-primary h-full">
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
                <Text className="text-3xl font-psemibold text-gray-300">{flipped
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
                <CustomButton
                  title="Again"
                  handlePress={() => handleReviewOption('again')}
                  containerStyles="bg-red-400 px-4"
                  textStyles="text-black"
                  isLoading={isLoading}
                />
                <CustomButton
                  title="Hard"
                  handlePress={() => handleReviewOption('hard')}
                  containerStyles="bg-yellow-300 px-4"
                  textStyles="text-black"
                  isLoading={isLoading}
                />
                <CustomButton
                  title="Good"
                  handlePress={() => handleReviewOption('good')}
                  containerStyles="bg-green-400 px-4"
                  textStyles="text-black"
                  isLoading={isLoading}
                />
                <CustomButton
                  title="Easy"
                  handlePress={() => handleReviewOption('easy')}
                  containerStyles="bg-blue-400 px-4"
                  textStyles="text-black"
                  isLoading={isLoading}
                />
              </>
            )}
          </View>


          {/* Display Review Times or Loading/Error */}
          <View className="mt-4">
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
              <Text className="text-red-500">{error}</Text>
            ) : (
              <Text className="text-white">
                Review Times: {JSON.stringify(reviewTimes)}
              </Text>
            )}
          </View>
        </View>
      ) : (
        <Text>Loading reviews...</Text>
      )}
    </SafeAreaView>
  );
};

export default Reviews