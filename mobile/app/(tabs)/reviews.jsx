import { View, Text } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Context } from '../../context/globalContext';

const Reviews = () => {
  const { deckIds } = useLocalSearchParams();
  const { studyAll } = useLocalSearchParams();
  const [reviews, setReviews] = useState(null);
  const globalContext = useContext(Context);
  const { domain, token } = globalContext;

  const fetchReview = async () => {
    try {
      const queryDeckIds = Array.isArray(deckIds) ? deckIds.join(',') : deckIds;
      // Construct the base URL with deckIds
      let url = `${domain}/api/reviews/?deckIds=${queryDeckIds}`;

      // Add studyAll to the query string only if it's defined
      if (studyAll !== undefined) {
        url += `&studyAll=${studyAll}`;
      }

      // Send the request
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const fetchedReview = await response.json();
      setReviews(fetchedReview);
      console.log(fetchedReview);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (deckIds) {
      fetchReview();
    }
  }, [deckIds]);

  return (
    <View>
      <Text>Reviews {deckIds}</Text>
      <Text>studyAll: {studyAll} </Text>
    </View>
  )
}

export default Reviews