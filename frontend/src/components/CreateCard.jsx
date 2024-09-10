import { useMutation, useQuery } from 'react-query';
import { useState, useEffect, useRef } from 'react';
import SideBar from './SideBar'
import ReactPlayer from 'react-player';
import { BlockMath } from 'react-katex';
import sanitizeHtml from 'sanitize-html';
import { useApi } from '../hooks';

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
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const [deckId, setDeckId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [Normal_question, setNormalQuestion] = useState('');
  const [Normal_answer, setNormalAnswer] = useState('');

  const [questionvideolink, setQuestionVideoLink] = useState('');
  const [answervideolink, setAnswerVideoLink] = useState('');

  const [answerlatex, setAnswerLatexInput] = useState('');
  const [questionlatex, setQuestionLatexInput] = useState('');

  const [Answer_requirement, setAnswer_requirement] = useState('');
  const [Question_requirement, setQuestion_requirement] = useState('');

  const [answerimagelink, setAnswer_ImageUrl] = useState('');
  const [questionimagelink, setQuestion_ImageUrl] = useState('');

  const [multipleInput, setMultipleInput] = useState('');
  const [multipleRequired, setmultipleRequired] = useState('');

  const [selectedOptionSpace, setSelectedOptionspace] = useState('spacetab');
  const [selectedOptionLine, setSelectedOptionline] = useState('newline');
  const [preview, setPreview] = useState([]);
  const handleOptionChangeSpace = (event) => {
    setSelectedOptionspace(event.target.value);
  };
  const handleOptionChangenewline = (event) => {
    setSelectedOptionline(event.target.value);
  };

  const handleMultipleInput = (value) => {
    setQuestionVideoLink('');
    setAnswerVideoLink('');
    setAnswer_ImageUrl('');
    setQuestion_ImageUrl('');
    setQuestionLatexInput('');
    setAnswerLatexInput('');
    if (!multipleRequired) {
      setmultipleRequired(true);
      console.log(multipleRequired)
    }
    else {
      setmultipleRequired(false);
    }
  }
  const handleAnswerRequirement = (value) => {
    setQuestionVideoLink('');
    setAnswerVideoLink('');
    setAnswer_ImageUrl('');
    setQuestion_ImageUrl('');
    setQuestionLatexInput('');
    setAnswerLatexInput('');

    if (Answer_requirement === value) {
      setAnswer_requirement("");

      return;
    }
    setAnswer_requirement(value);
  }

  const handleQuestionRequirement = (value) => {
    setQuestionVideoLink('');
    setAnswerVideoLink('');
    setAnswer_ImageUrl('');
    setQuestion_ImageUrl('');
    setQuestionLatexInput('');
    setAnswerLatexInput('');
    if (Question_requirement === value) {
      setQuestion_requirement("");

      return;
    }
    setQuestion_requirement(value);
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
    setAnswer_ImageUrl('');
    setQuestion_ImageUrl('');
    setQuestionLatexInput('');
    setAnswerLatexInput('');

    if (multipleRequired === true) {
      return
    }
    document.getElementById("QuestionDiv").textContent = '';
    document.getElementById("AnswerDiv").textContent = '';
  }

  // Fetch decks
  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: () =>
      api._get('/api/decks').then((response) => response.json()),
    // fetch(`http://127.0.0.1:8000/api/decks`).then((response) =>
    //   response.json()
    // ),
    onSuccess: () => {
      // console.log(decks)
    },
    onError: () => {
      console.log('An error occurred fetching decks')
    }
  });

  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData))

    const response = await api._post('/api/cards', formData)

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status_code}`);
    }

    return response.json();
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    formSubmissionMutation.mutate({ deck_id: deckId, question, answer, questionvideolink, answervideolink, questionimagelink, answerimagelink, questionlatex, answerlatex }, {
      onSuccess: () => {
        popupDetails('Card created successfully!', 'green')
      },
      onError: () => {
        popupDetails('Something went wrong...', 'red')
      }
    });
  };

  useEffect(() => {
    let spaceChoice = selectedOptionSpace === "spacetab" ? '\t' : ',';
    let lineChoice = selectedOptionLine === "newline" ? '\n' : ';';

    const lines = multipleInput.split(lineChoice).filter(line => line.trim());
    const formattedPreview = lines.map(line => {
      const parts = line.split(spaceChoice).map(part => part.trim());
      return { question: parts[0], answer: parts[1] };
    });
    setPreview(formattedPreview);
  }, [multipleInput, selectedOptionSpace, selectedOptionLine]);

  const handleSubmitMultiple = (e) => {
    e.preventDefault();
    console.log(multipleInput)
    let lineChoice = '';
    let spaceChoice = '';
    if (selectedOptionSpace === "spacetab") {
      spaceChoice = '\t';
    }
    else {
      spaceChoice = new RegExp(`\\,(.+)`);
    }
    if (selectedOptionLine === "newline") {
      lineChoice = '\n';
    }
    else {
      lineChoice = ';';
    }

    const lines = (multipleInput).trim().split(lineChoice).filter(line => line.trim());

    const newCards = lines.map(line => {
      const parts = line.split(spaceChoice);
      console.log(parts[0], parts[1])
      const question = parts[0]
      const answer = parts[1]
      formSubmissionMutation.mutate({ deck_id: deckId, question, answer, questionvideolink, answervideolink, questionimagelink, answerimagelink, questionlatex, answerlatex }, {
        onSuccess: () => {
          popupDetails('Card created successfully!', 'green')
          setRefetchTrigger(prev => !prev);
        },
        onError: () => {
          popupDetails('Something went wrong...', 'red')
        }
      });
    });

  };
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      // Set the value to: text before caret + tab + text after caret
      const value = e.target.value;
      e.target.value = value.substring(0, start) + "\t" + value.substring(end);

      // Move the caret
      e.target.selectionStart = e.target.selectionEnd = start + 1;
      e.preventDefault();// Prevent the default Tab key behavior
    }

  };
  if (decks) {
    return (
      <>
        <SideBar refetchTrigger={refetchTrigger} />
        <h1 className='text-4xl mb-10 mt-10 font-medium'>New Card</h1>
        {multipleRequired == true && (
          <form onSubmit={handleSubmitMultiple} className='flex flex-col items-center'>
            <select value={deckId} onChange={(e) => setDeckId(e.target.value)} className='mb-4 px-2 rounded-md h-10 bg-black' style={{ width: '30vw' }} >
              <option key='select-deck-key' value='' className=''>Select a deck</option>
              {decks.map((deck) => (
                <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
              ))}
            </select>
            <div>
              <div>
                <h2>Select space style: </h2>
                <div style={{ display: 'inline-block', marginRight: '10px' }}>
                  <input name='spacetab' type="radio" value="spacetab" checked={selectedOptionSpace === 'spacetab'} onChange={handleOptionChangeSpace}></input>
                  <label htmlFor='spacetab'> Tab </label>
                </div>

                <div style={{ display: 'inline-block', marginRight: '10px' }}>
                  <input name='spacecomma' type="radio" value="spacecomma" checked={selectedOptionSpace === 'spacecomma'} onChange={handleOptionChangeSpace}></input>
                  <label htmlFor='spacecomma'> comma </label>
                </div>
              </div>
              <div>
                <h2>Select new line style: </h2>
                <div style={{ display: 'inline-block', marginRight: '10px' }}>
                  <input name='newline' type="radio" value='newline' checked={selectedOptionLine === 'newline'} onChange={handleOptionChangenewline}></input>
                  <label htmlFor='newline'> newline </label>
                </div>

                <div style={{ display: 'inline-block', marginRight: '10px' }}>
                  <input name='newlinesemicolon' type="radio" value='semicolon' checked={selectedOptionLine === 'semicolon'} onChange={handleOptionChangenewline}></input>
                  <label htmlFor='newlinesemicolon'> semicolon </label>
                </div>
              </div>
            </div>

            <div>
              <textarea value={multipleInput} onChange={(e) => setMultipleInput(e.target.value)} onKeyDown={handleKeyDown}
                style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: 'grey' }} ></textarea>
            </div>

            <button type='submit' class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>
              Submit
            </button>

            <h3>Preview</h3>
            <div className="h-[50vh] overflow-y-auto">
              {preview.map((item, index) => (
                <div className="grid grid-cols-2 gap-4 font-medium px-2" key={index}>
                  <div className="border bg-white text-black mt-2 px-2 py-2">
                    <p>Question: {item.question}</p>
                  </div>
                  <div className="border bg-white text-black mt-2 px-2 py-2 relative">
                    <p>Answer: {item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </form>
        )}
        {multipleRequired == false && (
          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            <select value={deckId} onChange={(e) => setDeckId(e.target.value)} className='mb-4 px-2 rounded-md h-10 bg-black' style={{ width: '30vw' }} >
              <option key='select-deck-key' value='' className=''>Select a deck</option>
              {decks.map((deck) => (
                <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
              ))}
            </select>
            <button type="button" onClick={() => handleMultipleInput('MultipleInput')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }} >Multiple input</button>

            <div>
              <button type="button" onClick={() => handleQuestionRequirement('image')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>Image</button>
              <button type="button" onClick={() => handleQuestionRequirement('video')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>video</button>
              <button type="button" onClick={() => formatText('bold')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>bold</button>
              <button type="button" onClick={() => formatText('italic')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>italic</button>
              <button type="button" onClick={() => formatText('underline')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>underline</button>
              <button type="button" onClick={() => handleQuestionRequirement('latex')} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>latex</button>
              <button type="button" onClick={() => makeLink()} class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>URL</button>
            </div>

            <div id="QuestionDiv" onInput={handleQuestionInput} contentEditable
              style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: 'grey' }}>
              <htmlcontent html={question}></htmlcontent>
            </div>

            {Question_requirement === 'latex' && (
              <div>
                <textarea value={questionlatex} onChange={(e) => setQuestionLatexInput(e.target.value)} style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: 'grey' }}></textarea>
                <h2>Preview</h2>
                <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '180px', width: '500px' }}>

                  <BlockMath math={questionlatex} errorColor={'#cc0000'} />
                </div>
              </div>
            )}

            {Question_requirement === 'video' && (
              <div>
                <label htmlFor='videoInput'>Put your video link here : </label>
                <input name="videoInput" type="text" value={questionvideolink} onChange={(e) => setQuestionVideoLink(e.target.value)} style={{ width: '250px', height: '50px' }}></input>
                {ReactPlayer.canPlay(questionvideolink) ? (
                  <>
                    <p>below is the preview of video</p>
                    <ReactPlayer url={questionvideolink} controls={true} />
                  </>
                ) : (
                  <p>The link is not available</p>
                )}
              </div>
            )}

            {Question_requirement === 'image' && (
              <div>
                <label htmlFor='QuestionimageInput'>Put your image here:</label>
                <input name='QuestionimageInput' value={questionimagelink} type="text" onChange={(e) => setQuestion_ImageUrl(e.target.value)}></input>
                <img src={questionimagelink} style={{ maxWidth: '250px', maxHeight: '250px' }} />
              </div>
            )}

            <div>
              <button type="button" onClick={() => handleAnswerRequirement('image')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>Image</button>
              <button type="button" onClick={() => handleAnswerRequirement('video')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>video</button>
              <button type="button" onClick={() => formatText('bold')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>bold</button>
              <button type="button" onClick={() => formatText('italic')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>italic</button>
              <button type="button" onClick={() => formatText('underline')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>underline</button>
              <button type="button" onClick={() => handleAnswerRequirement('latex')} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>latex</button>
              <button type="button" onClick={() => makeLink()} class="rounded-lg border border-transparent px-4 py-2 
            font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
            active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>URL</button>
            </div>

            <div id="AnswerDiv" onInput={handleAnswerInput} contentEditable
              style={{ border: '1px solid black', minHeight: '180px', width: '500px', padding: '10px', backgroundColor: 'grey' }}>
              <htmlcontent html={answer}></htmlcontent>
            </div>

            {Answer_requirement === 'latex' && (
              <div>
                <textarea value={answerlatex} onChange={(e) => setAnswerLatexInput(e.target.value)} style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: 'grey' }}></textarea>
                <h2>Preview</h2>
                <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '180px', width: '500px' }}>
                  <BlockMath math={answerlatex} errorColor={'#cc0000'} />
                </div>
              </div>
            )}

            {Answer_requirement === 'video' && (
              <div>
                <label htmlFor='videoInput'>Put your video link here : </label>
                <input name="videoInput" type="text" value={answervideolink} onChange={(e) => setAnswerVideoLink(e.target.value)} style={{ width: '250px', height: '50px' }}></input>
                {ReactPlayer.canPlay(answervideolink) ? (
                  <>
                    <p>preview </p>
                    <ReactPlayer url={answervideolink} controls={true} />
                  </>
                ) : (
                  <p>The link is not available</p>
                )}
              </div>
            )}

            {Answer_requirement === 'image' && (
              <div>
                <label htmlFor='AnswerimageInput'>Put your image here:</label>
                <input name='AnswerimageInput' value={answerimagelink} type="text" onChange={(e) => setAnswer_ImageUrl(e.target.value)}></input>
                <img src={answerimagelink} style={{ maxWidth: '250px', maxHeight: '250px' }} />
              </div>
            )}

            <button type='submit' class="rounded-lg border border-transparent px-4 py-2 
          font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] 
          active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>
              Submit
            </button>

          </form>
        )}
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