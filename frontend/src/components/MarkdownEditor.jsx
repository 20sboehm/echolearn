import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import { ChevronIcon } from "../components/Icons";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { Link } from "react-router-dom";
import {
  BoldIcon, ItalicIcon, UnderlineIcon, CodeIcon, CodeBlockIcon, HeaderIcon1, HeaderIcon2, HeaderIcon3,
  HeaderIcon4, PageBreakIcon, ImageLinkIcon, VideoLinkIcon, LinkIcon, TableIcon, LatexIcon, LatexBlockIcon, MicIcon, MicIconListening
} from "../components/Icons";

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
  const [popupSuccess, setPopupSuccess] = useState(false);
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
      setPopupSuccess(true);
      setPopupColor("bg-edGreen");
    } else {
      setPopupText("Something went wrong");
      setPopupSuccess(false);
      setPopupColor("bg-edRed");
    }

    popupTimerRef.current = setTimeout(() => {
      setPopupActive(false);
    }, 5000) // 1500
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
    let insertionType = "symmetrical";
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
      case "code":
        insertionChar = "`";
        cursorAdjustment = 1;
        break;
      case "latex":
        insertionChar = "$";
        cursorAdjustment = 1;
        break;
      case "latexBlock":
        insertionChar = "$$";
        cursorAdjustment = 2;
        break;
      case "pageBreak":
        insertionChar = "\n---\n";
        cursorAdjustment = 5;
        insertionType = 'one-sided';
        break;
      case "header1":
        insertionChar = "# ";
        cursorAdjustment = 2;
        insertionType = 'one-sided';
        break;
      case "header2":
        insertionChar = "## ";
        cursorAdjustment = 3;
        insertionType = 'one-sided';
        break;
      case "header3":
        insertionChar = "### ";
        cursorAdjustment = 4;
        insertionType = 'one-sided';
        break;
      case "header4":
        insertionChar = "#### ";
        cursorAdjustment = 5;
        insertionType = 'one-sided';
        break;
      case "codeBlock":
        cursorAdjustment = 4;
        insertionType = 'codeBlock';
        break;
      case "link":
        insertionType = 'link';
        break;
      case "imageLink":
        cursorAdjustment = 9;
        insertionType = 'imageLink';
        break;
      case "videoLink":
        cursorAdjustment = 3;
        insertionType = 'videoLink';
        break;
      case "table":
        insertionType = 'table';
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

    let newText = ""
    if (insertionType === "symmetrical") {
      newText = firstHalf + insertionChar + selection + insertionChar + secondHalf;
    }
    else if (insertionType === "one-sided") {
      newText = firstHalf + insertionChar + selection + secondHalf;
    }
    else if (insertionType === "codeBlock") {
      newText = firstHalf + "```\n" + selection + "\n```" + secondHalf;
    }
    else if (insertionType === "link") {
      if (selection) {
        cursorAdjustment = 1;
        newText = firstHalf + "[" + selection + "](" + selection + ")" + secondHalf;
      } else {
        cursorAdjustment = 7;
        newText = firstHalf + "[" + "link" + "](" + selection + ")" + secondHalf;
      }
    }
    else if (insertionType === "imageLink") {
      newText = firstHalf + "![Image](" + selection + ")" + secondHalf;
    }
    else if (insertionType === "videoLink") {
      newText = firstHalf + "!!(" + selection + ")" + secondHalf;
    }
    else if (insertionType === "table") {
      selEnd = selStart;
      selEnd += 70;
      cursorAdjustment = 0;
      newText = firstHalf + "| Header | Header |" + "\n" + "|------| ------ |" + "\n" + "| Data | Data |" + "\n" + "| Data | Data |" + "\n" + secondHalf;
    }

    if (forQuestionBox) {
      setQuestionText(newText);
      setQuestionSelection({ start: selStart + cursorAdjustment, end: selEnd + cursorAdjustment });
    } else {
      setAnswerText(newText);
      setAnswerSelection({ start: selStart + cursorAdjustment, end: selEnd + cursorAdjustment });
    }
  }

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.setSelectionRange(answerSelection.start, answerSelection.end);
      answerRef.current.focus();
    }
  }, [answerSelection]);

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.setSelectionRange(questionSelection.start, questionSelection.end);
      questionRef.current.focus();
    }
  }, [questionSelection]);

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
      if (requestType === "post") {
        setQuestionText("");
        setAnswerText("");
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <div className="flex flex-col max-w-[516px]">
            <TextBox label="Question" reference={questionRef} content={questionText} inputHandler={(e) => { setQuestionText(e.target.value) }}
              handleTextEditingButton={handleTextEditingButton} forQuestionBox={true} questionisListening={questionisListening} />
            <TextBoxPreview label="Question Preview" content={questionText} />
          </div>

          <div className="w-0 h-[30vh] border border-elDividerGray dark:border-edDividerGray mt-2"></div>

          <div className="flex flex-col max-w-[516px]">
            <TextBox label="Answer" reference={answerRef} content={answerText} inputHandler={(e) => { setAnswerText(e.target.value) }}
              handleTextEditingButton={handleTextEditingButton} forQuestionBox={false} answerisListening={answerisListening} />
            <TextBoxPreview label="Answer Preview" content={answerText} />
          </div>
        </div>

        <div className="flex flex-col items-center mt-8">
          <SubmitButton>{submitButtonText}</SubmitButton>
        </div>
      </form>
      <div className={`flex flex-col items-center min-w-40 p-3 fixed top-20 right-5 rounded-[1.4rem] text-white font-semibold ${popupColor}
          transition-opacity duration-200 ${popupActive ? 'opacity-100' : 'opacity-0'}`}
      >
        {popupText}
        {popupSuccess && (
          <Link to={`/decks/${deckId}`} className="font-semibold bg-elStrongHLT rounded-md px-3 py-2 mt-2">Go to deck</Link>
        )}
      </div>
    </>
  )
}

