// --------------------------------------------------
// ------------------ Sidebar Icons -----------------
// --------------------------------------------------

export const DeckCreateIcon = () => {
  return (
    <svg
      width="21px"
      height="21px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 15H14M12 13V17M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19"
        className="stroke-elDark dark:stroke-edWhite"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const FolderCreateIcon = () => {
  return (
    <svg
      width="25px"
      height="25px"
      viewBox="0 0 24 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 13H15M12 10V16M12.0627 6.06274L11.9373 5.93726C11.5914 5.59135 11.4184 5.4184 11.2166 5.29472C11.0376 5.18506 10.8425 5.10425 10.6385 5.05526C10.4083 5 10.1637 5 9.67452 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V10.2C21 9.0799 21 8.51984 20.782 8.09202C20.5903 7.71569 20.2843 7.40973 19.908 7.21799C19.4802 7 18.9201 7 17.8 7H14.3255C13.8363 7 13.5917 7 13.3615 6.94474C13.1575 6.89575 12.9624 6.81494 12.7834 6.70528C12.5816 6.5816 12.4086 6.40865 12.0627 6.06274Z"
        className="stroke-elDark dark:stroke-edWhite"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ExpandContractAllIcon = ({ isExpanded }) => {
  return (
    <svg
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: isExpanded ? "rotate(270deg)" : "rotate(90deg)", // Rotates 180 degrees when expanded
        transition: "transform 0.3s ease",
        width: "20px",
        height: "20px",
      }}
    >
      <path
        d="M11 6L18 12L11 18"
        className="stroke-elDark dark:stroke-edWhite"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="2" y1="12" x2="18" y2="12"
        className="stroke-elDark dark:stroke-edWhite"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const SidebarOpenClose = ({ sidebarOpen, sidebarWidth }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: (sidebarOpen && sidebarWidth !== 0) ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s ease",
        width: "18px",
        height: "18px",
      }}
    >
      <path
        d="M11 6L18 12L11 18"
        className="stroke-elDark dark:stroke-edWhite"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="2" y1="12" x2="18" y2="12"
        className="stroke-elDark dark:stroke-edWhite"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const ChevronIcon = ({ isOpen }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", // Point right when closed, down when open
        transition: "transform 0.3s ease",
        width: "18px",
        height: "18px",
      }}
    >
      <path
        d="M9 6L15 12L9 18"
        className="stroke-elDark dark:stroke-edWhite"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// --------------------------------------------------
// ---------------- Community Icons -----------------
// --------------------------------------------------

export const CurveArrowRight = () => {
  return (
    <svg
      fill="none"
      width="32px"
      height="32px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="icon flat-line stroke-elDark"
    >
      <path
        d="M3,18A13.17,13.17,0,0,1,15.49,9H21"
        style={{
          fill: 'none',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
        }}
      />
      <polyline
        points="18 12 21 9 18 6"
        style={{
          fill: 'none',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
        }}
      />
    </svg>
  );
};

// --------------------------------------------------
// ---------------- Deck page Icons -----------------
// --------------------------------------------------

export const SpeakerIcon = () => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="-5 0 70 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* Outer white glow */}
        <path
          d="M59.998,28.001h-7.999c-2.211,0-4,1.789-4,4s1.789,4,4,4h7.999c2.211,0,4-1.789,4-4 S62.209,28.001,59.998,28.001z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
        />
        <path
          d="M49.71,19.466l6.929-4c1.914-1.105,2.57-3.551,1.461-5.465c-1.102-1.914-3.547-2.57-5.46-1.465l-6.93,4 c-1.914,1.105-2.57,3.551-1.461,5.464C45.351,19.915,47.796,20.571,49.71,19.466z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
        />
        <path
          d="M56.639,48.535l-6.929-3.999c-1.914-1.105-4.355-0.449-5.461,1.464c-1.105,1.914-0.453,4.359,1.461,5.465 l6.93,4c1.913,1.105,4.358,0.449,5.464-1.465S58.553,49.641,56.639,48.535z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
        />
        <path
          d="M37.53,0.307c-1.492-0.625-3.211-0.277-4.359,0.867L18.343,16.001H4c-2.211,0-4,1.789-4,4v24 C0,46.211,1.789,48,4,48h14.343l14.828,14.828C33.937,63.594,34.96,64,35.999,64c0.516,0,1.035-0.098,1.531-0.305 c1.496-0.617,2.469-2.078,2.469-3.695V4.001C39.999,2.384,39.026,0.924,37.53,0.307z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
        />
        <path className="stroke-elDark dark:stroke-edWhite" d="M59.998,28.001h-7.999c-2.211,0-4,1.789-4,4s1.789,4,4,4h7.999c2.211,0,4-1.789,4-4 S62.209,28.001,59.998,28.001z" />
        <path className="stroke-elDark dark:stroke-edWhite" d="M49.71,19.466l6.929-4c1.914-1.105,2.57-3.551,1.461-5.465c-1.102-1.914-3.547-2.57-5.46-1.465l-6.93,4 c-1.914,1.105-2.57,3.551-1.461,5.464C45.351,19.915,47.796,20.571,49.71,19.466z" />
        <path className="stroke-elDark dark:stroke-edWhite" d="M56.639,48.535l-6.929-3.999c-1.914-1.105-4.355-0.449-5.461,1.464c-1.105,1.914-0.453,4.359,1.461,5.465 l6.93,4c1.913,1.105,4.358,0.449,5.464-1.465S58.553,49.641,56.639,48.535z" />
        <path className="stroke-elDark dark:stroke-edWhite" d="M37.53,0.307c-1.492-0.625-3.211-0.277-4.359,0.867L18.343,16.001H4c-2.211,0-4,1.789-4,4v24 C0,46.211,1.789,48,4,48h14.343l14.828,14.828C33.937,63.594,34.96,64,35.999,64c0.516,0,1.035-0.098,1.531-0.305 c1.496-0.617,2.469-2.078,2.469-3.695V4.001C39.999,2.384,39.026,0.924,37.53,0.307z" />
      </g>
    </svg>
  );
};

