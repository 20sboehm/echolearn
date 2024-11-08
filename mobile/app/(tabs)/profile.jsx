import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useContext } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Context } from '../../context/globalContext';

const Profile = () => {
  const { isLoggedIn, logout, userObj, token } = useContext(Context);
  const router = useRouter(); // For navigation

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from the context
      router.push('/sign-in'); // Redirect to the login screen
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <Button title="Logout" onPress={handleLogout} />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: 18,
    marginVertical: 10,
  },
});