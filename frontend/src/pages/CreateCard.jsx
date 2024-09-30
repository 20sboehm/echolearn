import { useApi } from "../hooks";
import { useState, useEffect, Children } from "react";
import Sidebar from "../components/SideBar";
import { ChevronIcon } from "../components/Icons";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";

function CreateCard() {
  const api = useApi();

  const [deckId, setDeckId] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [answerContent, setAnswerContent] = useState("");

  // Fetch decks
  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: async () => {
      let response = await api._get('/api/decks');

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.detail || 'An error occurred';
        throw new Error(`${response.status}: ${message}`);
      }

      return response.json();
    }
  });

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    const [status, message] = error.message.split(': ');

    return (
      <>
        <h1 className="mt-20 text-[3rem] font-bold">{status}</h1>
        <p className="mt-2 text-[1.5rem]">{message}</p>
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cardData = {
      deck_id: deckId,
      question: questionContent,
      answer: answerContent,
    }

    const response = await api._post('/api/cards', cardData);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating card: ", errorData);
    } else {
      console.log("Card created successfully");
    }
  }

  return (
    <>
      <Sidebar />
      <div className="w-1/2 flex flex-col">
        <div className="flex justify-between border-b border-eMedGray mb-4 mt-8 pb-1">
          <h1 className="text-2xl font-medium">New Card</h1>
          <select id="selectDeck" value={deckId} onChange={(e) => setDeckId(e.target.value)} className='bg-eDarker text-eWhite focus:outline-none' >
            <option key='select-deck-key' value=''>Select a deck</option>
            {decks.map((deck) => (
              <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-2 flex flex-col">
            <TextBox label="Front" content={questionContent} inputHandler={(e) => { setQuestionContent(e.target.value) }} />
          </div>
          <TextBox label="Back" content={answerContent} inputHandler={(e) => { setAnswerContent(e.target.value) }} />

          <DividerLine />

          <div className="mb-2 flex flex-col">
            <TextBoxPreview label="Question Preview" content={questionContent} />
          </div>
          <TextBoxPreview label="Answer Preview" content={answerContent} />

          <div className="flex justify-center mt-8">
            <SubmitButton>Create Card</SubmitButton>
          </div>
        </form>
      </div>
    </>
  )
}

function TextBox({ label, content, inputHandler }) {
  const [textBoxOpen, setTextBoxOpen] = useState(true);

  return (
    <>
      <button onClick={() => { setTextBoxOpen(!textBoxOpen) }} className="flex items-center">
        <ChevronIcon isOpen={textBoxOpen} color="#ccc" />
        <p>{label}</p>
      </button>
      {textBoxOpen && (
        <textarea value={content} onInput={inputHandler} className="bg-eDarker w-full min-h-20 h-[15vh] p-2 border border-eDarkGray focus:outline-none custom-scrollbar"></textarea>
      )}
    </>
  );
}

function DividerLine() {
  return (
    <div className="flex flex-row justify-center items-center my-3 w-full" >
      <span className="flex-grow border-b border-eGray h-1"></span>
      <p className="self-center text-eGray mx-2">Preview</p>
      <span className="flex-grow border-b border-eGray h-1"></span>
    </div >
  )
}

function TextBoxPreview({ label, content }) {
  const [textBoxPreviewOpen, setTextBoxPreviewOpen] = useState(true);

  return (
    <>
      <button onClick={() => { setTextBoxPreviewOpen(!textBoxPreviewOpen) }} className="flex items-center">
        <ChevronIcon isOpen={textBoxPreviewOpen} color="#999" />
        <p className="text-eGray">{label}</p>
      </button>
      {textBoxPreviewOpen && (
        <MarkdownPreviewer content={content} className="border border-eDarkGray bg-eDarker p-2" />
      )}
    </>
  )
}

function SubmitButton({ children, onSubmit }) {
  return (
    <button onSubmit={onSubmit} className="w-[60%] sm:w-[30%] rounded-sm border-2 px-2 py-2 text-center font-medium active:scale-[0.97] 
    bg-eDarker text-eGreen border-eGreen hover:border-eWhite hover:text-eWhite"
    >
      {children}
    </button>
  )
}

export default CreateCard;


// import { useMutation, useQuery } from 'react-query';
// import { useState, useEffect, useRef } from 'react';
// import SideBar from '../components/SideBar'
// import ReactPlayer from 'react-player';
// import { BlockMath } from 'react-katex';
// import sanitizeHtml from 'sanitize-html';
// import { useApi } from '../hooks';

// function CreateCard() {
//   const api = useApi();

//   const [showPopup, setShowPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState('');
//   const [popupColor, setPopupColor] = useState('');
//   const [popupOpacity, setPopupOpacity] = useState('opacity-100');
//   const [refetchTrigger, setRefetchTrigger] = useState(false);

//   const [deckId, setDeckId] = useState('');
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [Normal_question, setNormalQuestion] = useState('');
//   const [Normal_answer, setNormalAnswer] = useState('');

//   const [questionvideolink, setQuestionVideoLink] = useState('');
//   const [answervideolink, setAnswerVideoLink] = useState('');

//   const [answerlatex, setAnswerLatexInput] = useState('');
//   const [questionlatex, setQuestionLatexInput] = useState('');

//   const [Answer_requirement, setAnswer_requirement] = useState('');
//   const [Question_requirement, setQuestion_requirement] = useState('');

//   const [answerimagelink, setAnswer_ImageUrl] = useState('');
//   const [questionimagelink, setQuestion_ImageUrl] = useState('');

//   const [multipleInput, setMultipleInput] = useState('');
//   const [multipleRequired, setmultipleRequired] = useState('');

//   const [selectedOptionSpace, setSelectedOptionspace] = useState('spacetab');
//   const [selectedOptionLine, setSelectedOptionline] = useState('newline');
//   const [preview, setPreview] = useState([]);
//   const handleOptionChangeSpace = (event) => {
//     setSelectedOptionspace(event.target.value);
//   };
//   const handleOptionChangenewline = (event) => {
//     setSelectedOptionline(event.target.value);
//   };

//   const handleMultipleInput = (value) => {
//     setQuestionVideoLink('');
//     setAnswerVideoLink('');
//     setAnswer_ImageUrl('');
//     setQuestion_ImageUrl('');
//     setQuestionLatexInput('');
//     setAnswerLatexInput('');
//     if (!multipleRequired) {
//       setmultipleRequired(true);
//       console.log(multipleRequired)
//     }
//     else {
//       setmultipleRequired(false);
//     }
//   }
//   const handleAnswerRequirement = (value) => {
//     // setQuestionVideoLink('');
//     setAnswerVideoLink('');
//     setAnswer_ImageUrl('');
//     // setQuestion_ImageUrl('');
//     // setQuestionLatexInput('');
//     setAnswerLatexInput('');

//     if (Answer_requirement === value) {
//       setAnswer_requirement("");

//       return;
//     }
//     setAnswer_requirement(value);
//   }

//   const handleQuestionRequirement = (value) => {
//     setQuestionVideoLink('');
//     // setAnswerVideoLink('');
//     // setAnswer_ImageUrl('');
//     setQuestion_ImageUrl('');
//     setQuestionLatexInput('');
//     // setAnswerLatexInput('');
//     if (Question_requirement === value) {
//       setQuestion_requirement("");

//       return;
//     }
//     setQuestion_requirement(value);
//   }

//   const makeLink = () => {
//     const url = prompt("Enter the URL:", "http://");
//     document.execCommand('createLink', false, url);
//   }

//   const formatText = (command) => {
//     document.execCommand(command, false, null);
//   };

//   const handleAnswerInput = (e) => {
//     const newText = e.currentTarget.innerHTML;
//     const safeHtml = sanitizeHtml(newText, {
//       allowedTags: sanitizeHtml.defaults.allowedTags.concat(['b', 'i', 'u', 'strong', 'em']),  // Allow basic formatting tags
//       allowedAttributes: {}  // Restrict all attributes to prevent potential XSS vectors
//     });
//     setAnswer(safeHtml);
//   };

//   const handleQuestionInput = (e) => {
//     const newText = e.currentTarget.innerHTML;
//     const safeHtml = sanitizeHtml(newText, {
//       allowedTags: sanitizeHtml.defaults.allowedTags.concat(['b', 'i', 'u', 'strong', 'em']),  // Allow basic formatting tags
//       allowedAttributes: {}  // Restrict all attributes to prevent potential XSS vectors
//     });
//     setQuestion(safeHtml);
//   };

//   function popupDetails(popupMessage, popupColor) {
//     setShowPopup(true);
//     setPopupMessage(popupMessage)
//     setPopupColor(popupColor)
//     setPopupOpacity('opacity-100'); // Ensure it's fully visible initially
//     setTimeout(() => {
//       setPopupOpacity('opacity-0'); // Start fading out
//       setTimeout(() => setShowPopup(false), 1000); // Give it 1 second to fade
//     }, 1000); // Stay fully visible for 1 second
//     setQuestion('');
//     setAnswer('');
//     setQuestionVideoLink('');
//     setAnswerVideoLink('');
//     setAnswer_ImageUrl('');
//     setQuestion_ImageUrl('');
//     setQuestionLatexInput('');
//     setAnswerLatexInput('');

//     if (multipleRequired === true) {
//       return
//     }
//     document.getElementById("QuestionDiv").textContent = '';
//     document.getElementById("AnswerDiv").textContent = '';
//   }

//   // Fetch decks
//   const { data: decks, isLoading, error } = useQuery({
//     queryKey: ['decks'],
//     queryFn: () =>
//       api._get('/api/decks').then((response) => response.json()),
//     // fetch(`http://127.0.0.1:8000/api/decks`).then((response) =>
//     //   response.json()
//     // ),
//     onSuccess: () => {
//       // console.log(decks)
//     },
//     onError: () => {
//       console.log('An error occurred fetching decks')
//     }
//   });

//   const formSubmissionMutation = useMutation(async (formData) => {
//     console.log(JSON.stringify(formData))

//     const response = await api._post('/api/cards', formData)

//     if (!response.ok) {
//       throw new Error(`Network response was not ok: ${response.status_code}`);
//     }

//     return response.json();
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     formSubmissionMutation.mutate({ deck_id: deckId, question, answer, questionvideolink, answervideolink, questionimagelink, answerimagelink, questionlatex, answerlatex }, {
//       onSuccess: () => {
//         popupDetails('Card created successfully!', 'green')
//       },
//       onError: () => {
//         popupDetails('Something went wrong...', 'red')
//       }
//     });
//   };

//   useEffect(() => {
//     let spaceChoice = selectedOptionSpace === "spacetab" ? '\t' : ',';
//     let lineChoice = selectedOptionLine === "newline" ? '\n' : ';';

//     const lines = multipleInput.split(lineChoice).filter(line => line.trim());
//     const formattedPreview = lines.map(line => {
//       const parts = line.split(spaceChoice).map(part => part.trim());
//       return { question: parts[0], answer: parts[1] };
//     });
//     setPreview(formattedPreview);
//   }, [multipleInput, selectedOptionSpace, selectedOptionLine]);

//   const handleSubmitMultiple = (e) => {
//     e.preventDefault();
//     console.log(multipleInput)
//     let lineChoice = '';
//     let spaceChoice = '';
//     if (selectedOptionSpace === "spacetab") {
//       spaceChoice = '\t';
//     }
//     else {
//       spaceChoice = new RegExp(`\\,(.+)`);
//     }
//     if (selectedOptionLine === "newline") {
//       lineChoice = '\n';
//     }
//     else {
//       lineChoice = ';';
//     }

//     const lines = (multipleInput).trim().split(lineChoice).filter(line => line.trim());

//     const newCards = lines.map(line => {
//       const parts = line.split(spaceChoice);
//       console.log(parts[0], parts[1])
//       const question = parts[0]
//       const answer = parts[1]
//       formSubmissionMutation.mutate({ deck_id: deckId, question, answer, questionvideolink, answervideolink, questionimagelink, answerimagelink, questionlatex, answerlatex }, {
//         onSuccess: () => {
//           popupDetails('Card created successfully!', 'green')
//           setRefetchTrigger(prev => !prev);
//         },
//         onError: () => {
//           popupDetails('Something went wrong...', 'red')
//         }
//       });
//     });

//   };
//   const handleKeyDown = (e) => {
//     if (e.key === 'Tab') {
//       const start = e.target.selectionStart;
//       const end = e.target.selectionEnd;

//       // Set the value to: text before caret + tab + text after caret
//       const value = e.target.value;
//       e.target.value = value.substring(0, start) + "\t" + value.substring(end);

//       // Move the caret
//       e.target.selectionStart = e.target.selectionEnd = start + 1;
//       e.preventDefault();// Prevent the default Tab key behavior
//     }

//   };
//   if (decks) {
//     return (
//       <>
//         <SideBar refetchTrigger={refetchTrigger} />
//         <h1 className='text-4xl mb-10 mt-10 font-medium'>New Card</h1>
//         {multipleRequired == true && (
//           <form onSubmit={handleSubmitMultiple} className='flex flex-col items-center'>
//             <select value={deckId} onChange={(e) => setDeckId(e.target.value)} className='mb-4 px-2 rounded-md h-10 bg-eDarker border border-eGray' style={{ width: '30vw' }} >
//               <option key='select-deck-key' value='' className=''>Select a deck</option>
//               {decks.map((deck) => (
//                 <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
//               ))}
//             </select>
//             <div>
//               <div>
//                 <h2>Select space style: </h2>
//                 <div style={{ display: 'inline-block', marginRight: '10px' }}>
//                   <input name='spacetab' type="radio" value="spacetab" checked={selectedOptionSpace === 'spacetab'} onChange={handleOptionChangeSpace}></input>
//                   <label htmlFor='spacetab'> Tab </label>
//                 </div>

//                 <div style={{ display: 'inline-block', marginRight: '10px' }}>
//                   <input name='spacecomma' type="radio" value="spacecomma" checked={selectedOptionSpace === 'spacecomma'} onChange={handleOptionChangeSpace}></input>
//                   <label htmlFor='spacecomma'> comma </label>
//                 </div>
//               </div>
//               <div>
//                 <h2>Select new line style: </h2>
//                 <div style={{ display: 'inline-block', marginRight: '10px' }}>
//                   <input name='newline' type="radio" value='newline' checked={selectedOptionLine === 'newline'} onChange={handleOptionChangenewline}></input>
//                   <label htmlFor='newline'> newline </label>
//                 </div>

//                 <div style={{ display: 'inline-block', marginRight: '10px' }}>
//                   <input name='newlinesemicolon' type="radio" value='semicolon' checked={selectedOptionLine === 'semicolon'} onChange={handleOptionChangenewline}></input>
//                   <label htmlFor='newlinesemicolon'> semicolon </label>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <textarea value={multipleInput} onChange={(e) => setMultipleInput(e.target.value)} onKeyDown={handleKeyDown}
//                 style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: 'grey' }} ></textarea>
//             </div>

//             <button type='submit' className="rounded-lg border border-transparent px-4 py-2
//           font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333]
//           active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>
//               Submit
//             </button>

//             <h3>Preview</h3>
//             <div className="h-[50vh] overflow-y-auto">
//               {preview.map((item, index) => (
//                 <div className="grid grid-cols-2 gap-4 font-medium px-2" key={index}>
//                   <div className="border bg-white text-black mt-2 px-2 py-2">
//                     <p>Question: {item.question}</p>
//                   </div>
//                   <div className="border bg-white text-black mt-2 px-2 py-2 relative">
//                     <p>Answer: {item.answer}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </form>
//         )}
//         {multipleRequired == false && (
//           <form onSubmit={handleSubmit} className='flex flex-col items-center'>
//             <select value={deckId} onChange={(e) => setDeckId(e.target.value)} className='mb-4 px-2 h-10 bg-eDarker border border-eGray' style={{ width: '30vw' }} >
//               <option key='select-deck-key' value='' className=''>Select a deck</option>
//               {decks.map((deck) => (
//                 <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
//               ))}
//             </select>
//             <button type="button" onClick={() => handleMultipleInput('MultipleInput')} className="rounded-lg border border-transparent px-4 py-2
//           font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333]
//           active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }} >Multiple input</button>

//             <h1 className='text-2xl mt-6 mb-2 w-[90%] border-b p-1 text-center'>Question</h1>

//             <div className='m-2'>
//               <button type="button" onClick={() => handleQuestionRequirement('image')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//           font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//           active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>Image</button>
//               <button type="button" onClick={() => handleQuestionRequirement('video')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//           font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//           active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>video</button>
//               <button type="button" onClick={() => formatText('bold')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//           font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//           active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>bold</button>
//               <button type="button" onClick={() => formatText('italic')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//           font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//           active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>italic</button>
//               <button type="button" onClick={() => formatText('underline')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//           font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//           active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>underline</button>
//               <button type="button" onClick={() => handleQuestionRequirement('latex')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//           font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//           active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>latex</button>
//               <button type="button" onClick={() => makeLink()} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//           font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//           active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>URL</button>
//             </div>

//             <div id="QuestionDiv" onInput={handleQuestionInput} contentEditable className='bg-eDarker rounded-md border
//             border-eGray w-[90%] h-[15vh] text-left p-2'>
//               <htmlcontent html={question}></htmlcontent>
//             </div>

//             {Question_requirement === 'latex' && (
//               <LatexDisplay value={questionlatex} onChange={(e) => setQuestionLatexInput(e.target.value)} blockMathInput={questionlatex}></LatexDisplay>
//             )}

//             {Question_requirement === 'video' && (
//               <div>
//                 <label htmlFor='videoInput'>Put your video link here : </label>
//                 <input name="videoInput" type="text" value={questionvideolink} onChange={(e) => setQuestionVideoLink(e.target.value)} style={{ width: '250px', height: '50px' }}></input>
//                 {ReactPlayer.canPlay(questionvideolink) ? (
//                   <>
//                     <p>below is the preview of video</p>
//                     <ReactPlayer url={questionvideolink} controls={true} />
//                   </>
//                 ) : (
//                   <p>The link is not available</p>
//                 )}
//               </div>
//             )}

//             {Question_requirement === 'image' && (
//               <ImageDisplay htmlFor='QuestionimageInput' name='QuestionimageInput' value={questionimagelink}
//                 onChange={(e) => setQuestion_ImageUrl(e.target.value)} imgSrc={questionimagelink} />
//             )}

//             <h1 className='text-2xl mt-6 mb-2 w-[90%] border-b p-1 text-center'>Answer</h1>

//             <div className='m-2'>
//               <button type="button" onClick={() => handleAnswerRequirement('image')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//             font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//             active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>Image</button>
//               <button type="button" onClick={() => handleAnswerRequirement('video')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//             font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//             active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>video</button>
//               <button type="button" onClick={() => formatText('bold')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//             font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//             active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>bold</button>
//               <button type="button" onClick={() => formatText('italic')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//             font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//             active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>italic</button>
//               <button type="button" onClick={() => formatText('underline')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//             font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//             active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>underline</button>
//               <button type="button" onClick={() => handleAnswerRequirement('latex')} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//             font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//             active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>latex</button>
//               <button type="button" onClick={() => makeLink()} className="rounded-lg border-2 border-eBlue px-4 py-2 mx-1
//             font-semibold bg-eDarker hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] text-eBlue
//             active:border-[#555]" style={{ transition: "border-color 0.10s, color 0.10s" }}>URL</button>
//             </div>

//             <div id="AnswerDiv" onInput={handleAnswerInput} contentEditable className='bg-eDarker rounded-md border
//             border-eGray w-[90%] h-[15vh] text-left p-2'>
//               <htmlcontent html={answer}></htmlcontent>
//             </div>

//             {Answer_requirement === 'latex' && (
//               <LatexDisplay value={answerlatex} onChange={(e) => setAnswerLatexInput(e.target.value)} blockMathInput={answerlatex}></LatexDisplay>
//             )}

//             {Answer_requirement === 'video' && (
//               <div>
//                 <label htmlFor='videoInput'>Put your video link here : </label>
//                 <input name="videoInput" type="text" value={answervideolink} onChange={(e) => setAnswerVideoLink(e.target.value)} style={{ width: '250px', height: '50px' }}></input>
//                 {ReactPlayer.canPlay(answervideolink) ? (
//                   <>
//                     <p>preview </p>
//                     <ReactPlayer url={answervideolink} controls={true} />
//                   </>
//                 ) : (
//                   <p>The link is not available</p>
//                 )}
//               </div>
//             )}

//             {Answer_requirement === 'image' && (
//               <ImageDisplay htmlFor='AnswerimageInput' name='AnswerimageInput' value={answerimagelink}
//                 onChange={(e) => setAnswer_ImageUrl(e.target.value)} imgSrc={answerimagelink} />
//             )}

//             <button type='submit' className="rounded-lg border border-transparent px-4 py-2
//           font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333]
//           active:border-[#555] mt-4" style={{ transition: "border-color 0.10s, color 0.10s" }}>
//               Submit
//             </button>

//           </form>
//         )}
//         {showPopup && (
//           <div className={`fixed font-bold text-eDarker bottom-5 left-1/2 -translate-x-1/2 transform p-4 bg-${popupColor}-500 rounded-md transition-opacity duration-1000 ${popupOpacity}`}>
//             {popupMessage}
//           </div>
//         )}
//       </>
//     );
//   }
// }

// function LatexDisplay({ value, onChange, blockMathInput }) {
//   return (
//     <div className='w-full flex flex-col items-center mt-2'>
//       <textarea value={value} onChange={onChange} className='bg-eDarker rounded-md border
//             border-eGray w-[40%] h-20 p-2 text-center'></textarea>
//       <h2>Preview</h2>
//       <div className='px-4 border min-w-16 min-h-12'>
//         <BlockMath math={blockMathInput} errorColor={'#cc0000'} />
//       </div>
//     </div>
//   )
// }

// function ImageDisplay({ htmlFor, name, value, onChange, imgSrc }) {
//   return (
//     <>
//       <div className='m-2'>
//         <label htmlFor={htmlFor} className='font-bold mr-2'>Image Link:</label>
//         <input name={name} value={value} type="text" onChange={onChange}
//           className='bg-eDarker mb-2'></input>
//       </div>
//       <img src={imgSrc} className='max-w-[250px] max-h-[250px]' />
//     </>
//   )
// }

// const CustomButton = ({ onClick, text }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="rounded-lg border border-transparent px-2 py-1 mx-1 mt-8 font-normal bg-[#111111]
//     hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] active:border-[#555]"
//     style={{ transition: "border-color 0.10s, color 0.10s" }}
//   >
//     {text}
//   </button>
// );

// export default CreateCard