function TextBox({ label, reference, content, inputHandler, handleTextEditingButton, forQuestionBox, questionisListening, answerisListening }) {
  const [textBoxOpen, setTextBoxOpen] = useState(true);

  // Hotkeys for text editor buttons
  const handleKeyDown = (e, forQuestionBox) => {
    let k = e.key;
    if (e.ctrlKey) {
      e.preventDefault();
      console.log("here 1")

      if (e.shiftKey) {
        console.log("here 2")
        console.log(k)
        switch (k) {
          case "~": // Shift makes ` a different character
            handleTextEditingButton(forQuestionBox, "codeBlock");
            break;
          case "L": // Shift makes this uppercase
            handleTextEditingButton(forQuestionBox, "latexBlock");
            break;
        }
      } else {
        switch (k) {
          case "b":
            handleTextEditingButton(forQuestionBox, "bold");
            break;
          case "i":
            handleTextEditingButton(forQuestionBox, "italic");
            break;
          case "u":
            handleTextEditingButton(forQuestionBox, "underline");
            break;
          case "`":
            handleTextEditingButton(forQuestionBox, "code");
            break;
          case "l":
            handleTextEditingButton(forQuestionBox, "latex");
            break;
        }
      }
    }
  };

  return (
    <>
      <button type="button" onClick={() => { setTextBoxOpen(!textBoxOpen) }} className="flex items-center">
        <ChevronIcon isOpen={textBoxOpen} color="#ccc" />
        <p className="text-elDark dark:text-edGray">{label}</p>
      </button>
      {/* add a bg color for light mode? */}
      <div className="dark:bg-edDarker w-full border-x border-t border-edDarkGray flex items-center flex-wrap pl-2 py-1.5">
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "bold"); }} Icon={BoldIcon} buttonTitle="Bold (ctrl + b)" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "italic"); }} Icon={ItalicIcon} buttonTitle="Italic (ctrl + i)" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "underline"); }} Icon={UnderlineIcon} buttonTitle="Underline (ctrl + u)" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "code"); }} Icon={CodeIcon} buttonTitle="Code (ctrl + `)" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "codeBlock"); }} Icon={CodeBlockIcon} buttonTitle="Code Block (ctrl + shift + `)" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "pageBreak"); }} Icon={PageBreakIcon} buttonTitle="Page Break" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "link"); }} Icon={LinkIcon} buttonTitle="Link" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "imageLink"); }} Icon={ImageLinkIcon} buttonTitle="Image" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "videoLink"); }} Icon={VideoLinkIcon} buttonTitle="Video" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "table"); }} Icon={TableIcon} buttonTitle="Table" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "latex"); }} Icon={LatexIcon} buttonTitle="Latex (ctrl + l)" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "latexBlock"); }} Icon={LatexBlockIcon} buttonTitle="Latex Block (ctrl + shift + l)" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "header1"); }} Icon={HeaderIcon1} buttonTitle="Header 1" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "header2"); }} Icon={HeaderIcon2} buttonTitle="Header 2" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "header3"); }} Icon={HeaderIcon3} buttonTitle="Header 3" />
        <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "header4"); }} Icon={HeaderIcon4} buttonTitle="Header 4" />


        {questionisListening == false && (
          <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "questionmicIcon"); }} Icon={MicIcon} buttonTitle="Voice Input" />
        )}
        {questionisListening == true && (
          <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "questionmicIconlistening"); }} Icon={MicIconListening} buttonTitle="Voice Input" />
        )}

        {answerisListening == false && (
          <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "answermicIcon"); }} Icon={MicIcon} buttonTitle="Voice Input" />
        )}
        {answerisListening == true && (
          <TextEditingIcon clickHandler={() => { handleTextEditingButton(forQuestionBox, "answermicIconlistening"); }} Icon={MicIconListening} buttonTitle="Voice Input" />
        )}
      </div>
      {textBoxOpen && (
        <textarea value={content} ref={reference} onInput={inputHandler}
          className="text-black dark:text-white dark:bg-edDarker w-full min-h-20 h-[18vh] p-2 border 
          border-edDarkGray focus:outline-none custom-scrollbar" onKeyDown={(e) => { handleKeyDown(e, forQuestionBox) }}></textarea>
      )}
    </>
  );
}

function TextEditingIcon({ clickHandler, Icon, buttonTitle }) {
  return <button type='button' onClick={clickHandler} className='mr-3' title={buttonTitle}><Icon /></button>;
}

function TextBoxPreview({ label, content, className }) {
  const [textBoxPreviewOpen, setTextBoxPreviewOpen] = useState(true);

  return (
    <>
      <button type="button" onClick={() => { setTextBoxPreviewOpen(!textBoxPreviewOpen) }} className="flex items-center">
        <ChevronIcon isOpen={textBoxPreviewOpen} />
        <p className="text-elDark dark:text-edGray">{label}</p>
      </button>
      {textBoxPreviewOpen && (
        <MarkdownPreviewer content={content} className={`border border-edDarkGray bg-white dark:bg-edDarker text-black dark:text-white p-2 min-h-[12vh] ${className}`} />
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