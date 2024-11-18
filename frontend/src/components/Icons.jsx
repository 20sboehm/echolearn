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
      // className="icon flat-line stroke-elDark"
      className="icon flat-line stroke-elDark dark:stroke-edWhite"
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
      className="icon flat-line fill-elDark dark:fill-edWhite"
    >
      <g>
        {/* Outer white glow */}
        {/* <path
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
        /> */}
        <path d="M59.998,28.001h-7.999c-2.211,0-4,1.789-4,4s1.789,4,4,4h7.999c2.211,0,4-1.789,4-4 S62.209,28.001,59.998,28.001z" />
        <path d="M49.71,19.466l6.929-4c1.914-1.105,2.57-3.551,1.461-5.465c-1.102-1.914-3.547-2.57-5.46-1.465l-6.93,4 c-1.914,1.105-2.57,3.551-1.461,5.464C45.351,19.915,47.796,20.571,49.71,19.466z" />
        <path d="M56.639,48.535l-6.929-3.999c-1.914-1.105-4.355-0.449-5.461,1.464c-1.105,1.914-0.453,4.359,1.461,5.465 l6.93,4c1.913,1.105,4.358,0.449,5.464-1.465S58.553,49.641,56.639,48.535z" />
        <path d="M37.53,0.307c-1.492-0.625-3.211-0.277-4.359,0.867L18.343,16.001H4c-2.211,0-4,1.789-4,4v24 C0,46.211,1.789,48,4,48h14.343l14.828,14.828C33.937,63.594,34.96,64,35.999,64c0.516,0,1.035-0.098,1.531-0.305 c1.496-0.617,2.469-2.078,2.469-3.695V4.001C39.999,2.384,39.026,0.924,37.53,0.307z" />
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

