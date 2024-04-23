import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./SideBar";
import { useApi } from "../api";
import sanitizeHtml from 'sanitize-html';
import ReactPlayer from 'react-player';
import { BlockMath } from 'react-katex';

const CustomButton = ({ onClick, text }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg border border-transparent px-4 py-2 font-semibold bg-[#1a1a1a] hover:border-white hover:text-white active:scale-[0.97] active:bg-[#333] active:border-[#555]"
    style={{ transition: "border-color 0.10s, color 0.10s" }}
  >
    {text}
  </button>
);

function EditPage() {
  const api = useApi();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const { cardId } = useParams();
  const [question, setQuestion] = useState('');

  const [questionvideolink, setQuestionVideoLink] = useState('');
  const [answervideolink, setAnswerVideoLink] = useState('');

  const [answerlatex, setAnswerLatexInput] = useState('');
  const [questionlatex, setQuestionLatexInput] = useState('');

  const [answerRequirement, setAnswerRequirement] = useState('');
  const [questionRequirement, setQuestionRequirement] = useState('');

  const [answerImageLink, setAnswerImageLink] = useState('');
  const [questionImageLink, setQuestionImageLink] = useState('');
  const [answer, setAnswer] = useState('');

  const navigate = useNavigate();

  const handleAnswerRequirement = (value) => {
    setAnswerVideoLink('');
    setAnswerImageLink('');
    setAnswerLatexInput('');
    if (answerRequirement === value) {
      setAnswerRequirement("");
      return;
    }
    setAnswerRequirement(value);
  }

  const handleQuestionRequirement = (value) => {
    setQuestionVideoLink('');
    setQuestionImageLink('');
    setQuestionLatexInput('');
    if (questionRequirement === value) {
      setQuestionRequirement("");
      return;
    }
    setQuestionRequirement(value);
  }

  const makeLink = () => {
    const url = prompt("Enter the URL:", "http://");
    // console.log(url);
    document.execCommand('createLink', false, url);
  }

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const handleAnswerInput = (e) => {
    const newText = e.currentTarget.innerHTML;
    const safeHtml = sanitizeHtml(newText, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['b', 'i', 'u', 'strong', 'em']),
      allowedAttributes: {}
    });
    setAnswer(safeHtml);
  };

  const handleQuestionInput = (e) => {
    const newText = e.currentTarget.innerHTML;
    const safeHtml = sanitizeHtml(newText, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['b', 'i', 'u', 'strong', 'em']),
      allowedAttributes: {}
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
  }

  // Fetch the card data
  const { data: card, isLoading, error } = useQuery({
    queryKey: ["cards", cardId],
    queryFn: () =>
      api._get(`/api/cards/${cardId}`).then((response) => response.json()),
  });

  const formSubmissionMutation = useMutation(async (formData) => {
    // console.log(JSON.stringify(formData))

    const response = await api._patch(
      `/api/cards/${formData.card_id}`,
      {
        question: formData.question,
        answer: formData.answer,
        answerlatex: formData.answerlatex,
        questionlatex: formData.questionlatex,
        answervideolink: formData.answervideolink,
        questionvideolink: formData.questionvideolink,
        answerimagelink: formData.answerimagelink,
        questionimagelink: formData.questionimagelink
      }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status_code}`);
    }

    // Navigate back to deck page
    navigate(`/decks/${card.deck_id}`);
  });

  useEffect(() => {
    // Update state only when card data is available
    if (card) {
      setQuestion(card.question);
      setAnswer(card.answer);
      setAnswerLatexInput(card.answerlatex);
      setQuestionLatexInput(card.questionlatex);
      setAnswerVideoLink(card.answervideolink);
      setQuestionVideoLink(card.questionvideolink);
      setAnswerImageLink(card.answerimagelink);
      setQuestionImageLink(card.questionimagelink);
      if (card.answerlatex != "") {
        setAnswerRequirement('latex');
      }
      if (card.questionlatex != "") {
        setQuestionRequirement('latex');
      }
      if (card.answervideolink != "") {
        setAnswerRequirement('video');
      }
      if (card.questionvideolink != "") {
        setQuestionRequirement('video');
      }
      if (card.answerimagelink != "") {
        setAnswerRequirement('image');
      }
      if (card.questionimagelink != "") {
        setQuestionRequirement('image');
      }
    }
  }, [card]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Getting data object with only the fields that user have changed
    const updatedData = { card_id: cardId };

    if (question !== card.question) {
      updatedData.question = question;
    }

    if (answer !== card.answer) {
      updatedData.answer = answer;
    }

    if (answerlatex !== card.answerlatex) {
      updatedData.answerlatex = answerlatex;
    }

    if (questionlatex !== card.questionlatex) {
      updatedData.questionlatex = questionlatex;
    }

    if (answervideolink !== card.answervideolink) {
      updatedData.answervideolink = answervideolink;
    }

    if (questionvideolink !== card.questionvideolink) {
      updatedData.questionvideolink = questionvideolink;
    }

    if (answerImageLink !== card.answerimagelink) {
      updatedData.answerimagelink = answerImageLink;
    }

    if (questionImageLink !== card.questionimagelink) {
      updatedData.questionimagelink = questionImageLink;
    }

    // console.log(updatedData)
    // should only send the data if user changed a least one
    if (Object.keys(updatedData).length > 1) {
      formSubmissionMutation.mutate(updatedData);
      popupDetails(`Card data has changed.`, 'green');
    } else {
      popupDetails(`No changes detected.`, 'blue');
    }
  };

  return (
    <>
      <Sidebar />
      <form onSubmit={handleSubmit} className='flex flex-col items-center mt-10' >
        
        <div>
          <CustomButton onClick={() => handleQuestionRequirement('image')} text="Image" />
          <CustomButton onClick={() => handleQuestionRequirement('video')} text="Video" />
          <CustomButton onClick={() => formatText('bold')} text="Bold" />
          <CustomButton onClick={() => formatText('italic')} text="Italic" />
          <CustomButton onClick={() => formatText('underline')} text="Underline" />
          <CustomButton onClick={() => handleQuestionRequirement('latex')} text="Latex" />
          <CustomButton onClick={() => makeLink()} text="URL" />
        </div>

        <div id="QuestionDiv" onInput={handleQuestionInput} contentEditable
          style={{ border: '1px solid black', minHeight: '180px', width: '500px', padding: '10px', backgroundColor: 'grey' }} dangerouslySetInnerHTML={{ __html: card.question }}>
        </div>

        {questionRequirement === 'latex' && (
          <div>
            <textarea value={questionlatex} onChange={(e) => setQuestionLatexInput(e.target.value)} style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: 'grey' }}></textarea>
            <h2>Preview</h2>
            <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '180px', width: '500px' }}>

              <BlockMath math={questionlatex} errorColor={'#cc0000'} />
            </div>
          </div>
        )}

        {questionRequirement === 'video' && (
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

        {questionRequirement === 'image' && (
          <div>
            <label htmlFor='QuestionimageInput'>Put your image here:</label>
            <input name='QuestionimageInput' value={questionImageLink} type="text" onChange={(e) => setQuestionImageLink(e.target.value)}></input>
            <img src={questionImageLink} style={{ maxWidth: '250px', maxHeight: '250px' }} />
          </div>
        )}

        <div>
          <CustomButton onClick={() => handleAnswerRequirement('image')} text="Image" />
          <CustomButton onClick={() => handleAnswerRequirement('video')} text="Video" />
          <CustomButton onClick={() => formatText('bold')} text="Bold" />
          <CustomButton onClick={() => formatText('italic')} text="Italic" />
          <CustomButton onClick={() => formatText('underline')} text="Underline" />
          <CustomButton onClick={() => handleAnswerRequirement('latex')} text="Latex" />
          <CustomButton onClick={() => makeLink()} text="URL" />
        </div>

        <div id="AnswerDiv" onInput={handleAnswerInput} contentEditable
          style={{ border: '1px solid black', minHeight: '180px', width: '500px', padding: '10px', backgroundColor: 'grey' }} dangerouslySetInnerHTML={{ __html: card.answer }}>
        </div>

        {answerRequirement === 'latex' && (
          <div>
            <textarea value={answerlatex} onChange={(e) => setAnswerLatexInput(e.target.value)} style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: 'grey' }}></textarea>
            <h2>Preview</h2>
            <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '180px', width: '500px' }}>
              <BlockMath math={answerlatex} errorColor={'#cc0000'} />
            </div>
          </div>
        )}

        {answerRequirement === 'video' && (
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

        {answerRequirement === 'image' && (
          <div>
            <label htmlFor='AnswerimageInput'>Put your image here:</label>
            <input name='AnswerimageInput' value={answerImageLink} type="text" onChange={(e) => setAnswerImageLink(e.target.value)}></input>
            <img src={answerImageLink} style={{ maxWidth: '250px', maxHeight: '250px' }} />
          </div>
        )}

        <button type='submit' className="rounded-lg border border-transparent px-4 py-2 
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

export default EditPage