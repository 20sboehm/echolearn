import Sidebar from "../components/SideBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useRef } from "react";
import { UploadIcon } from "../components/Icons";
import './Buttons.css';
import { useApi } from "../hooks";
import { useQuery } from "react-query";

function MyImagesPage() {
  const api = useApi();

  const [popupActive, setPopupActive] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const popupTimerRef = useRef(null); // Ref to hold the popup timer

  const [sidebarWidth, setSidebarWidth] = useState(250);

  const displayPopup = (isSuccess) => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    setPopupActive(true);

    if (isSuccess) {
      setPopupText("Image uploaded");
      setPopupColor("bg-edGreen");
    } else {
      setPopupText("Something went wrong");
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
      displayPopup(false);
    } else {
      console.error("File uploaded");
      displayPopup(true);
    }

    e.target.value = null
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
          <ul className="flex flex-wrap">
            {images.map(image => (
              <img src={image.link} alt="image" className="max-w-60 max-h-60" />
            ))}
          </ul>
        </div>
        <div className={`flex flex-col items-center min-w-40 p-3 fixed top-20 right-5 rounded-[1.4rem] text-white ${popupColor}
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

export default MyImagesPage;