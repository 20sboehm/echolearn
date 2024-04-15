import { useMutation, useQuery } from 'react-query';
import { useState , useEffect,useRef} from 'react';
import SideBar from './SideBar'
import ReactPlayer from 'react-player';
import { BlockMath } from 'react-katex';
import sanitizeHtml from 'sanitize-html';

function CreateCard() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [deckId, setDeckId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [Normal_question, setNormalQuestion] = useState('');
  const [Normal_answer, setNormalAnswer] = useState('');


  const [latexInput, setLatexInput] = useState('');
  const [requirement, setrequirement] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); 
  const url =  "https://www.youtube.com/embed/dQw4w9WgXcQ";

  const handleRequirement =(value) =>{
    if(requirement === value)
    {
      setrequirement("");
      return;
    }
    setrequirement(value);
  }
  const makeLink =()=> {
    const url = prompt("Enter the URL:", "http://");
    console.log(url);
    //iseditable = !iseditable;
    document.execCommand('createLink', false, url);
  }
  
  const handleEditorChange = (event) => {
    setEditorContent(event.currentTarget.textContent);
  };
  
  const formatText = (command) => {
    document.execCommand(command, false, null);
  };
  

  const handleAnswerInput = (e) => {
    const newText = e.currentTarget.innerHTML;
    setNormalAnswer(e.currentTarget.textContent)
    const safeHtml = sanitizeHtml(newText, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['b', 'i', 'u', 'strong', 'em']),  // Allow basic formatting tags
      allowedAttributes: {}  // Restrict all attributes to prevent potential XSS vectors
    });
    setAnswer(safeHtml);
  };

  const handleQuestionInput = (e) => {
    const newText = e.currentTarget.innerHTML;
    setNormalQuestion(e.currentTarget.textContent)
    const safeHtml = sanitizeHtml(newText, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['b', 'i', 'u', 'strong', 'em']),  // Allow basic formatting tags
      allowedAttributes: {}  // Restrict all attributes to prevent potential XSS vectors
    });
    setQuestion(safeHtml);
  };

  function popupDetails(popupMessage, popupColor) {
    setShowPopup(true);
    setPopupMessage(popupMessage)
    setPopupColor(popupColor)
    setPopupOpacity('opacity-100'); // Ensure it's fully visible initially
    setTimeout(() => {
      setPopupOpacity('opacity-0'); // Start fading out
      setTimeout(() => setShowPopup(false), 1000); // Give it 1 second to fade
    }, 1000); // Stay fully visible for 1 second
    setQuestion('');
    setAnswer('');
    setNormalAnswer('');
    setNormalQuestion('');
  }

  // Fetch decks
  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: () =>
      fetch(`http://127.0.0.1:8000/api/decks`).then((response) =>
        response.json()
      ),
    onSuccess: () => {
      console.log(decks)
    },
    onError: () => {
      console.log('An error occurred fetching decks')
    }
  });

  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData))
    const response = await fetch('http://localhost:8000/api/cards', {
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
    formSubmissionMutation.mutate({ deck_id: deckId, question, answer }, {
      onSuccess: () => {
        popupDetails('Card created successfully!', 'green')
      },
      onError: () => {
        popupDetails('Something went wrong...', 'red')
      }
    });
  };

  if (decks) {
    return (
      <>
        <SideBar />
        <h1 className='text-4xl mb-10 mt-10 font-medium'>New Card</h1>
        <form onSubmit={handleSubmit} className='flex flex-col items-center'>
          <select value={deckId} onChange={(e) => setDeckId(e.target.value)} className='mb-4 px-2 rounded-md h-10' style={{ width: '30vw' }} >
            <option key='select-deck-key' value='' className='text-gray-400'>Select a deck</option>
            {decks.map((deck) => (
              <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
            ))}
          </select>
          <div>
          <button type = "button" onClick={() => handleRequirement('image')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>Image</button>
          <button type = "button" onClick={() => handleRequirement('video')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>video</button>
          <button type = "button" onClick={() => formatText('bold')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>bold</button>
          <button type = "button" onClick={() => formatText('italic')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>italic</button>
          <button type = "button" onClick={() => formatText('underline')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>underline</button>
          <button type = "button" onClick={() => handleRequirement('latex')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>latex</button>
          <button type = "button" onClick={() => makeLink()} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>URL</button>
          </div>

          <div  onInput={handleQuestionInput} contentEditable
          style={{border: '1px solid black', textAlign: 'left',  minHeight: '180px', width:'500px', padding: '10px', marginTop: '10px',backgroundColor:'grey'}}>
          <htmlcontent html = {question}></htmlcontent>
          </div>

          {requirement === 'latex' && (
            <div>
            <h2>Preview</h2>
            <div style={{border: '1px solid #ccc', padding: '10px',minHeight: '180px', width:'500px'}}>
              <BlockMath math={Normal_question} errorColor={'#cc0000'} />
            </div>
          </div>
          )}

         
          <div>
            {ReactPlayer.canPlay(Normal_question) ? (
              <ReactPlayer url= {Normal_question} controls={true} />
            ) : (
              <p>The link is not available</p>
            )}
          </div>
             
          <div>
            <button type = "button" onClick={() => handleRequirement('image')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>Image</button>
            <button type = "button" onClick={() => handleRequirement('video')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>video</button>
            <button type = "button" onClick={() => formatText('bold')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>bold</button>
            <button type = "button" onClick={() => formatText('italic')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>italic</button>
            <button type = "button" onClick={() => formatText('underline')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>underline</button>
            <button type = "button" onClick={() => handleRequirement('latex')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>latex</button>
            <button type = "button" onClick={() => makeLink()} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>URL</button>
          </div>

          <div  onInput={handleAnswerInput}  contentEditable
          style={{border: '1px solid black', minHeight: '180px', width:'500px', padding: '10px',backgroundColor:'grey'}}>
          <htmlcontent html = {answer}></htmlcontent>
          </div>

          {requirement === 'latex' && (
            <div>
            <h2>Preview</h2>
            <div style={{border: '1px solid #ccc', padding: '10px',minHeight: '180px', width:'500px'}}>
              <BlockMath math={Normal_answer} errorColor={'#cc0000'} />
            </div>
          </div>
          )}

          {requirement === 'video' && (
          <div>
            {ReactPlayer.canPlay(Normal_answer) ? (
              <ReactPlayer url= {Normal_answer} controls={true} />
            ) : (
              <p>The link is not available</p>
            )}
          </div>
          )}

          <button type='submit' class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>
            Submit
          </button>
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

export default CreateCard