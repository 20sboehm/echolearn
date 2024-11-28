import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiWithoutToken, useAuth } from '../hooks';
import { FormInputButton, FormInputBox, FormInputLabel } from '../components/FormInput';

function Login() {
  const api = useApiWithoutToken();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [username, setUsername] = useState('');
  const [userpassword, setUserPassword] = useState('');

  const navigate = useNavigate();
  const { _login } = useAuth();

  function triggerPopup(popupMessage, popupColor) {
    setShowPopup(true);
    setPopupMessage(popupMessage)
    setPopupColor(popupColor)
    setPopupOpacity('opacity-100'); // Ensure it's fully visible initially
    setTimeout(() => {
      setPopupOpacity('opacity-0'); // Start fading out
      setTimeout(() => setShowPopup(false), 1000); // Give it 1 second to fade
    }, 1000); // Stay fully visible for 1 second
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await api._post("/api/token/pair", { username: username, password: userpassword });

    if (response.ok) {
      const data = await response.json();
      _login(data);
      navigate("/");
      window.location.reload();
    } else {
      triggerPopup('Check your username or password...', 'red');
    }

    setUserPassword('');
  }

  return (
    <>
      <form onSubmit={handleLogin} className='flex flex-col items-start mt-20 p-10 bg-edDarker'>
        <h1 className=' mb-5 text-3xl font-bold self-center'>Login</h1>

        <FormInputLabel htmlFor="username">Username</FormInputLabel>
        <FormInputBox idAndName="username" value={username} onChange={e => setUsername(e.target.value)} autoFocus={true} placeholder="Username" />

        <FormInputLabel htmlFor="userpassword">Password</FormInputLabel>
        <FormInputBox type='password' idAndName="userpassword" value={userpassword} onChange={e => setUserPassword(e.target.value)} placeholder="Password"></FormInputBox>

        <FormInputButton isPrimaryButton={true}>Log in</FormInputButton>
        <div className='flex flex-row justify-center items-center mt-4 w-full'>
          <span className='flex-grow border-b border-edGray h-1'></span>
          <p className='self-center text-edGray mx-2'>or</p>
          <span className='flex-grow border-b border-edGray h-1'></span>
        </div>
        <FormInputButton navigateTo="/signup">Sign up</FormInputButton>
      </form >

      {showPopup && (
        <div className={`text-white font-semibold fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
          {popupMessage}
        </div>
      )
      }
    </>
  );
}

export default Login