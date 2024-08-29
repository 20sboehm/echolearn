import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import { useApi } from '../api';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');
  const navigate = useNavigate();
  const api = useApi();

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

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
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
      onError: () => {
        popupDetails('Failed: User might already exist.', 'red');
      }
    });
  };

  return (
    <>
      <SideBar />
      <form onSubmit={handleSubmit} className='flex flex-col items-start mt-10'>
        <label className="text-base" htmlFor='username'>Username</label>
        <input className="mb-4 rounded-md text-xl px-2 py-2 border border-gray-500" value={username} id='username' name='username' type="text" onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        
        <label className="text-base" htmlFor='email'>Email</label>
        <input className="mb-4 rounded-md text-xl px-2 py-2 border border-gray-500" value={email} id='email' name='email' type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        
        <label className="text-base" htmlFor='password'>Password</label>
        <input className="mb-4 rounded-md text-xl px-2 py-2 border border-gray-500" value={password} id='password' name='password' type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        
        <button className="mt-4 w-full rounded-lg border border-transparent px-4 py-2 font-semibold bg-[#111111] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }} type='submit'>Register</button>

        <button className="mt-4 w-full rounded-lg border border-transparent px-4 py-2 font-semibold bg-[#111111] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }} type='button' onClick={() => navigate('/login')}>Log In</button>
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