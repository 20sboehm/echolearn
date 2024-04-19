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
  
  const[questionvideolink,setQuestionVideoLink] = useState('');
  const[answervideolink,setAnswerVideoLink] = useState('');

  const [answerlatex, setAnswerLatexInput] = useState('');
  const [questionlatex, setQuestionLatexInput] = useState('');

  const [Answer_requirement, setAnswer_requirement] = useState('');
  const [Question_requirement, setQuestion_requirement] = useState('');

  const [answerimagelink, setAnswer_ImageUrl] = useState(''); 
  const [questionimagelink, setQuestion_ImageUrl] = useState(''); 

  const handleAnswerRequirement =(value) =>{
    if(Answer_requirement === value)
    {
      setAnswer_requirement("");
      return;
    }
    setAnswer_requirement(value);
  }

  const handleQuestionRequirement =(value) =>{
    if(Question_requirement === value)
    {
      setQuestion_requirement("");
      return;
    }
    setQuestion_requirement(value);
  }

  const makeLink =()=> {
    const url = prompt("Enter the URL:", "http://");
    console.log(url);
    document.execCommand('createLink', false, url);
  }
  
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
    setQuestionVideoLink('');
    setAnswerVideoLink('');
    setAnswer_ImageUrl('');
    setQuestion_ImageUrl('');
    setQuestionLatexInput('');
    setAnswerLatexInput('');
    document.getElementById("QuestionDiv").textContent = '';
    document.getElementById("AnswerDiv").textContent = '';
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
    formSubmissionMutation.mutate({ deck_id: deckId, question, answer,questionvideolink,answervideolink,questionimagelink,answerimagelink,questionlatex,answerlatex}, {
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
          <button type = "button" onClick={() => handleQuestionRequirement('image')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>Image</button>
          <button type = "button" onClick={() => handleQuestionRequirement('video')} class="rounded-lg border border-transparent px-4 py-2 
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
          <button type = "button" onClick={() => handleQuestionRequirement('latex')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>latex</button>
          <button type = "button" onClick={() => makeLink()} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>URL</button>
          </div>
          <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>qheoqwhoieqwhoe</a>
          <div id = "QuestionDiv"  onInput={handleQuestionInput} contentEditable
          style={{border: '1px solid black', textAlign: 'left',  minHeight: '180px', width:'500px', padding: '10px', marginTop: '10px',backgroundColor:'grey'}}>
          <htmlcontent html = {question}></htmlcontent>
          </div>

          {Question_requirement === 'latex' && (
            <div>
              <textarea value={questionlatex} onChange={(e)=>setQuestionLatexInput(e.target.value)}style={{border: '1px solid black', textAlign: 'left',  minHeight: '180px', width:'500px', padding: '10px', marginTop: '10px',backgroundColor:'grey'}}></textarea>
            <h2>Preview</h2>
            <div style={{border: '1px solid #ccc', padding: '10px',minHeight: '180px', width:'500px'}}>

              <BlockMath math={questionlatex} errorColor={'#cc0000'} />
            </div>
          </div>
          )}

          {Question_requirement === 'video' && (
          <div>
            <label htmlFor='videoInput'>Put your video link here : </label>
            <input name = "videoInput" type="text" value={questionvideolink}   onChange={(e) => setQuestionVideoLink(e.target.value)} style={{ width: '250px', height:'50px' }}></input>
              {ReactPlayer.canPlay(questionvideolink) ? (
                <>
                  <p>below is the preview of video</p>
                  <ReactPlayer url= {questionvideolink} controls={true} />
                </>
                ) : (
                  <p>The link is not available</p>
                )}
            </div>
          )}

          {Question_requirement === 'image' && (
            <div>
            <label htmlFor='QuestionimageInput'>Put your image here:</label>
            <input name='QuestionimageInput' value={questionimagelink} type="text"  onChange={(e)=>setQuestion_ImageUrl(e.target.value)}></input>
            <img src={questionimagelink} style={{maxWidth: '250px', maxHeight: '250px'} } />
            </div>
          )}
             
          <div>
            <button type = "button" onClick={() => handleAnswerRequirement('image')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>Image</button>
            <button type = "button" onClick={() =>handleAnswerRequirement('video')} class="rounded-lg border border-transparent px-4 py-2 
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
            <button type = "button" onClick={() => handleAnswerRequirement('latex')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>latex</button>
            <button type = "button" onClick={() => makeLink()} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>URL</button>
          </div>

          <div id = "AnswerDiv"  onInput={handleAnswerInput}  contentEditable
          style={{border: '1px solid black', minHeight: '180px', width:'500px', padding: '10px',backgroundColor:'grey'}}>
          <htmlcontent html = {answer}></htmlcontent>
          </div>

          {Answer_requirement === 'latex' && (
            <div>
               <textarea value={answerlatex} onChange={(e)=>setAnswerLatexInput(e.target.value)}style={{border: '1px solid black', textAlign: 'left',  minHeight: '180px', width:'500px', padding: '10px', marginTop: '10px',backgroundColor:'grey'}}></textarea>
            <h2>Preview</h2>
            <div style={{border: '1px solid #ccc', padding: '10px',minHeight: '180px', width:'500px'}}>
              <BlockMath math={answerlatex} errorColor={'#cc0000'} />
            </div>
          </div>
          )}

          {Answer_requirement === 'video' && (
          <div>
            <label htmlFor='videoInput'>Put your video link here : </label>
            <input name = "videoInput" type="text" value={answervideolink}  onChange={(e) => setAnswerVideoLink(e.target.value)} style={{ width: '250px', height:'50px' }}></input>
              {ReactPlayer.canPlay(answervideolink) ? (
                <>
                  <p>preview </p>
                  <ReactPlayer url= {answervideolink} controls={true} />
                </>
                ) : (
                  <p>The link is not available</p>
                )}
            </div>
          )}

          {Answer_requirement === 'image' && (
            <div>
            <label htmlFor='AnswerimageInput'>Put your image here:</label>
            <input name='AnswerimageInput' value={answerimagelink} type="text"  onChange={(e)=>setAnswer_ImageUrl(e.target.value)}></input>
            <img src={answerimagelink} style={{maxWidth: '250px', maxHeight: '250px'}} />
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