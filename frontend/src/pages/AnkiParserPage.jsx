import { useApi } from "../hooks";
import { useState, useRef, useEffect, Children } from "react";
import Sidebar from "../components/SideBar";
import MarkdownPreviewer from "../components/MarkdownPreviewer";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate, useLocation, Link } from "react-router-dom";
import './Buttons.css';

function QuizletParserPage() {
    const api = useApi();
    const navigate = useNavigate();
    const location = useLocation();

    const [deckId, setDeckId] = useState(location?.state?.deckId);

    const [ankiInput, setankiInput] = useState("")
    const [preview, setPreview] = useState([])

    const [popupActive, setPopupActive] = useState(false);
    const [popupSuccess, setPopupSuccess] = useState(false);
    const [popupText, setPopupText] = useState("");
    const [popupColor, setPopupColor] = useState("");
    const popupTimerRef = useRef(null); // Ref to hold the popup timer

    const [sidebarWidth, setSidebarWidth] = useState(250);

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
    const handleFileuploaded = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n');

            const startIndex = lines.findIndex(line => line.includes("#html:true")) + 1;
            const dataLines = lines.slice(startIndex);

            const data = dataLines.map(line => {
                return line.split('\t');
            });
            setankiInput(data);
        };

        reader.readAsText(file);
    };
    
    // show preview for anki parser
    useEffect(() => {
        const results = [];
        for (let i = 0; i < ankiInput.length - 1; i++) {
            const arr = ankiInput[i];
            results.push({ question: arr[0], answer: arr[1] });
        }

        setPreview(results);

    }, [ankiInput]);

    // create multiple cards
    const handleAnkiParser = async (e) => {
        e.preventDefault();

        console.log(ankiInput)

         // Check if deckId is valid
        if (!deckId) {
            console.error("Error: Missing deckId");
            alert("Faile to creat cards because did not select deck")
            displayPopup(false);
            return; 
        }
        const results = [];
        for (let i = 0; i < ankiInput.length - 1; i++) {
            const arr = ankiInput[i];
            results.push({ deck_id: deckId, question: arr[0], answer: arr[1] });
        }

        const dataToSend = {
            cards: results
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

        if (ankiInput !== null) {
            setankiInput('')
        }

    };

    const handleBackButton = () => {
        if (ankiInput) {
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

    return (
        <div className='flex w-full h-full'>
            <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
            <div className="w-1/2 flex flex-col mx-auto">
                <div className="flex justify-between border-b-2 border-edMedGray mb-4 mt-8 pb-1">
                    <h1 className="text-xl text-elDark dark:text-edWhite font-medium">New Card</h1>
                    <select id="selectDeck" value={deckId} onChange={(e) => setDeckId(e.target.value)}className='text-black bg-elGray border border-black dark:bg-edDarker dark:text-edWhite focus:outline-none' >
                        <option key='select-deck-key' value=''>Select a deck</option>
                        {decks.map((deck) => (
                            <option key={deck.deck_id} value={deck.deck_id}>{deck.name}</option>
                        ))}
                    </select>
                </div>

                <form onSubmit={handleAnkiParser} className='flex flex-col items-center'>
                    <button type='button' onClick={handleBackButton} className="block rounded-sm sm:rounded-lg p-[7px] w-[20%] mb-4 text-center font-medium
              border border-edGray text-black dark:text-edWhite hover:bg-edHLT active:scale-[0.97] self-start">
                        Back
                    </button>

                    <div className="mb-2 flex flex-col w-full">
                        <input type="file" onChange={handleFileuploaded}></input>
                    </div>
                    <button type='submit' className="button-common button-blue font-semibold py-2 text-center w-1/4 my-2">
                        Submit
                    </button>

                    <h3 className="text-elDark dark:text-edWhite">Preview</h3>
                    <div className="h-[50vh] overflow-y-auto">
                        {preview.map((item, index) => (
                            <div className="grid grid-cols-2 gap-4 font-medium px-2" key={index}>
                                <div className="border bg-white dark:bg-edDarker text-black dark:text-edWhite mt-2 px-2 py-2">
                                    <p>Question: {item.question}</p>
                                </div>
                                <div className="border bg-white dark:bg-edDarker text-black dark:text-edWhite mt-2 px-2 py-2 relative">
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

export default QuizletParserPage;