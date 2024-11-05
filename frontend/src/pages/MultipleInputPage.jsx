import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import Sidebar from "../components/SideBar";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate, useLocation, Link } from "react-router-dom";
import './Buttons.css';

function MultipleInputPage() {
  const api = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const [deckId, setDeckId] = useState(location?.state?.deckId);

  const [multipleInput, setMultipleInput] = useState('');
  const [preview, setPreview] = useState([])

  const [selectedOptionSpace, setSelectedOptionspace] = useState('spacetab');
  const [selectedOptionLine, setSelectedOptionline] = useState('newline');
  const [placeholder,setPlaceHolder] = useState('');

  const [popupActive, setPopupActive] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const popupTimerRef = useRef(null); // Ref to hold the popup timer

  const [sidebarWidth, setSidebarWidth] = useState(250);

  const handleOptionChangeSpace = (event) => {
    setSelectedOptionspace(event.target.value);
  };
  const handleOptionChangenewline = (event) => {
    setSelectedOptionline(event.target.value);
  };

  const displayPopup = (isSuccess) => {
    // Clear the old timer if it is still active
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    setPopupActive(true);

    if (isSuccess) {
      setPopupText("Cards created");
      setPopupSuccess(true);
      setPopupColor("bg-edGreen");
    } else {
      setPopupText("Something went wrong");
      setPopupSuccess(true);
      setPopupColor("bg-edRed");
    }

    popupTimerRef.current = setTimeout(() => {
      setPopupActive(false);
    }, 5000)
  }

  // show preview for multiple input
    useEffect(() => {
    let spaceChoice = selectedOptionSpace === "spacetab" ? '\t' : ',';
    let lineChoice = selectedOptionLine === "newline" ? '\n' : ';';
    if(spaceChoice === '\t'){
      if(lineChoice === '\n'){
        setPlaceHolder("cards1: question    answer\ncards2: question    answer\n...")
      }
      else{
        setPlaceHolder("cards1: question    answer;cards2: question    answer;...")
      }
    }
    else if(spaceChoice === ','){
      if(lineChoice === '\n'){
        setPlaceHolder("cards1: question,answer\ncards2: question,answer\n...")
      }
      else{
        setPlaceHolder("cards1: question,answer;cards2: question,answer;...")
      }
    }
    const lines = multipleInput.split(lineChoice).filter(line => line.trim());
    const formattedPreview = lines.map(line => {
      const parts = line.split(spaceChoice).map(part => part.trim());
      return { question: parts[0], answer: parts[1] };
    });
    setPreview(formattedPreview);
  }, [multipleInput, selectedOptionSpace, selectedOptionLine]);

  // create multiple cards
  const handleSubmitMultiple =async (e) => {
    e.preventDefault();
    if (!deckId) {
        console.error("Error: Missing deckId");
        alert("Faile to creat cards because did not select deck")
        displayPopup(false);
        return; 
    }

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
   
    const cards = lines.map(line => {
        const parts = line.split(spaceChoice);
        return {
          deck_id: deckId,
          question: parts[0],
          answer: parts[1]
        };
      });
      const dataToSend = {
        cards: cards
      };
  
      const response = await api._post('/api/cards/create/multiple', dataToSend);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating cards: ", errorData);
        displayPopup(false);
      } else {
        console.log("All cards created successfully.");
        displayPopup(true);
      }
  
      if (multipleInput !== null) {
        setMultipleInput('')
      }
  };

  const handleBackButton = () => {
    if (multipleInput) {
      const shouldLeave = window.confirm("You have stuff did not save. Do you still want to leave?");
      if (shouldLeave) {
        navigate(`/cards`, { state: { deckId: deckId } })
      }
    }
    else {
      navigate(`/cards`, { state: { deckId: deckId } })
    }
  }

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
  return (
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

        <form onSubmit={handleSubmitMultiple} className='flex flex-col items-center'>
            <button type='button' onClick={handleBackButton} className="block rounded-sm sm:rounded-lg p-[7px] w-[20%] mb-4 text-center font-medium
              border border-edGray text-black dark:text-edWhite hover:bg-edHLT active:scale-[0.97] self-start">
            Back
          </button>
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
              <textarea placeholder={placeholder} value={multipleInput} onChange={(e) => setMultipleInput(e.target.value)} onKeyDown={handleKeyDown}
                style={{ border: '1px solid black', textAlign: 'left', minHeight: '180px', width: '500px', padding: '10px', marginTop: '10px', backgroundColor: 'grey' }} ></textarea>
            </div>

            <button type='submit' className="rounded-lg border border-transparent px-4 py-2 
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
      </div>
      <div className={`flex flex-col items-center min-w-40 p-3 fixed top-20 right-5 rounded-[1.4rem] text-white ${popupColor}
          transition-opacity duration-200 ${popupActive ? 'opacity-100' : 'opacity-0'}`}
      >
        {popupText}
        {popupSuccess && (
          <Link to={`/decks/${deckId}`} className="font-semibold bg-elStrongHLT rounded-md px-3 py-2 mt-2">Go to deck</Link>
        )}
      </div>
    </div>
  );
}

export default MultipleInputPage;