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
  const { domain, token, setToken, storeToken } = globalContext;
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("");

  const submit = () => {
    handleLogin();
  }

  function handleLogin() {

    setError("")
    let body = JSON.stringify({
      'password': form.password,
      'username': form.username,
    })

    console.log(form);

    fetch(`${domain}/api/token/pair`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          setError("Username or Password incorrect, Please try again");
          throw res.json()
        }
      })
      .then(json => {
        console.log("Logged In")
        console.log(json)
        setToken(json.access)
        storeToken(json.access)
        console.log(json.access)
        console.log(token)
        router.replace('/home');
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode='contain'
            className="w-[150px] h-[50px]"
          />
          <Text className="text-2xl text-white text-semibold mt-5 font-psemibold">Login in to EchoLearn</Text>
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
            handlePress={submit}
            containerStyles="mt-7"
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