import { Text, View, Image, ScrollView } from 'react-native';
import { Redirect, router } from 'expo-router'
import "../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants'
import CustomButton from '../components/CustomButton';

import { Context } from '../context/globalContext';
import { useContext } from 'react';

export default function App() {

  const globalContext = useContext(Context)
  const { isLoggedIn } = globalContext;

  // if (isLoggedIn) {
  //   console.log(isLoggedIn);
  //   return <Redirect href="/home" />;
  // }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center h-[85vh] px-4">
          <Image
            source={images.logo}
            className="w-[60vw] h-[120px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View>
            <Text className="text-3xl text-white font-bold text-center">
              Learn Efficiently, Remember Forever with{' '}
              <Text className="text-secondary-200">EchoLearn</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode='contain'
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Unlock your learning potential with EchoLearn. Our smart flashcard system makes remembering information easy and fun.</Text>

          <CustomButton
            title="Continue with login"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