export const StarIcon = ({ isFilled = false, className }) => {
  return (
    <svg
      aria-hidden="true"
      height="16px"
      width="16px"
      viewBox="0 0 16 16"
      className={`octicon ${isFilled ? 'octicon-star-filled' : 'octicon-star'} ${className}`}
      data-view-component="true"
    >
      {isFilled ? (
        <path fill="gold" className="stroke-elDark dark:stroke-edWhite" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
      ) : (
        <path className="stroke-elDark dark:stroke-edWhite" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z" />
      )}
    </svg>
  );
};

export const EditIcon = () => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="edit-icon"
  >
    <g id="Complete">
      <g id="edit">
        <g>
          {/* Outer white glow path */}
          <path
            d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <polygon
            fill="none"
            points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />

          {/* Inner black paths */}
          <path
            d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
            fill="none"
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <polygon
            fill="none"
            points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </g>
    </g>
  </svg>
);


// --------------------------------------------------
// ------------------ Card Editor -------------------
// --------------------------------------------------

export const BoldIcon = () => (
  <svg
    width="14px"
    height="14px"
    viewBox="0 0 1920 1920"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-elDark dark:fill-edWhite"
  >
    <path d="M480.286 822.857h548.571c151.269 0 274.286-123.017 274.286-274.286 0-151.268-123.017-274.285-274.286-274.285H480.286v548.571Zm0 822.857H1166c151.269 0 274.286-123.017 274.286-274.285 0-151.269-123.017-274.286-274.286-274.286H480.286v548.571ZM1166 1920H206V0h822.857c302.537 0 548.572 246.034 548.572 548.571 0 134.263-48.549 257.418-128.778 352.732 159.223 96.137 265.92 270.994 265.92 470.126 0 302.537-246.034 548.571-548.571 548.571Z" fillRule="evenodd" />
  </svg>
);

export const ItalicIcon = () => (
  <svg
    width="14px"
    height="14px"
    viewBox="0 0 1920 1920"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-elDark dark:fill-edWhite"
  >
    <path d="M738.077 0v147.692h348.554L680.477 1772.308H295V1920h886.302v-147.692H832.748l406.006-1624.616h385.477V0z" fillRule="evenodd" />
  </svg>
);

export const UnderlineIcon = () => (
  <svg
    width="14px"
    height="14px"
    viewBox="0 0 20 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Dribbble-Light-Preview" transform="translate(-420.000000, -5199.000000)" className="fill-elDark dark:fill-edWhite">
        <g id="icons" transform="translate(56.000000, 160.000000)">
          <path
            d="M364,5059 L384,5059 L384,5057 L364,5057 L364,5059 Z M366,5046 L366,5039 L368,5039 L368,5046 C368,5055.333 380,5055.333 380,5046 L380,5039 L382,5039 L382,5046 C382,5058 366,5058 366,5046 L366,5046 Z"
            id="underline-[#669]"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
  </svg>
);
export const MicIconListening = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" className="bi bi-mic-fill" viewBox="0 0 16 16">
    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
  </svg>
);