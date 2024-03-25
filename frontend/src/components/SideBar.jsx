import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "./SideBar.css";

function SidebarContent({ isOpen, sidebarRef}) {
    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef}>
            <button>Create</button>
        </div>
    );
}

function SidebarButton( { isOpen, toggleSidebar, sidebarRef }) {
  const sidebarRect = isOpen ? sidebarRef.current.getBoundingClientRect() : null;
  const buttonPosition = isOpen ? sidebarRect.width - 20 : 0;

    const buttonStyle = {
      left: buttonPosition + "px",
      transform: "rotate(270deg)",
      transition: "right 0.5s ease-in-out",
    };

    return (
      <button className="sidebarButton" style={buttonStyle} onClick={toggleSidebar}>
        {isOpen ? "Close" : "Open"}
      </button>
    );
}

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div>
          <SidebarContent isOpen={ isOpen } sidebarRef={ sidebarRef }/>
          <SidebarButton isOpen={ isOpen } toggleSidebar={ toggleSidebar } sidebarRef={ sidebarRef }/>
      </div>
    );
}

export default Sidebar;
