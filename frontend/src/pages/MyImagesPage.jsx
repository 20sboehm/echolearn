import Sidebar from "../components/SideBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useRef } from "react";
import { UploadIcon, DownloadIcon, DeleteIcon, CopyIcon } from "../components/Icons";
import './Buttons.css';
import { useApi } from "../hooks";
import { useQuery, useQueryClient } from "react-query";

function MyImagesPage() {
  const api = useApi();
  const queryClient = useQueryClient();

  const [popupActive, setPopupActive] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const popupTimerRef = useRef(null); // Ref to hold the popup timer


  const [sidebarWidth, setSidebarWidth] = useState(250);

  const displayPopup = (isSuccess, popupText) => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    setPopupActive(true);

    if (isSuccess) {
      setPopupText(popupText);
      setPopupColor("bg-edGreen");
    } else {
      setPopupText(popupText);
      setPopupColor("bg-edRed");
    }

    popupTimerRef.current = setTimeout(() => {
      setPopupActive(false);
    }, 5000)
  }

  const handleFileUpload = async (e) => {
    let formData = new FormData();
    formData.append("image_file", e.target.files[0]);

    const response = await api._postFile("/api/images/upload", formData);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error uploading file: ", errorData);
      displayPopup(false, "Something went wrong");
    } else {
      displayPopup(true, "Image uploaded");
      queryClient.invalidateQueries('images');
    }

    e.target.value = null
  }

  const handleDelete = async (image_id) => {
    const response = await api._delete(`/api/images/delete/${image_id}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error deleting file: ", errorData);
      displayPopup(false, "Something went wrong");
    } else {
      displayPopup(true, "Image deleted");
      queryClient.invalidateQueries('images');
    }
  }

  const { data: images, isLoading, error } = useQuery(
    ['images'],
    async () => {
      const response = await api._get(`/api/images`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${response.status}: ${errorData.detail || 'An error occurred'}`);
      }

      return response.json();
    }
  );

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
    <>
      <div className="flex flex-row w-full h-full">
        <Sidebar onResize={(newWidth) => setSidebarWidth(newWidth)} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        <div className="w-full flex flex-col mx-[15%]">
          <PageHeading handleFileUpload={handleFileUpload} />
          <ul className="flex flex-wrap gap-[1vw]">
            {images.map(image => (
              <ImageNode image={image} handleDelete={handleDelete} key={image.image_id} />
            ))}
          </ul>
        </div>
        <div className={`flex flex-col items-center min-w-40 p-3 fixed top-20 right-5 rounded-[1.4rem] text-white font-semibold ${popupColor}
          transition-opacity duration-200 ${popupActive ? 'opacity-100' : 'opacity-0'}`}>{popupText}</div>
      </div>
    </>
  );
}

function PageHeading({ handleFileUpload }) {
  return (
    <div className="flex justify-between items-center border-b border-elDividerGray dark:border-edDividerGray mb-4 mt-8 pb-2">
      <h1 className="text-[2rem] text-elDark dark:text-edWhite font-medium border-elDividerGray dark:border-edDividerGray">My Images</h1>
      <label className="button-common flex items-center justify-center button-blue py-2 text-center w-[12rem] font-semibold cursor-pointer">
        Upload Image <UploadIcon className="ml-2" />
        <input type="file" accept="image/*" className="hidden" onChange={(e) => { handleFileUpload(e); }} />
      </label>
    </div>
  )
}

function ImageNode({ image, handleDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000); // Hide popup after 1.5 seconds
  };

  return (
    <>
      <div className="w-[10vw] h-[25vh] rounded-xl overflow-y-hidden bg-elCloudWhite text-black dark:bg-edDarker dark:text-edWhite 
      mt-2 p-3 border border-elDark dark:border-edDarker flex flex-col items-center">
        <h1 className="mb-2">{image.name}</h1>
        <div className="relative flex gap-2 mb-2">
          <a download={true} href={image.link} className="button-common bg-edGreen hover:bg-emerald-500 px-2"><DownloadIcon /></a>
          <button onClick={() => { navigator.clipboard.writeText(image.link); handleCopy(); }} className="button-common px-2" ><CopyIcon /></button>
          {copied && <div className="absolute top-10 left-5 bg-edBlue rounded-md text-white">Link copied!</div>}
          <button onClick={() => { handleDelete(image.image_id); }} className="button-common bg-edRed hover:bg-red-500 px-2" ><DeleteIcon /></button>
        </div>
        <img src={image.link} alt="image" className="max-w-[80%]" />
      </div>
    </>
  )
}

export default MyImagesPage;