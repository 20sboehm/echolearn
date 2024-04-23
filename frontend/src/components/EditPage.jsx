import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect ,useRef} from "react";
import Sidebar from "./SideBar";
import { useApi } from "../api";
import sanitizeHtml from 'sanitize-html';
import ReactPlayer from 'react-player';
import { BlockMath } from 'react-katex';

function EditPage() {
  const api = useApi();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [popupOpacity, setPopupOpacity] = useState('opacity-100');

  const { cardId } = useParams();
  const [question, setQuestion] = useState('');

  const[questionvideolink,setQuestionVideoLink] = useState('');
  const[answervideolink,setAnswerVideoLink] = useState('');

  const [answerlatex, setAnswerLatexInput] = useState('');
  const [questionlatex, setQuestionLatexInput] = useState('');

  const [Answer_requirement, setAnswer_requirement] = useState('');
  const [Question_requirement, setQuestion_requirement] = useState('');

  const [answerimagelink, setAnswer_ImageUrl] = useState(''); 
  const [questionimagelink, setQuestion_ImageUrl] = useState(''); 
  const [answer, setAnswer] = useState('');

  const navigate = useNavigate();

  const handleAnswerRequirement =(value) =>{
    setAnswerVideoLink('');
    setAnswer_ImageUrl('');
    setAnswerLatexInput('');
    if(Answer_requirement === value)
    {
      setAnswer_requirement("");
      return;
    }
    setAnswer_requirement(value);
  }

  const handleQuestionRequirement =(value) =>{
    setQuestionVideoLink('');
    setQuestion_ImageUrl('');
    setQuestionLatexInput('');
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

  const handleAnswerChange = (newHtml) => {
    const safeHtml = sanitizeHtml(newHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['b', 'i', 'u', 'strong', 'em']),
      allowedAttributes: {}
    });
    setAnswer(safeHtml);
  };
  const handleQuestionChange = (newHtml) => {
    const safeHtml = sanitizeHtml(newHtml, {
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
    // fetch(`http://127.0.0.1:8000/api/cards/${cardId}`).then((response) =>
    //   response.json()
    // ),
  });

  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData))

    const response = await api._patch(
      `/api/cards/${formData.card_id}`,
      { question: formData.question, 
        answer: formData.answer,
        answerlatex:formData.answerlatex,
        questionlatex:formData.questionlatex,
        answervideolink:formData.answervideolink,
        questionvideolink:formData.questionvideolink,
        answerimagelink:formData.answerimagelink,
        questionimagelink:formData.questionimagelink}
    );
    // const response = await fetch(`http://localhost:8000/api/cards/${formData.card_id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({
    //     question: formData.question,
    //     answer: formData.answer,
       
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
  
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
      setAnswer_ImageUrl(card.answerimagelink);
      setQuestion_ImageUrl(card.questionimagelink);
      if(card.answerlatex != "")
      {
        setAnswer_requirement('latex');
      }
      if(card.questionlatex != "")
      {
        setQuestion_requirement('latex');
      }
      if(card.answervideolink != "")
      {
        setAnswer_requirement('video');
      }
      if(card.questionvideolink != "")
      {
        setQuestion_requirement('video');
      }
      if(card.answerimagelink != "")
      {
        setAnswer_requirement('image');
      }
      if(card.questionimagelink != "")
      {
        setQuestion_requirement('image');
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

    if(answerlatex !== card.answerlatex)
    {
      updatedData.answerlatex = answerlatex;
    }
    if(questionlatex !== card.questionlatex )
    {
      updatedData.questionlatex = questionlatex ;
    }
    if(answervideolink !== card.answervideolink)
    {
      updatedData.answervideolink = answervideolink;
    }
    if(questionvideolink !== card.questionvideolink )
    {
      updatedData.questionvideolink = questionvideolink;
    }
    if(answerimagelink !== card.answerimagelink )
    {
      updatedData.answerimagelink = answerimagelink;
    }
    if(questionimagelink !== card.questionimagelink)
    {
      updatedData.questionimagelink = questionimagelink;
    }

    console.log(updatedData)
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
          <EditableDiv content={question} setContent={handleQuestionChange} />

          {Question_requirement === 'latex' && (
            <div>
              <textarea value={questionlatex} onChange={(e)=>setQuestionLatexInput(e.target.value)}style={{border: '1px solid black', textAlign: 'left',  minHeight: '180px', width:'500px', padding: '10px', marginTop: '10px',backgroundColor:'grey'}}></textarea>
            <h2>Preview</h2>
            <div style={{border: '1px solid #ccc', padding: '10px',minHeight: '180px', width:'500px'}}>

              <BlockMath math={questionlatex} errorColor={'#cc0000'} />
            </div>
          </div>
          )}

          { Question_requirement === 'video' && (
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

          <EditableDiv content={answer} setContent={handleAnswerChange} />

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
const EditableDiv = ({ content, setContent }) => {
  const editableRef = useRef(null);

  useEffect(() => {
    if (editableRef.current && editableRef.current.innerHTML !== content) {
      editableRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = (e) => {
    setContent(e.target.innerHTML);
  };

  return (
    <div
      contentEditable
      ref={editableRef}
      onInput={handleInput}
      style={{
        border: '1px solid black',
        textAlign: 'left',
        minHeight: '180px',
        width: '500px',
        padding: '10px',
        marginTop: '10px',
        backgroundColor: 'grey'
      }}
    />
  );
};
export default EditPage