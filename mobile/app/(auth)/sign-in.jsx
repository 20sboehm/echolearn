import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Context } from '../../context/globalContext';
import { useContext } from 'react';

const SignIn = () => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  })
  const globalContext = useContext(Context)
  const { domain, login, setUserObj } = globalContext;
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const userData = await login(form.username, form.password);
      setUserObj(userData);
      router.replace('/home');
    } catch (err) {
      setError("Username or Password incorrect, Please try again");
      console.log("Login error:", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode='contain'
            className="w-[150px] h-[50px]"
          />
          <Text className="text-2xl text-white text-semibold mt-5 font-psemibold">Login to EchoLearn</Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
            keyboardType="Username"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="Password"
          />

          <CustomButton
            title="Sign In"
            handlePress={handleLogin}
            containerStyles="bg-secondary mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have account?
            </Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Sign Up</Link>
          </View>
          <View className="mt-10 items-center">
            <Text className="text-lg text-red-500 font-pregular">{error}</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn