import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';
import SideBar from './SideBar'
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api';

function Login() {
  const api = useApi();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [deckId, setDeckId] = useState('');
  const [username, setUsername] = useState('');
  const [userpassword, setUserpassword] = useState('');
  const navigate = useNavigate();
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

    const response = await api._post('/api/login', formData);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${reponse.status_code}`);
    }
    
    return response.json();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target.value);
    console.log(formData)
    setUsername( formData.get("username"))
    setUserpassword(formData.get("userpassword"))
    
    formSubmissionMutation.mutate({username, userpassword }, {
      onSuccess: () => {
        
        navigate("/home")
        popupDetails('User Login successfully!', 'green')
      },
      onError: () => {
        popupDetails('Check your username or password...', 'red')
      }
    });
  };

    return (
      <>
        <SideBar />
        <form onSubmit={handleSubmit} className='flex flex-col items-start mt-10'>
          <label className="text-base" htmlFor='username'>Username</label>
          <input className="mb-4 rounded-md text-xl px-2 py-2 border border-gray-500" value = {username} id = 'username' name = 'username' type = "text" onChange={e => setUsername(e.target.value)}></input>
          
          <label className="text-base" htmlFor='userpassword'>Password</label>
          <input className="mb-4 rounded-md text-xl px-2 py-2 border border-gray-500" value={userpassword} id = 'userpassword' type = 'password' name = "userpassword" onChange={e => setUserpassword(e.target.value)}></input>
          
          <button className="mt-4 w-full rounded-lg border border-transparent px-4 py-2 font-semibold bg-[#111111] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }} type='submit'>Submit</button>

          <button className="mt-4 w-full rounded-lg border border-transparent px-4 py-2 font-semibold bg-[#111111] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }} type='button' onClick={() => navigate('/signup')}>Sign Up</button>
        </form>

        {showPopup && (
          <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
            {popupMessage}
          </div>
        )}
      </>
    );
  }

export default Login