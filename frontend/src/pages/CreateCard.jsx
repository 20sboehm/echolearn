import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import Sidebar from "../components/SideBar";
import { ChevronIcon } from "../components/Icons";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { BoldIcon, ItalicIcon, UnderlineIcon, MicIcon ,MicIconListening} from "../components/Icons";
import { useNavigate } from "react-router-dom";

function CreateCard() {
  const api = useApi();
  const navigate = useNavigate();

  const [deckId, setDeckId] = useState("");

  const questionRef = useRef(null);
  const answerRef = useRef(null);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");

  const [questionSelection, setQuestionSelection] = useState({ start: 0, end: 0 }); // Cursor position
  const [answerSelection, setAnswerSelection] = useState({ start: 0, end: 0 });

  const [popupActive, setPopupActive] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const popupTimerRef = useRef(null); // Ref to hold the popup timer

  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [quizletInput, setquizletInput] = useState("")
  const [preview, setPreview] = useState([])
  const [quizletRequired, setquizletRequired] = useState(false)

  const [questionisListening, setquestionIsListening] = useState(false);
  const [answerisListening, setanswerIsListening] = useState(false);

  const [isQuestionUpdating, setQuestionIsUpdating] = useState(false);
  const [isAnswerUpdating, setAnswerIsUpdating] = useState(false);

  const displayPopup = (isSuccess) => {
    // Clear the old timer if it is still active
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    setPopupActive(true);

    if (isSuccess) {
      setPopupText("Card created");
      setPopupColor("bg-eGreen");
    } else {
      setPopupText("Something went wrong");
      setPopupColor("bg-eRed");
    }

    popupTimerRef.current = setTimeout(() => {
      setPopupActive(false);
    }, 1500)
  }

  const handleTextEditingButton = (forQuestionBox, type) => {
    let textarea = null;
    if (forQuestionBox) {
      textarea = questionRef.current;
    } else {
      textarea = answerRef.current;
    }

    let text = null;
    if (forQuestionBox) {
      text = questionText;
    } else {
      text = answerText;
    }

    let insertionChar = "";
    let cursorAdjustment = 0;
    switch (type) {
      case "bold":
        insertionChar = "**";
        cursorAdjustment = 2;
        break;
      case "italic":
        insertionChar = "*";
        cursorAdjustment = 1;
        break;
      case "underline":
        insertionChar = "__";
        cursorAdjustment = 2;
        break;
      case "questionmicIcon":
        setquestionIsListening(prevState => !prevState)
        break;
      case "questionmicIconlistening":
        setquestionIsListening(prevState => !prevState)
        break;
      case "answermicIcon":
          setanswerIsListening(prevState => !prevState)
          break;
      case "answermicIconlistening":
          setanswerIsListening(prevState => !prevState)
            break;
    }

    let selStart = textarea.selectionStart;
    let selEnd = textarea.selectionEnd;

    const firstHalf = text.substring(0, selStart);
    const selection = text.substring(selStart, selEnd)
    const secondHalf = text.substring(selEnd);

    let newText = firstHalf + insertionChar + selection + insertionChar + secondHalf;

    if (forQuestionBox) {
      setQuestionText(newText);
      setQuestionSelection({ start: selStart + cursorAdjustment, end: selEnd + cursorAdjustment });
    } else {
      setAnswerText(newText);
      setAnswerSelection({ start: selStart + cursorAdjustment, end: selEnd + cursorAdjustment });
    }
  }

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.setSelectionRange(questionSelection.start, questionSelection.end);
      questionRef.current.focus();
    }
  }, [questionSelection]);

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.setSelectionRange(answerSelection.start, answerSelection.end);
      answerRef.current.focus();
    }
  }, [answerSelection]);
  // show preview for quizlet parser
  useEffect(() => {
    let spaceChoice = "|";
    let lineChoice = "{|}";

    const lines = quizletInput.split(lineChoice).filter(line => line.trim());
    const formattedPreview = lines.map(line => {
      const parts = line.split(spaceChoice).map(part => part.trim());
      return { question: parts[0], answer: parts[1] };
    });
    setPreview(formattedPreview);
  }, [quizletInput]);
  
  // voice input for question part
  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      if (event.results[current].isFinal) {
        recognition.stop(); // Stop recognition while processing
        updateQuestionWithTranscript(transcript ).then(() => {
          if (!questionisListening) {
            recognition.start(); // Restart recognition after update
          }
        });
      }
    };

    recognition.onstart = () => console.log('Voice recognition activated. Start speaking.');
    recognition.onend = () => console.log('Voice recognition stopped.');

    if (!isQuestionUpdating && questionisListening) {
      recognition.start();
    }

    return () => {
      recognition.stop(); // Ensure recognition is stopped on cleanup
    };
  }, [questionisListening, isQuestionUpdating]);

  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      if (event.results[current].isFinal) {
        recognition.stop(); // Stop recognition while processing
        updateAnswerWithTranscript(transcript ).then(() => {
          if (!answerisListening) {
            recognition.start(); // Restart recognition after update
          }
        });
      }
    };

    recognition.onstart = () => console.log('Voice recognition activated. Start speaking.');
    recognition.onend = () => console.log('Voice recognition stopped.');

    if (!isAnswerUpdating && answerisListening) {
      recognition.start();
    }

    return () => {
      recognition.stop(); // Ensure recognition is stopped on cleanup
    };
  }, [answerisListening, isAnswerUpdating]);

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
      question: questionText,
      answer: answerText,
    }

    const response = await api._post('/api/cards', cardData);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating card: ", errorData);
      displayPopup(false);
    } else {
      console.log("Card created successfully");
      displayPopup(true);
    }
  }
  // create multiple cards
  const handlequizletparser = async (e) => {
    e.preventDefault();
    console.log(quizletInput)
    let lineChoice = "{|}";
    let spaceChoice = "|";

    const lines = (quizletInput).trim().split(lineChoice).filter(line => line.trim());
    console.log(lines)
    const newCards = lines.map(async line => {
      const parts = line.split(spaceChoice);
      console.log(parts[0], parts[1])
      const question = parts[0]
      const answer = parts[1]
      const cardData = {
        deck_id: deckId,
        question: question,
        answer: answer,
      }
      const response = await api._post('/api/cards', cardData);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating card: ", errorData);
        displayPopup(false);
      } else {
        console.log("Card created successfully");
        displayPopup(true);
      }
    });

    if (quizletInput !== null) {
      setquizletInput('')
    }

  };
  const handlebackButton = () => {
    // if (multipleRequired) {
    //   if (multipleInput) {
    //     const shouldLeave = window.confirm("You have stuff did not save. Do you still want to leave?");
    //     if (shouldLeave) {
    //       setMultipleInput("")
    //       setmultipleRequired(false)
    //     }
    //   }
    //  else{
    //   setmultipleRequired(false)
    //  }
    // }
    if (quizletRequired) {
      if (quizletInput) {
        const shouldLeave = window.confirm("You have stuff did not save. Do you still want to leave?");
        if (shouldLeave) {
          setQuizletInput("")
          setquizletRequired(false)
        }
      }
      else {
        setquizletRequired(false)
      }
    }
  }

  const updateQuestionWithTranscript = async (newTranscript) => {
    // Indicate an update is in progress
    setQuestionIsUpdating(true); 
    // Append new transcript to the existing content
    const combinedText = questionText + ' ' + newTranscript;
    await new Promise(resolve => {
      setQuestionText(combinedText); // Asynchronously update the question state
      setTimeout(resolve, 1); // Resolve the promise on the next tick, allowing state to update
    });
    // Update is complete
    setQuestionIsUpdating(false); 
  };

  const updateAnswerWithTranscript = async (newTranscript) => {
     // Indicate an update is in progress
    setAnswerIsUpdating(true);
    // Append new transcript to the existing content
    const combinedText = answerText + ' ' + newTranscript;
    await new Promise(resolve => {
      setAnswerText(combinedText);
      setTimeout(resolve, 1);
    });
    // Update is complete
    setAnswerIsUpdating(false); 
  };


  return (
    <>
      <div className='flex w-full h-full'>
        <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="w-1/2 flex flex-col mx-auto">
          <div className="flex justify-between border-b-2 border-edMedGray mb-4 mt-8 pb-1">
            <h1 className="text-xl text-elDark dark:text-edWhite font-medium">New Card</h1>
            <select id="selectDeck" value={deckId} onChange={(e) => setDeckId(e.target.value)} className='text-black bg-elGray border border-black dark:bg-edDarker dark:text-edWhite focus:outline-none' >
              <option key='select-deck-key' value=''>Select a deck</option>
              {decks.map((deck) => (
                <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
              ))}
            </select>
          </div>
          
          {quizletRequired == true && (
            <form onSubmit={handlequizletparser} className='flex flex-col items-center'>
              <button type='button' onClick={handlebackButton} className="rounded-lg border border-black hover:border-elMedGray hover:text-elDark 
              dark:border-transparent dark:hover:border-black dark:hover:text-black px-10 py-2 text-center
              font-semibold bg-elLightBlue text-white dark:text-black dark:bg-white active:scale-[0.97] active:border-[#555]" >
                Back
              </button>
              <p className="text-elDark dark:text-edWhite">
                To export from Quizlet, you need to go to "your library", then select the set you want to copy, then click on the triple dots and select export.
                <br />
                In the pop-up window, input "<code>|</code>" for customizing the separator between term and definition and input "<code>&#123;|&#125;</code>" for customizing the separator between rows.
              </p>
              <div className="mb-2 flex flex-col">
                <textarea value={quizletInput} onChange={(e) => setquizletInput(e.target.value)} className="text-black dark:text-white dark:bg-edDarker w-full min-h-20 h-40 p-2 border border-edDarkGray focus:outline-none custom-scrollbar"></textarea>
              </div>
              <button type='submit' className="rounded-lg border border-black hover:border-elMedGray hover:text-elDark 
              dark:border-transparent dark:hover:border-black dark:hover:text-black px-10 py-2 text-center
              font-semibold bg-elLightBlue text-white dark:text-black dark:bg-white active:scale-[0.97] active:border-[#555]" >
                Submit
              </button>

              <h3 className="text-elDark dark:text-edWhite">Preview</h3>
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
          {quizletRequired == false && (

            <form onSubmit={handleSubmit}>
              <button type="button" onClick={() => setquizletRequired(true)} className="rounded-lg border border-black hover:border-elMedGray hover:text-elDark 
              dark:border-transparent dark:hover:border-black dark:hover:text-white px-10 py-2 text-center
              font-semibold bg-elLightBlue text-white active:scale-[0.97] active:border-[#555]">quizlet parser</button>
              <div className="mb-2 flex flex-col">
                <TextBox label="Front" reference={questionRef} content={questionText} inputHandler={(e) => { setQuestionText(e.target.value) }}
                  handleTextEditingButton={handleTextEditingButton} forQuestionBox={true} questionisListening={questionisListening} />
              </div>
              <TextBox label="Back" reference={answerRef} content={answerText} inputHandler={(e) => { setAnswerText(e.target.value) }}
                handleTextEditingButton={handleTextEditingButton} forQuestionBox={false}  answerisListening={answerisListening}/>

              <DividerLine />

              <div className="mb-2 flex flex-col">
                <TextBoxPreview label="Question Preview" content={questionText} />
              </div>
              <TextBoxPreview label="Answer Preview" content={answerText} />

              <div className="flex flex-col items-center mt-8">
                <SubmitButton>Create Card</SubmitButton>
                <button type="button" onClick={() => { navigate(`/`); }} className="block rounded-sm sm:rounded-lg p-[7px] w-1/3 text-center font-medium
              border border-edGray text-black dark:text-edWhite hover:bg-edHLT active:scale-[0.97] mt-2"> Back</button>
              </div>
            </form>
          )}
        </div>
        <div className={`width-20 p-3 absolute top-20 right-5 rounded-[1.4rem] text-white ${popupColor}
          transition-opacity duration-200 ${popupActive ? 'opacity-100' : 'opacity-0'}`}>{popupText}</div>
      </div>
    </>
  )
}

function TextBox({ label, reference, content, inputHandler, handleTextEditingButton, forQuestionBox ,questionisListening, answerisListening}) {
  const [textBoxOpen, setTextBoxOpen] = useState(true);

  return (
    <>
      <button type="button" onClick={() => { setTextBoxOpen(!textBoxOpen) }} className="flex items-center">
        <ChevronIcon isOpen={textBoxOpen} color="#ccc" />
        <p className="text-elDark dark:text-edGray">{label}</p>
      </button>
      {/* add a bg color for light mode? */}
      <div className="dark:bg-edDarker w-full h-8 border-x border-t border-edDarkGray flex items-center pl-2">
        <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="bold" forQuestionBox={forQuestionBox} />
        <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="italic" forQuestionBox={forQuestionBox} />
        <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="underline" forQuestionBox={forQuestionBox} />
        {questionisListening == false &&(
        <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="questionmicIcon" forQuestionBox={forQuestionBox} />
        )}
        {answerisListening == false &&(
        <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="answermicIcon" forQuestionBox={forQuestionBox} />
        )}
        {questionisListening == true &&(
        <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="questionmicIconlistening" forQuestionBox={forQuestionBox} />
        )}
        {answerisListening == true &&(
        <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="answermicIconlistening" forQuestionBox={forQuestionBox} />
        )}
      </div>
      {textBoxOpen && (
        <textarea value={content} ref={reference} onInput={inputHandler} className="text-black dark:text-white dark:bg-edDarker w-full min-h-20 h-[10vh] p-2 border border-edDarkGray focus:outline-none custom-scrollbar"></textarea>
      )}
    </>
  );
}

function TextEditingIcon({ handleTextEditingButton, type, forQuestionBox }) {
  switch (type) {
    case "bold":
      return <button type='button' onClick={() => { handleTextEditingButton(forQuestionBox, type); }} className='mr-2'><BoldIcon /></button>;
    case "italic":
      return <button type='button' onClick={() => { handleTextEditingButton(forQuestionBox, type); }} className='mr-2'><ItalicIcon /></button>;
    case "underline":
      return <button type='button' onClick={() => { handleTextEditingButton(forQuestionBox, type); }} className='mr-2'><UnderlineIcon /></button>;
    case "questionmicIcon":
      return <button type='button' onClick={() => { handleTextEditingButton(forQuestionBox, type); }} className='mr-2'><MicIcon /></button>;
    case "questionmicIconlistening":
      return <button type='button' onClick={() => { handleTextEditingButton(forQuestionBox, type); }} className='mr-2'><MicIconListening /></button>;
    case "answermicIcon":
      return <button type='button' onClick={() => { handleTextEditingButton(forQuestionBox, type); }} className='mr-2'><MicIcon /></button>;
    case "answermicIconlistening":
      return <button type='button' onClick={() => { handleTextEditingButton(forQuestionBox, type); }} className='mr-2'><MicIconListening /></button>;
    default:
      return null;
  }
}

function DividerLine() {
  return (
    <div className="flex flex-row justify-center items-center my-1 w-full" >
      <span className="flex-grow border-b border-edMedGray dark:border-edGray h-1"></span>
      <p className="self-center text-black dark:text-edGray mx-2">Preview</p>
      <span className="flex-grow border-b border-edGray h-1"></span>
    </div >
  )
}

function TextBoxPreview({ label, content }) {
  const [textBoxPreviewOpen, setTextBoxPreviewOpen] = useState(true);

  return (
    <>
      <button type="button" onClick={() => { setTextBoxPreviewOpen(!textBoxPreviewOpen) }} className="flex items-center">
        <ChevronIcon isOpen={textBoxPreviewOpen} />
        <p className="text-elDark dark:text-edGray">{label}</p>
      </button>
      {textBoxPreviewOpen && (
        <MarkdownPreviewer content={content} className="border border-edDarkGray bg-elGray dark:bg-edDarkGray p-2 min-h-[10vh]" />
      )}
    </>
  )
}

function SubmitButton({ children, onSubmit }) {
  return (
    <button onSubmit={onSubmit} className="block rounded-sm sm:rounded-lg p-2 w-1/3 text-center font-medium
                  bg-edBlue text-white hover:bg-elLightBlue active:scale-[0.97]">
      {children}
    </button>
  )
}

export default CreateCard;