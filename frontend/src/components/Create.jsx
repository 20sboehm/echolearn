import { useMutation,useQuery } from "react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SideBar from "./SideBar.jsx";
import UserHeader from "./Header.jsx";
import "./Create.css";

import ReactPlayer from 'react-player';
import { BlockMath } from 'react-katex';
import Markdown from 'react-markdown'

function Create() {
  const [folders, setFolderValue] = useState("");
  const [decks, setDeckValue] = useState("");
  const [latexInput, setLatexInput] = useState('');
  const [requirement, setrequirement] = useState('');
  const [editorContent, setEditorContent] = useState('Input new stuff here!');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); 
  const url =  "https://www.youtube.com/embed/dQw4w9WgXcQ";
  
  // Define functions to handle dropdown value changes
  const folderChange = (event) => {
    setFolderValue(event.target.value);
  };
  const deckChange = (event) => {
    setDeckValue(event.target.value);
  };
  const handleInputChange = (event) => {
    setLatexInput(event.target.value);
  };
  const handleRequirement =(value) =>{
    if(requirement === value)
    {
      setrequirement("");
      return;
    }
    setrequirement(value);
  }
  const handleEditorChange = (event) => {
    setEditorContent(event.currentTarget.textContent);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setImage(file);

      // Create a URL for the image to display it
      const fileUrl = URL.createObjectURL(file);
      setImageUrl(fileUrl);
    } else {
      setImage(null);
      setImageUrl('');
    }
  };
  const formSubmissionMutation = useMutation(async (formData) => {
    console.log(JSON.stringify(formData))
    const response = await fetch('http://localhost:8000/api/cards/create', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${reponse.status_code}`);
    }
    if (response.ok) {
      const { formatted } = await response.json();
    }
    return response.json();
  });
 
  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmissionMutation.mutate({ }, {
      onSuccess: () => {
        console.log('content edited successfully');
        //popupDetails('content edited successfully', 'green')
      },
      onError: () => {
        console.log('Something went wrong...');
        //popupDetails('Something went wrong...', 'red')
      }
    });
  };
 
  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const markdown = '# Hi, *Pluto*iugiu*giugu*!'
  return (
    <div className="card-create-page">
      <UserHeader />
      <SideBar />
      <div className="selection">
        {/* Folder Dropdown, later will change to folder that the user has */}
        <select className="dropDown" value={folders} onChange={folderChange}>
          <option value="">Folders</option>
          <option value="option1">5530</option>
          <option value="option2">Computer System</option>
        </select>

        {/* Deck Dropdown, later will need change to depend on which folder choiced */}
        <select className="dropDown" value={decks} onChange={deckChange}>
          <option value="">Decks</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <h2>Following will be the text editor to create cards</h2>

      <form  onSubmit={handleSubmit}>
        <button type = "button" onClick={() => handleRequirement('Image')}>Image</button>
        <button type = "button" onClick={() => handleRequirement('video')}>video</button>
        <button type = "button" onClick={() => formatText('bold')}>bold</button>
        <button type = "button" onClick={() => formatText('italic')}>italic</button>
        <button type = "button" onClick={() => formatText('underline')}>underline</button>
        <button type = "button" onClick={() => formatText('insertUnorderedList')}>orderedlist</button>
        <button type = "button" onClick={() => handleRequirement('latex')}>latex</button>
        <button type = "button" onClick={() => handleRequirement('URL')}>URL</button>
  
        <div contentEditable={true} onBlur={handleEditorChange} className="editableArea" style={{border: '1px solid black', textAlign: 'left',  minHeight: '100px', padding: '10px', marginTop: '10px',backgroundColor:'grey'}}>
        {editorContent}
        </div>

      {requirement === 'video' && (
        <div>
          {ReactPlayer.canPlay(editorContent) ? (
            <ReactPlayer url= {editorContent} controls={true} />
          ) : (
            //alert("Invalid or unspported link")
            <p>The link is not available</p>
          )}
        </div>
      )}
      
      <input type="file" accept="image/*"  onChange={handleImageChange}></input>
      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{maxWidth: '500px', maxHeight: '500px'}} />}
      
      <button type='submit'>Submit</button>
      
      </form>
      {requirement === 'latex' && (
      <div>
      <h2>LaTeX Input</h2>
      <textarea 
        value={latexInput} 
        onChange={handleInputChange} 
        placeholder="Enter LaTeX code here..." 
        rows="4" 
        style={{ width: '100%' }} 
      />
      <Markdown>{markdown}</Markdown>
      <h2>Preview</h2>
      <div style={{border: '1px solid #ccc', padding: '10px'}}>
        <BlockMath math={latexInput} errorColor={'#cc0000'} />
      </div>
    </div>
     )}

    </div>
  );
}

export default Create;