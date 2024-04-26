import { useMutation, useQuery } from 'react-query';
import { useState, useEffect, useRef } from 'react';
import SideBar from './SideBar'
import ReactPlayer from 'react-player';
import { BlockMath } from 'react-katex';
import sanitizeHtml from 'sanitize-html';
import { useApi } from '../api';

const CustomButton = ({ onClick, text }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg border border-transparent px-2 py-1 mx-1 mt-8 font-normal bg-[#111111] 
    hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] active:border-[#555]"
    style={{ transition: "border-color 0.10s, color 0.10s" }}
  >
    {text}
  </button>
);

function CreateCard() {
  const api = useApi();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const [deckId, setDeckId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [questionVideoLink, setQuestionVideoLink] = useState('');
  const [answerVideoLink, setAnswerVideoLink] = useState('');

  const [answerLatex, setAnswerLatex] = useState('');
  const [questionLatex, setQuestionLatex] = useState('');

  const [answerRequirement, setAnswerRequirement] = useState('');
  const [questionRequirement, setQuestionRequirement] = useState('');

  const [answerImageLink, setAnswerImageLink] = useState('');
  const [questionImageLink, setQuestionImageLink] = useState('');

  // const handleAnswerRequirement = (value) => {
  //   if (answerRequirement === value) {
  //     setAnswerRequirement("");

  //     return;
  //   }
  //   setAnswerRequirement(value);
  // }

  // const handleQuestionRequirement = (value) => {
  //   setQuestionVideoLink('');
  //   setAnswerVideoLink('');
  //   setAnswerImageLink('');
  //   setQuestionImageLink('');
  //   setQuestionLatex('');
  //   setAnswerLatex('');
  //   if (questionRequirement === value) {
  //     setQuestionRequirement("");

  //     return;
  //   }
  //   setQuestionRequirement(value);
  // }

  const handleAnswerRequirement = (value) => {
    setAnswerVideoLink('');
    setAnswerImageLink('');
    setAnswerLatex('');
    if (answerRequirement === value) {
      setAnswerRequirement("");
      return;
    }
    setAnswerRequirement(value);
  }

  const handleQuestionRequirement = (value) => {
    setQuestionVideoLink('');
    setQuestionImageLink('');
    setQuestionLatex('');
    if (questionRequirement === value) {
      setQuestionRequirement("");
      return;
    }
    setQuestionRequirement(value);
  }

  const makeLink = () => {
    const url = prompt("Enter the URL:", "http://");
    document.execCommand('createLink', false, url);
  }

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const handleAnswerInput = (e) => {
    const newText = e.currentTarget.innerHTML;
    const safeHtml = sanitizeHtml(newText, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['b', 'i', 'u', 'strong', 'em']),  // Allow basic formatting tags
      allowedAttributes: {}  // Restrict all attributes to prevent potential XSS vectors
    });
    setAnswer(safeHtml);
  };

  const handleQuestionInput = (e) => {
    const newText = e.currentTarget.innerHTML;
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
    setQuestionVideoLink('');
    setAnswerVideoLink('');
    setAnswerImageLink('');
    setQuestionImageLink('');
    setQuestionLatex('');
    setAnswerLatex('');
    document.getElementById("QuestionDiv").textContent = '';
    document.getElementById("AnswerDiv").textContent = '';
  }

  // Fetch decks
  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: () =>
      api._get('/api/decks').then((response) => response.json()),
    onSuccess: () => {
      // console.log(decks)
    },
    onError: () => {
      console.log('An error occurred fetching decks')
    }
  });

  const formSubmissionMutation = useMutation(async (formData) => {
    // console.log(JSON.stringify(formData))
    const response = await api._post('/api/cards', formData)

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${reponse.status_code}`);
    }

    return response.json();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmissionMutation.mutate({
      deck_id: deckId, question, answer, questionvideolink: questionVideoLink,
      answervideolink: answerVideoLink, questionimagelink: questionImageLink, answerimagelink: answerImageLink,
      questionlatex: questionLatex, answerlatex: answerLatex
    }, {
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
          <select value={deckId} onChange={(e) => setDeckId(e.target.value)} className='px-2 rounded-md h-10' style={{ width: '30vw' }} >
            <option key='select-deck-key' value='' className='text-gray-400'>Select a deck</option>
            {decks.map((deck) => (
              <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
            ))}
          </select>

          {/* QUESTION SECTION */}

          <div>
            <CustomButton onClick={() => handleQuestionRequirement('image')} text="Image" />
            <CustomButton onClick={() => handleQuestionRequirement('video')} text="Video" />
            <CustomButton onClick={() => formatText('bold')} text="Bold" />
            <CustomButton onClick={() => formatText('italic')} text="Italic" />
            <CustomButton onClick={() => formatText('underline')} text="Underline" />
            <CustomButton onClick={() => handleQuestionRequirement('latex')} text="Latex" />
            <CustomButton onClick={() => makeLink()} text="URL" />
          </div>

          <div id="QuestionDiv" onInput={handleQuestionInput} contentEditable className='mt-2 rounded-lg'
            style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: '#666666' }}>
          </div>

          {questionRequirement === 'latex' && (
            <div>
              <textarea value={questionLatex} onChange={(e) => setQuestionLatex(e.target.value)} style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: '#666666' }}></textarea>
              <h2>Preview</h2>
              <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '180px', width: '500px' }}>

                <BlockMath math={questionLatex} errorColor={'#cc0000'} />
              </div>
            </div>
          )}

          {questionRequirement === 'video' && (
            <div>
              <label htmlFor='videoInput'>Put your video link here : </label>
              <input name="videoInput" type="text" value={questionVideoLink} onChange={(e) => setQuestionVideoLink(e.target.value)} style={{ width: '250px', height: '50px' }}></input>
              {ReactPlayer.canPlay(questionVideoLink) ? (
                <>
                  <p>below is the preview of video</p>
                  <ReactPlayer url={questionVideoLink} controls={true} />
                </>
              ) : (
                <p>Current link not valid</p>
              )}
            </div>
          )}

          {questionRequirement === 'image' && (
            <div className='mt-2'>
              <label htmlFor='QuestionimageInput'>Put your image here:</label>
              <input name='QuestionimageInput' className='mb-2' value={questionImageLink} type="text" onChange={(e) => setQuestionImageLink(e.target.value)}></input>
              <img src={questionImageLink} style={{ maxWidth: '250px', maxHeight: '250px' }} />
            </div>
          )}

          {/* ANSWER SECTION */}

          <div>
            <CustomButton onClick={() => handleAnswerRequirement('image')} text="Image" />
            <CustomButton onClick={() => handleAnswerRequirement('video')} text="Video" />
            <CustomButton onClick={() => formatText('bold')} text="Bold" />
            <CustomButton onClick={() => formatText('italic')} text="Italic" />
            <CustomButton onClick={() => formatText('underline')} text="Underline" />
            <CustomButton onClick={() => handleAnswerRequirement('latex')} text="Latex" />
            <CustomButton onClick={() => makeLink()} text="URL" />
          </div>

          <div id="AnswerDiv" onInput={handleAnswerInput} contentEditable className='mt-2 rounded-lg'
            style={{ border: '1px solid black', minHeight: '180px', width: '500px', padding: '10px', backgroundColor: '#666666' }}>
          </div>

          {answerRequirement === 'latex' && (
            <div>
              <textarea value={answerLatex} onChange={(e) => setAnswerLatex(e.target.value)} style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: '#666666' }}></textarea>
              <h2>Preview</h2>
              <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '180px', width: '500px' }}>
                <BlockMath math={answerLatex} errorColor={'#cc0000'} />
              </div>
            </div>
          )}

          {answerRequirement === 'video' && (
            <div>
              <label htmlFor='videoInput'>Put your video link here : </label>
              <input name="videoInput" type="text" value={answerVideoLink} onChange={(e) => setAnswerVideoLink(e.target.value)} style={{ width: '250px', height: '50px' }}></input>
              {ReactPlayer.canPlay(answerVideoLink) ? (
                <>
                  <p>preview </p>
                  <ReactPlayer url={answerVideoLink} controls={true} />
                </>
              ) : (
                <p>The link is not available</p>
              )}
            </div>
          )}

          {answerRequirement === 'image' && (
            <div>
              <label htmlFor='AnswerimageInput'>Put your image here:</label>
              <input name='AnswerimageInput' value={answerImageLink} type="text" onChange={(e) => setAnswerImageLink(e.target.value)}></input>
              <img src={answerImageLink} style={{ maxWidth: '250px', maxHeight: '250px' }} />
            </div>
          )}

          <button type='submit' className="rounded-lg border border-transparent px-4 py-2 mt-6
          font-semibold bg-[#111111] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
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