export const HeartIcon = ({ isFilled = false, className }) => (
  <svg
    aria-hidden="true"
    height="16px"
    width="16px"
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {isFilled ? (
      <path
        fill="red"  // Filled color
        className="stroke-none"
        d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
      />
    ) : (
      <path
        className="stroke-elDark dark:stroke-edWhite"
        d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);


export default HeartIcon;


export const EditIcon = () => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="edit-icon stroke-elDark dark:stroke-edWhite"
  >
    <g id="Complete">
      <g id="edit">
        <g>
          {/* Outer white glow path */}
          {/* <path
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
          /> */}

          {/* Inner black paths */}
          <path
            d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <polygon
            fill="none"
            points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
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
  <svg width="18px" height="18px" viewBox="2 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-elDark dark:stroke-edWhite">
    <g id="Edit / Bold">
      <path id="Vector" d="M8 12H12.5M8 12V5H12.5C14.433 5 16 6.567 16 8.5C16 10.433 14.433 12 12.5 12M8 12V19H13.5C15.433 19 17 17.433 17 15.5C17 13.567 15.433 12 13.5 12H12.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const ItalicIcon = () => (
  <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-elDark dark:stroke-edWhite">
    <path d="M10 3H20M4 21H14M15 3L9 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UnderlineIcon = () => (
  <svg
    width="18px"
    height="18px"
    viewBox="0 -1 22 22"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
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

export const CodeIcon = () => (
  <svg width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="fill-elDark dark:fill-edWhite">
    <path d="M8.01005 0.858582L6.01005 14.8586L7.98995 15.1414L9.98995 1.14142L8.01005 0.858582Z" />
    <path d="M12.5 11.5L11.0858 10.0858L13.1716 8L11.0858 5.91422L12.5 4.5L16 8L12.5 11.5Z" />
    <path d="M2.82843 8L4.91421 10.0858L3.5 11.5L0 8L3.5 4.5L4.91421 5.91422L2.82843 8Z" />
  </svg>
);

export const CodeBlockIcon = () => (
  <svg width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="fill-elDark dark:fill-edWhite">
    <path fillRule="evenodd" clipRule="evenodd" d="M15 1H1V15H15V1ZM6 5L7.41421 6.41421L5.82843 8L7.41421 9.58579L6 11L3 8L6 5ZM10 5L8.58579 6.41421L10.1716 8L8.58579 9.58579L10 11L13 8L10 5Z" />
  </svg>
);

export const HeaderIcon1 = () => (
  <svg className="fill-elDark dark:fill-edWhite" width="18px" height="18px" viewBox="-2 -2 15 15" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin"><path d='M2 4h4V1a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V6H2v3a1 1 0 1 1-2 0V1a1 1 0 1 1 2 0v3zm9.52.779H10V3h3.36v7h-1.84V4.779z' /></svg>
);

export const HeaderIcon2 = () => (
  <svg className="fill-elDark dark:fill-edWhite" width="18px" height="18px" viewBox="-0 -2 15 15" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" ><path d='M2 4h4V1a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V6H2v3a1 1 0 1 1-2 0V1a1 1 0 1 1 2 0v3zm12.88 4.352V10H10V8.986l.1-.246 1.785-1.913c.43-.435.793-.77.923-1.011.124-.23.182-.427.182-.587 0-.14-.04-.242-.127-.327a.469.469 0 0 0-.351-.127.443.443 0 0 0-.355.158c-.105.117-.165.288-.173.525l-.012.338h-1.824l.016-.366c.034-.735.272-1.33.718-1.77.446-.44 1.02-.66 1.703-.66.424 0 .805.091 1.14.275.336.186.606.455.806.8.198.343.3.7.3 1.063 0 .416-.23.849-.456 1.307-.222.45-.534.876-1.064 1.555l-.116.123-.254.229h1.938z' /></svg>
);

export const HeaderIcon3 = () => (
  <svg className="fill-elDark dark:fill-edWhite" width="18px" height="18px" viewBox="-0 -2 15 15" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" ><path d='M2 4h4V1a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V6H2v3a1 1 0 1 1-2 0V1a1 1 0 1 1 2 0v3zm12.453 2.513l.043.055c.254.334.38.728.38 1.172 0 .637-.239 1.187-.707 1.628-.466.439-1.06.658-1.763.658-.671 0-1.235-.209-1.671-.627-.436-.418-.673-.983-.713-1.676L10 7.353h1.803l.047.295c.038.238.112.397.215.49.1.091.23.137.402.137a.566.566 0 0 0 .422-.159.5.5 0 0 0 .158-.38c0-.163-.067-.295-.224-.419-.17-.134-.438-.21-.815-.215l-.345-.004v-1.17l.345-.004c.377-.004.646-.08.815-.215.157-.124.224-.255.224-.418a.5.5 0 0 0-.158-.381.566.566 0 0 0-.422-.159.568.568 0 0 0-.402.138c-.103.092-.177.251-.215.489l-.047.295H10l.022-.37c.04-.693.277-1.258.713-1.675.436-.419 1-.628 1.67-.628.704 0 1.298.22 1.764.658.468.441.708.991.708 1.629a1.892 1.892 0 0 1-.424 1.226z' /></svg>
);

export const HeaderIcon4 = () => (
  <svg className="fill-elDark dark:fill-edWhite" width="18px" height="18px" viewBox="-0 -2 15 15" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" ><path d='M2 4h4V1a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V6H2v3a1 1 0 1 1-2 0V1a1 1 0 1 1 2 0v3zm10.636 4.74H10V7.302l.06-.198 2.714-4.11h1.687v3.952h.538V8.74h-.538V10h-1.825V8.74zm.154-1.283V5.774l-1.1 1.683h1.1z' /></svg>
);

export const PageBreakIcon = () => (
  <svg width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="fill-elDark dark:fill-edWhite">
    <path d="M2.5 12C2.5 11.5858 2.83579 11.25 3.25 11.25H4.75C5.16421 11.25 5.5 11.5858 5.5 12C5.5 12.4142 5.16421 12.75 4.75 12.75H3.25C2.83579 12.75 2.5 12.4142 2.5 12Z" />
    <path d="M6.5 12C6.5 11.5858 6.83579 11.25 7.25 11.25H8.75C9.16421 11.25 9.5 11.5858 9.5 12C9.5 12.4142 9.16421 12.75 8.75 12.75H7.25C6.83579 12.75 6.5 12.4142 6.5 12Z" />
    <path d="M10.5 12C10.5 11.5858 10.8358 11.25 11.25 11.25H12.75C13.1642 11.25 13.5 11.5858 13.5 12C13.5 12.4142 13.1642 12.75 12.75 12.75H11.25C10.8358 12.75 10.5 12.4142 10.5 12Z" />
    <path d="M14.5 12C14.5 11.5858 14.8358 11.25 15.25 11.25H16.75C17.1642 11.25 17.5 11.5858 17.5 12C17.5 12.4142 17.1642 12.75 16.75 12.75H15.25C14.8358 12.75 14.5 12.4142 14.5 12Z" />
    <path d="M18.5 12C18.5 11.5858 18.8358 11.25 19.25 11.25H20.75C21.1642 11.25 21.5 11.5858 21.5 12C21.5 12.4142 21.1642 12.75 20.75 12.75H19.25C18.8358 12.75 18.5 12.4142 18.5 12Z" />
    <path d="M5 2C4.44772 2 4 2.44772 4 3V7C4 8.104 4.896 9 6 9H18C19.104 9 20 8.104 20 7V3C20 2.44772 19.5523 2 19 2H5Z" />
    <path d="M19 22C19.5523 22 20 21.5523 20 21V17C20 15.896 19.104 15 18 15L6 15C4.896 15 4 15.896 4 17L4 21C4 21.5523 4.44772 22 5 22L19 22Z" />
  </svg>
);

export const ImageLinkIcon = () => (
  <svg height="18px" width="18px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="fill-elDark dark:fill-edWhite"
    viewBox="0 0 512 512" xmlSpace="preserve">
    <g>
      <path className="st0" d="M378.413,0H208.297h-13.168l-9.314,9.314L57.02,138.102l-9.314,9.314v13.176v265.514
		c0,47.36,38.527,85.895,85.895,85.895h244.812c47.353,0,85.881-38.535,85.881-85.895V85.896C464.294,38.528,425.766,0,378.413,0z
		 M432.497,426.105c0,29.877-24.214,54.091-54.084,54.091H133.601c-29.87,0-54.084-24.214-54.084-54.091V160.591h83.717
		c24.884,0,45.063-20.178,45.063-45.07V31.804h170.116c29.87,0,54.084,24.214,54.084,54.092V426.105z"/>
      <path className="st0" d="M162.94,251.968c-5.851,0-10.054,4.21-10.054,10.592v72.804c0,6.388,4.203,10.599,10.054,10.599
		c5.698,0,9.915-4.21,9.915-10.599V262.56C172.855,256.178,168.638,251.968,162.94,251.968z"/>
      <path className="st0" d="M265.621,251.968c-5.977,0-9.244,3.261-12.219,10.326l-19.299,44.547h-0.545l-19.69-44.547
		c-3.114-7.066-6.382-10.326-12.358-10.326c-6.647,0-11.004,4.622-11.004,11.954v72.398c0,6.109,3.812,9.643,9.245,9.643
		c5.153,0,8.965-3.534,8.965-9.643v-44.554h0.67l14.398,33.138c2.848,6.522,5.167,8.428,9.775,8.428
		c4.622,0,6.926-1.906,9.789-8.428l14.258-33.138h0.684v44.554c0,6.109,3.658,9.643,9.091,9.643c5.432,0,9.105-3.534,9.105-9.643
		v-72.398C276.486,256.59,272.269,251.968,265.621,251.968z"/>
      <path className="st0" d="M356.363,293.806h-19.02c-5.153,0-8.42,3.121-8.42,7.876c0,4.755,3.268,7.876,8.42,7.876h6.256
		c0.545,0,0.81,0.272,0.81,0.816c0,3.533-0.266,6.654-1.089,9.098c-1.9,5.844-7.737,9.51-14.803,9.51
		c-8.015,0-13.043-3.938-15.068-10.187c-1.089-3.393-1.494-7.876-1.494-19.83c0-11.953,0.406-16.296,1.494-19.696
		c2.025-6.382,6.927-10.32,14.802-10.32c5.977,0,10.459,1.899,13.993,6.786c2.709,3.805,5.432,4.895,8.825,4.895
		c5.028,0,9.091-3.666,9.091-8.965c0-2.171-0.67-4.078-1.76-5.977c-4.888-8.287-15.207-14.397-30.149-14.397
		c-16.436,0-29.199,7.471-33.962,22.412c-2.038,6.515-2.583,11.682-2.583,25.262c0,13.581,0.545,18.74,2.583,25.262
		c4.762,14.942,17.526,22.413,33.962,22.413c16.436,0,28.921-8.288,33.683-23.09c1.634-5.16,2.304-12.77,2.304-20.919v-0.95
		C364.238,296.654,361.39,293.806,356.363,293.806z"/>
    </g>
  </svg>
);

export const VideoLinkIcon = () => (
  <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="fill-elDark dark:fill-edWhite">
    <path fillRule="evenodd" clipRule="evenodd" d="M16 2H0V14H16V2ZM6.5 5V11H7.5L11 8L7.5 5H6.5Z" />
  </svg>
);

export const LinkIcon = () => (
  <svg width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="stroke-elDark dark:stroke-edWhite" fill="none">
    <path d="M14 12C14 14.7614 11.7614 17 9 17H7C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7H7.5M10 12C10 9.23858 12.2386 7 15 7H17C19.7614 7 22 9.23858 22 12C22 14.7614 19.7614 17 17 17H16.5" strokeWidth="2" strokeLinecap="round" />
  </svg >
);

export const TableIcon = () => (
  <svg width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="stroke-elDark dark:stroke-edWhite" aria-labelledby="tableHorizontalIconTitle" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#000000"> <title id="tableHorizontalIconTitle">Data table</title> <path d="M22 4V19H2L2 4L22 4Z" /> <line x1="22" y1="9" x2="2" y2="9" /> <line x1="22" y1="14" x2="2" y2="14" /> <path d="M12 19L12 4" /> </svg>
);

export const LatexIcon = () => (
  <svg width="18px" height="18px" viewBox="0 -3 24 24" xmlns="http://www.w3.org/2000/svg" className="fill-elDark dark:fill-edWhite">
    <path d="M14 16.5c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5 0-.293.095-.566.25-.814.443-.707.855-1.433 1.272-2.157l1.38-2.405c.364-.636.73-1.27 1.088-1.91.02-.038.256-.385.23-.425l-.443-.72-1.045-1.697-1.22-1.986-.84-1.36c-.246-.4-.578-.815-.65-1.292-.05-.338.01-.695.185-.992C4.49.258 5.02-.003 5.572 0H13c.55 0 1 .45 1 1s-.45 1-1 1H7.57l.59.983c.415.693.83 1.387 1.247 2.08l1.13 1.887c.197.33.472.673.454 1.074-.01.27-.13.517-.273.74-.35.55-.672 1.12-1.004 1.68L8.275 12.87l-1.092 1.84c-.016.025-.142.29-.173.29h5.49c.83 0 1.5.67 1.5 1.5z" />
    <path d="M4.83 11.55c-.19.29-.51.45-.83.45-.19 0-.38-.05-.55-.17l-3-2c-.01-.01-.02-.01-.02-.02-.1-.06-.19-.15-.26-.26-.31-.45-.18-1.08.28-1.38l3-2c.45-.31 1.07-.18 1.382.28.31.45.18 1.08-.28 1.38L2.8 9l1.75 1.17c.46.3.59.92.28 1.38zM13.17 11.55c.19.29.51.45.83.45.19 0 .38-.05.55-.17l3-2c.01-.01.02-.01.02-.02.1-.06.19-.15.26-.26.31-.45.18-1.08-.28-1.38l-3-2c-.45-.31-1.07-.18-1.382.28-.31.45-.18 1.08.28 1.38L15.198 9l-1.75 1.17c-.46.3-.59.92-.28 1.38z" />
  </svg>
);

export const LatexBlockIcon = () => (
  <svg width="18px" height="18px" viewBox="0 -3 24 24" xmlns="http://www.w3.org/2000/svg" className="fill-elDark dark:fill-edWhite">
    <path d="M18 16.5c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5 0-.293.095-.566.25-.814.443-.707.855-1.433 1.272-2.157l1.38-2.405c.364-.636.73-1.27 1.088-1.91.02-.038.256-.385.23-.425l-.443-.72-1.045-1.697L9.51 4.388l-.838-1.36c-.247-.4-.58-.815-.65-1.292-.05-.34.01-.696.185-.993C8.49.258 9.02-.003 9.572 0H17c.55 0 1 .45 1 1s-.45 1-1 1h-5.43l.59.983c.415.694.83 1.387 1.247 2.08l1.13 1.887c.197.33.472.673.454 1.074-.01.27-.13.517-.273.74-.35.55-.672 1.12-1.004 1.68l-1.438 2.425-1.092 1.84c-.016.025-.142.29-.173.29h5.49c.83 0 1.5.67 1.5 1.5zM1 18c-.08 0-.16-.01-.243-.03-.536-.134-.86-.677-.728-1.212l4-16c.134-.536.678-.862 1.213-.728s.86.677.727 1.213l-4 16c-.114.454-.52.757-.97.757z" />
  </svg>
);

export const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
  </svg>
);

export const MicIconListening = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="grey" className="bi bi-mic-fill" viewBox="0 0 16 16">
    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
  </svg>
);

