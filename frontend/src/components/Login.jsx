import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiWithoutToken, useAuth } from '../hooks';
import { FormInputButton, FormInputBox, FormInputLabel } from './FormInput';

function Login() {
  const api = useApiWithoutToken();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [deckId, setDeckId] = useState('');
  const [username, setUsername] = useState('');
  const [userpassword, setUserpassword] = useState('');

  const navigate = useNavigate();
  const { _login } = useAuth();

  function popupDetails(popupMessage, popupColor) {
    setShowPopup(true);
    setPopupMessage(popupMessage)
    setPopupColor(popupColor)
    setPopupOpacity('opacity-100'); // Ensure it's fully visible initially
    setTimeout(() => {
      setPopupOpacity('opacity-0'); // Start fading out
      setTimeout(() => setShowPopup(false), 1000); // Give it 1 second to fade
    }, 1000); // Stay fully visible for 1 second
    setUsername('');
    setUserpassword('');
  }

  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData));

    const response = await api._post('/api/token/pair', formData);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status_code}`);
    }

    return response.json();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target.value);
    console.log(formData);
    setUsername(formData.get("username"));
    setUserpassword(formData.get("userpassword"));

    formSubmissionMutation.mutate({ username: username, password: userpassword }, {
      onSuccess: (data) => {
        _login(data);
        navigate("/");
      },
      onError: () => {
        popupDetails('Check your username or password...', 'red');
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col items-start mt-20 p-10 bg-eBlack'>
        {/* <form onSubmit={handleSubmit} className='flex flex-col items-start mt-10 p-10 rounded-md bg-gradient-to-r from-[#98d3e9] via-[#64bcdb] to-[#45b2da]'> */}
        {/* <form onSubmit={handleSubmit} className='flex flex-col items-start mt-10 p-10 rounded-md bg-gradient-to-r from-[#9fcece] via-[#7fd8d8] to-[#42dcdc]'> */}
        {/* <form onSubmit={handleSubmit} className='flex flex-col items-start mt-10 p-10 rounded-md bg-gradient-to-r from-[#9fc3ce] via-[#7fb0d8] to-[#42dcdc]'> */}
        {/* <form onSubmit={handleSubmit} className='flex flex-col items-start mt-10 p-10 rounded-md bg-gradient-to-r from-[#3facd3] via-[#63bbdb] to-[#86c5db]'> */}
        {/* <form onSubmit={handleSubmit} className='flex flex-col items-start mt-10 p-10 rounded-md bg-[#82deff]'> */}
        <h1 className=' mb-5 text-3xl font-bold self-center'>Login</h1>

        <FormInputLabel htmlFor="username">Username</FormInputLabel>
        <FormInputBox idAndName="username" value={username} onChange={e => setUsername(e.target.value)} autoFocus={true} placeholder="Username" />

        <FormInputLabel htmlFor="userpassword">Password</FormInputLabel>
        <FormInputBox idAndName="userpassword" value={userpassword} onChange={e => setUserpassword(e.target.value)} placeholder="Password"></FormInputBox>

        <FormInputButton isPrimaryButton={true}>Log in</FormInputButton>
        <div className='flex flex-row justify-center items-center mt-4 w-full'>
          <span className='flex-grow border-b border-eGray h-1'></span>
          <p className='self-center text-eGray mx-2'>or</p>
          <span className='flex-grow border-b border-eGray h-1'></span>
        </div>
        <FormInputButton navigateTo="/signup">Sign up</FormInputButton>
      </form >

      {showPopup && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
          {popupMessage}
        </div>
      )
      }
    </>
  );
}

export default Login