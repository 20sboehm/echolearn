import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const Reviews = () => {
  const { deckIds } = useLocalSearchParams();
  return (
    <View>
      <Text>Reviews {deckIds}</Text>
    </View>
  )
}

export default Reviews