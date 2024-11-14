import { StyleSheet, Text, View } from 'react-native'
import { SplashScreen, Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import React, { useEffect, useContext } from 'react'
import { Provider, Context } from '../context/globalContext';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

const RooyLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) return null;

  return (
    <Provider>
      {/* sometime it would lose the lighting? */}
      <StatusBar backgroundColor="#161622" style="light" />
      <RootNavigator />
    </Provider>
  );
};

const RootNavigator = () => {
  const { isLoggedIn, loading } = useContext(Context);

  // Show loading indicator while checking login status
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false, headerShown: false }} />
      {/* <Stack.Screen name="/search/[query]" options={{headerShown: false}} /> */}
    </Stack>
  );
};

export default RooyLayout


// <Stack>
//   {isLoggedIn ? (
//     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//   ) : (
//     <>
//       <Stack.Screen name="index" options={{ headerShown: false }} />
//       <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//     </>
//   )}
// </Stack>