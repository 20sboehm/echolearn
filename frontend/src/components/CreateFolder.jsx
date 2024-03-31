import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';
import UserHeader from './Header'

function CreateFolder() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [folderName, setFolderName] = useState('');

  function popupDetails(popupMessage, popupColor) {
    setShowPopup(true);
    setPopupMessage(popupMessage)
    setPopupColor(popupColor)
    setPopupOpacity('opacity-100'); // Ensure it's fully visible initially
    setTimeout(() => {
      setPopupOpacity('opacity-0'); // Start fading out
      setTimeout(() => setShowPopup(false), 1000); // Give it 1 second to fade
    }, 1000); // Stay fully visible for 1 second
    setFolderName('')
  }

  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData))
    const response = await fetch('http://localhost:8000/api/folders', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${reponse.status_code}`);
    }

    return response.json();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmissionMutation.mutate({ name: folderName, owner_id: 1 }, {
      onSuccess: () => {
        popupDetails('Folder created successfully!', 'green')
      },
      onError: () => {
        popupDetails('Something went wrong...', 'red')
      }
    });
  };

  return (
    <>
      <UserHeader />
      <h1 className='text-4xl mb-10 font-medium'>New Folder</h1>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input 
          type='text' 
          value={folderName} 
          onChange={(e) => {setFolderName(e.target.value)}} 
          placeholder='Folder Name' 
          className='mb-4 p-2 rounded-md' 
          style={{ width: '30vw' }}
        />
        <button type='submit'>Submit</button>
      </form>
      {showPopup && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
          {popupMessage}
        </div>
      )}
    </>
  );
}

export default CreateFolder