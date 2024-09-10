import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useApi, useApiWithoutToken } from '../hooks';
import { FormInputButton, FormInputBox, FormInputLabel } from './FormInput';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');
  const navigate = useNavigate();
  const api = useApiWithoutToken();

  function popupDetails(popupMessage, popupColor) {
    setShowPopup(true);
    setPopupMessage(popupMessage);
    setPopupColor(popupColor);
    setPopupOpacity('opacity-100');
    setTimeout(() => {
      setPopupOpacity('opacity-0');
      setTimeout(() => setShowPopup(false), 1000);
    }, 1000);
    setUsername('');
    setEmail('');
    setPassword('');
  }

  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData));

    const response = await api._post('/api/signup', formData);

    if (response.status == 409) {
      const errorDetails = await response.json();
      console.log(errorDetails)
      throw new Error(`Conflict: ${errorDetails.detail}`);
    }

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${reponse.status_code}`);
    }

    return response.json();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData);
    setUsername(formData.get("username"));
    setEmail(formData.get("email"));
    setPassword(formData.get("password"));

    formSubmissionMutation.mutate({ username, email, password }, {
      onSuccess: () => {
        popupDetails('Registration successful!', 'green');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      },
      onError: (error) => {

        console.log("*error*:" + error.message)
        if (error.message.includes("Username")) {
          popupDetails('Registration failed: Username already exists.', 'red');
        } else if (error.message.includes("Email")) {
          popupDetails('Registration failed: Email already exists.', 'red');
        } else {
          popupDetails('Registration failed: An unknown error occurred.', 'red');
        }
      }
    });
  };



  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col items-start mt-20 p-10 bg-eBlack'>
        {/* <form onSubmit={handleSubmit} className='flex flex-col items-start mt-10 p-10 rounded-md bg-gradient-to-r from-[#9fcece] via-[#7fd8d8] to-[#42dcdc]'> */}
        <h1 className=' mb-5 text-3xl font-bold self-center'>Sign up</h1>

        <FormInputLabel htmlFor="email">Email</FormInputLabel>
        <FormInputBox idAndName="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus={true}></FormInputBox>

        <FormInputLabel htmlFor="username">Username</FormInputLabel>
        <FormInputBox idAndName="username" value={username} onChange={e => setUsername(e.target.value)}></FormInputBox>

        <FormInputLabel htmlFor="password">Password</FormInputLabel>
        <FormInputBox idAndName="password" value={password} onChange={e => setPassword(e.target.value)}></FormInputBox>

        <FormInputButton isPrimaryButton={true}>Register</FormInputButton>
        <div className='flex flex-row justify-center items-center mt-4 w-full'>
          <span className='flex-grow border-b border-eGray h-1'></span>
          <p className='self-center text-eGray mx-2'>or</p>
          <span className='flex-grow border-b border-eGray h-1'></span>
        </div>
        <FormInputButton navigateTo="/login">Log in</FormInputButton>
      </form>
      {showPopup && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
          {popupMessage}
        </div>
      )}
    </>
  );
}

export default SignUp;