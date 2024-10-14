import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import { ChevronIcon } from "../components/Icons";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { BoldIcon, ItalicIcon, UnderlineIcon, MicIcon, MicIconListening } from "../components/Icons";

function MarkdownEditor({ requestType, submitButtonText, questionText, setQuestionText, answerText, setAnswerText, deckId, cardId }) {
  const api = useApi();

  const questionRef = useRef(null);
  const answerRef = useRef(null);

  const [questionSelection, setQuestionSelection] = useState({ start: 0, end: 0 }); // Cursor position
  const [answerSelection, setAnswerSelection] = useState({ start: 0, end: 0 });

  const [questionisListening, setquestionIsListening] = useState(false);
  const [answerisListening, setanswerIsListening] = useState(false);

  const [isQuestionUpdating, setQuestionIsUpdating] = useState(false);
  const [isAnswerUpdating, setAnswerIsUpdating] = useState(false);

  const [popupActive, setPopupActive] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const popupTimerRef = useRef(null); // Ref to hold the popup timer

  const triggerPopup = (isSuccess) => {
    // Clear the old timer if it is still active
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    setPopupActive(true);

    if (isSuccess) {
      if (requestType === "post") {
        setPopupText("Card created");
      } else if (requestType === "patch") {
        setPopupText("Card updated");
      }
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
        updateQuestionWithTranscript(transcript).then(() => {
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
        updateAnswerWithTranscript(transcript).then(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const cardData = {
    //   deck_id: deckId,
    //   question: questionText,
    //   answer: answerText,
    // }

    let response = undefined;
    console.log("yo: " + requestType);

    if (requestType === "post") {
      const cardData = {
        deck_id: deckId,
        question: questionText,
        answer: answerText,
      }

      response = await api._post('/api/cards', cardData);
    }
    else if (requestType === "patch") {
      const cardData = {
        question: questionText,
        answer: answerText,
      }

      response = await api._patch(`/api/cards/${cardId}`, cardData);
    }

    if (!response.ok) {
      triggerPopup(false);
    } else {
      triggerPopup(true);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-2 flex flex-col">
          <TextBox label="Front" reference={questionRef} content={questionText} inputHandler={(e) => { setQuestionText(e.target.value) }}
            handleTextEditingButton={handleTextEditingButton} forQuestionBox={true} questionisListening={questionisListening} />
        </div>
        <TextBox label="Back" reference={answerRef} content={answerText} inputHandler={(e) => { setAnswerText(e.target.value) }}
          handleTextEditingButton={handleTextEditingButton} forQuestionBox={false} answerisListening={answerisListening} />

        <DividerLine />

        <div className="mb-2 flex flex-col">
          <TextBoxPreview label="Question Preview" content={questionText} />
        </div>
        <TextBoxPreview label="Answer Preview" content={answerText} />

        <div className="flex flex-col items-center mt-8">
          <SubmitButton>{submitButtonText}</SubmitButton>
        </div>
      </form>
      <div className={`width-20 p-3 absolute top-20 right-5 rounded-[1.4rem] text-white ${popupColor}
          transition-opacity duration-200 ${popupActive ? 'opacity-100' : 'opacity-0'}`}>{popupText}</div>
    </>
  )
}

function TextBox({ label, reference, content, inputHandler, handleTextEditingButton, forQuestionBox, questionisListening, answerisListening }) {
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
        {questionisListening == false && (
          <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="questionmicIcon" forQuestionBox={forQuestionBox} />
        )}
        {answerisListening == false && (
          <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="answermicIcon" forQuestionBox={forQuestionBox} />
        )}
        {questionisListening == true && (
          <TextEditingIcon handleTextEditingButton={handleTextEditingButton} type="questionmicIconlistening" forQuestionBox={forQuestionBox} />
        )}
        {answerisListening == true && (
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
        <MarkdownPreviewer content={content} className="border border-edDarkGray bg-edDarker p-2 min-h-[10vh]" />
      )}
    </>
  )
}

function SubmitButton({ children }) {
  return (
    <button className="block rounded-sm sm:rounded-lg p-2 w-1/3 text-center font-medium
                  bg-edBlue text-white hover:bg-elLightBlue active:scale-[0.97]">
      {children}
    </button>
  )
}

export default MarkdownEditor;