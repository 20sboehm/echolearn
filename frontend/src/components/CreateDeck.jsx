import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';
import UserHeader from './Header'

function CreateDeck() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [folderId, setFolderId] = useState('');
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');

  function popupDetails(popupMessage, popupColor) {
    setShowPopup(true);
    setPopupMessage(popupMessage)
    setPopupColor(popupColor)
    setPopupOpacity('opacity-100'); // Ensure it's fully visible initially
    setTimeout(() => {
      setPopupOpacity('opacity-0'); // Start fading out
      setTimeout(() => setShowPopup(false), 1000); // Give it 1 second to fade
    }, 1000); // Stay fully visible for 1 second
    setDeckName('')
    setDeckDescription('')
  }

  // Fetch folders
  const { data: folders, isLoading, error } = useQuery({
    queryKey: ['folders'],
    queryFn: () =>
      fetch(`http://127.0.0.1:8000/api/folders`).then((response) =>
        response.json()
      ),
    onSuccess: () => {
      console.log(folders)
    },
    onError: () => {
      console.log('An error occurred fetching folders')
    }
  });

  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData))
    const response = await fetch('http://localhost:8000/api/decks', {
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
    formSubmissionMutation.mutate({ folder_id: folderId, owner_id: 1, name: deckName, description: deckDescription }, {
      onSuccess: () => {
        popupDetails('Deck created successfully!', 'green')
      },
      onError: () => {
        popupDetails('Something went wrong...', 'red')
      }
    });
  };

  if (folders) {
    return (
      <>
        <UserHeader />
        <h1 className='text-4xl mb-10 mt-10 font-medium'>New Deck</h1>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          <select value={folderId} onChange={(e) => setFolderId(e.target.value)} className='mb-4 p-2 rounded-md h-10' style={{ width: '30vw' }} >
            <option key='select-folder-key' value='' className='text-gray-400'>Select a folder</option>
            {folders.map((folder) => (
              <option key={folder.folder_id} value={folder.folder_id}>{folder.name}</option>
            ))}
          </select>
          <input 
            type='text' 
            value={deckName} 
            onChange={(e) => {setDeckName(e.target.value)}} 
            placeholder='Deck name'
            className='mb-4 p-2 rounded-md' 
            style={{ width: '30vw' }}
          />
          <textarea value={deckDescription} onChange={(e) => setDeckDescription(e.target.value)}
            placeholder='Deck description' className='mb-4 p-2 rounded-md h-40' style={{ width: '30vw' }} />
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
}

export default CreateDeck