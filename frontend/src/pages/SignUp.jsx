import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useApi, useApiWithoutToken } from '../hooks';
import { FormInputButton, FormInputBox, FormInputLabel } from '../components/FormInput';

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
    // const formData = new FormData(e.target);
    // console.log(formData);
    // setUsername(formData.get("username"));
    // setEmail(formData.get("email"));
    // setPassword(formData.get("password"));

    const formData = {
      username,
      email,
      password
    }

    formSubmissionMutation.mutate(formData, {
      onSuccess: () => {
        popupDetails('Registration successful!', 'green');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      },
      onError: (error) => {

        console.log("*error*:" + error.message)
        if (error.message.includes("Username")) {
          popupDetails('Username already exists.', 'red');
        } else if (error.message.includes("Email already exists")) {
          popupDetails('Email already exists.', 'red');
        } else if (error.message.includes("No")) {
          popupDetails('Please provid username.', 'red');
        } else if (error.message.includes("Empty")) {
          popupDetails('Please provid email.', 'red');
        } else if (error.message.includes("password")) {
          popupDetails('Please provid password.', 'red');
        } else {
          popupDetails('Registration failed: An unknown error occurred.', 'red');
        }
      }
    });
  };



  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col items-start mt-20 p-10 bg-eDarker'>
        <h1 className=' mb-5 text-3xl font-bold self-center'>Sign up</h1>

        <FormInputLabel htmlFor="email">Email</FormInputLabel>
        <FormInputBox idAndName="email" value={email} type="email" onChange={e => setEmail(e.target.value)} autoFocus={true} placeholder="Email" required ></FormInputBox>

        <FormInputLabel htmlFor="username">Username</FormInputLabel>
        <FormInputBox idAndName="username" value={username} type="text" onChange={e => setUsername(e.target.value)} placeholder="Username" required ></FormInputBox>

        <FormInputLabel htmlFor="password">Password</FormInputLabel>
        <FormInputBox idAndName="password" value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" required ></FormInputBox>

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