import { Text, View, ActivityIndicator, Image, ScrollView, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Context } from '../../context/globalContext';
import { images } from '../../constants'
import CustomButton from '../../components/CustomButton';

const Profile = () => {
  const globalContext = useContext(Context);
  const { isLoggedIn, logout, domain, token } = globalContext;

  const router = useRouter(); // For navigation
  const [profileData, setProfileData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${domain}/api/profile/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
  };

  // Fetch profile data when the component mounts
  useEffect(() => {
    if (isLoggedIn) {
      fetchProfileData();
    }
  }, [isLoggedIn]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from the context
      router.push('/sign-in'); // Redirect to the login screen
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Determine the avatar image URL
  const avatarImage = profileData?.avatar ? { uri: profileData.avatar } : images.profile;


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="mt-10 p-4">
          <Text className="text-3xl text-white font-pextrabold">Profile</Text>

          <View className="flex-row items-center mt-4">
            {/* Display user avatar */}
            <Image
              source={avatarImage}
              className="rounded-full w-24 h-24"
            />

            <Text className="text-4xl text-white font-pbold ml-4">
              {profileData.username}
            </Text>
          </View>

          {profileData ? (
            <View className="mt-4 bg-gray-700 p-4 rounded-lg">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl text-white font-pblack w-[30vw]">Email:</Text>
                <Text className="text-xl text-white font-pbold w-[60vw]">{profileData.email}</Text>
              </View>

              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl text-white font-pblack w-[30vw]">Age:</Text>
                <Text className="text-xl text-white font-pbold w-[60vw]">{profileData.age}</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-xl text-white font-pblack w-[30vw]">Country:</Text>
                <Text className="text-xl text-white font-pbold w-[60vw]">{profileData.country}</Text>
              </View>
            </View>
          ) : (
            <Text className="text-white">No profile data available.</Text>
          )}

          <CustomButton
            title="Logout"
            handlePress={handleLogout}
            containerStyles="w-[50vw] mt-4 border-4 border-red-400 px-4 mx-auto"
            textStyles="text-white"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;