export const LinkUploadedImage = () => (
  <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 14.5L14.5 15.5M14 12.5C14 13.8807 12.8807 15 11.5 15C10.1193 15 9 13.8807 9 12.5C9 11.1193 10.1193 10 11.5 10C12.8807 10 14 11.1193 14 12.5ZM8.4 19C5.41766 19 3 16.6044 3 13.6493C3 11.2001 4.8 8.9375 7.5 8.5C8.34694 6.48637 10.3514 5 12.6893 5C15.684 5 18.1317 7.32251 18.3 10.25C19.8893 10.9449 21 12.6503 21 14.4969C21 16.9839 18.9853 19 16.5 19L8.4 19Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --------------------------------------------------
// ------------------ Images Page -------------------
// --------------------------------------------------

export const UploadIcon = ({ className }) => (
  <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`stroke-white ${className}`}>
    <path d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const DeleteIcon = ({ className }) => (
  <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12V17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 12V17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 7H20" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const DownloadIcon = ({ className }) => (
  <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CopyIcon = ({ className }) => (
  < svg width="18px" height="18px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" >
    <path fill="#fff" fillRule="evenodd" d="M4 2a2 2 0 00-2 2v9a2 2 0 002 2h2v2a2 2 0 002 2h9a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2H4zm9 4V4H4v9h2V8a2 2 0 012-2h5zM8 8h9v9H8V8z" />
  </svg >
)

export const DragIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2 9.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zm1-1a1 1 0 110 2 1 1 0 010-2zm2 1a.5.5 0 11-1 0 .5.5 0 011 0zm-3-4a.5.5 0 11-1 0 .5.5 0 011 0zm4-1a1 1 0 110 2 1 1 0 010-2zm3 1a.5.5 0 11-1 0 .5.5 0 011 0zm-4 4a.5.5 0 11-1 0 .5.5 0 011 0zm3-1a1 1 0 110 2 1 1 0 010-2zm3 1a.5.5 0 11-1 0 .5.5 0 011 0zM2 5.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zm1-1a1 1 0 110 2 1 1 0 010-2zm2 1a.5.5 0 11-1 0 .5.5 0 011 0zm-3-4a.5.5 0 11-1 0 .5.5 0 011 0zm4-1a1 1 0 110 2 1 1 0 010-2zm3 1a.5.5 0 11-1 0 .5.5 0 011 0zm-4 4a.5.5 0 11-1 0 .5.5 0 011 0zm3-1a1 1 0 110 2 1 1 0 010-2zm3 1a.5.5 0 11-1 0 .5.5 0 011 0z" />
  </svg>

)

// -------------------------------------------
// ------------------ Misc -------------------
// -------------------------------------------

export const QuestionMarkIcon = ({ className }) => (
  <svg width="16px" height="16px" viewBox="0 0 12 12" enableBackground="new 0 0 12 12" id="questionMarkIcon" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><path d="M6,0C2.6862793,0,0,2.6862793,0,6s2.6862793,6,6,6s6-2.6862793,6-6S9.3137207,0,6,0z M6.5,9.5h-1v-1h1V9.5z   M7.2651367,6.1738281C6.7329102,6.5068359,6.5,6.6845703,6.5,7v0.5h-1V7c0-0.9023438,0.7138672-1.3486328,1.2348633-1.6738281  C7.2670898,4.9931641,7.5,4.8154297,7.5,4.5c0-0.5517578-0.4487305-1-1-1h-1c-0.5512695,0-1,0.4482422-1,1V5h-1V4.5  c0-1.1025391,0.8969727-2,2-2h1c1.1030273,0,2,0.8974609,2,2C8.5,5.4023438,7.7861328,5.8486328,7.2651367,6.1738281z"
    fill="#fff" className={`${className}`} /></svg>
)

// fill="#1D1D1B"
