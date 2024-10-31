import { StyleSheet, Text, View } from 'react-native'
import { Slot, Stack } from 'expo-router'
import React from 'react'

const RooyLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
    </Stack>
  )
}

export default RooyLayout