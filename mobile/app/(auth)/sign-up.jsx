import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Context } from '../../context/globalContext';
import { useContext } from 'react';

const SignUp = () => {
  const globalContext = useContext(Context)
  const { domain } = globalContext;
  const router = useRouter();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    setError("");

    if (form.username === "") {
      setError("Please enter a username");
    } else if (form.password === "") {
      setError("Please enter a password");
    } else if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email");
      return;
    } else {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${domain}/api/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        if (response.ok) {
          router.replace("/sign-in");
        }
      } catch (err) {
        setError("Something went wrong when creating account");
      } finally {
        setIsSubmitting(false);
      }
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
          <Text className="text-2xl text-white text-semibold mt-5 font-psemibold">Sign up to EchoLearn</Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
            keyboardType="Username"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="Email"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="Password"
          />

          {error ? (
            <Text className="text-red-500 text-center mt-4">{error}</Text>
          ) : null}

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="bg-secondary mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have a account already?
            </Text>
            <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>Sign In</Link>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp