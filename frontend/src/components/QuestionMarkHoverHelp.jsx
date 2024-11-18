import { useState } from "react";
import { createPortal } from 'react-dom';
import { QuestionMarkIcon } from "./Icons";

function QuestionMarkHoverHelp({ title, helpTextList, heightInRem }) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setIsHovered(true);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <QuestionMarkIcon className="w-6 h-6 text-gray-500" />
      {isHovered &&
        // Put the element directly on document.body to avoid overflow constraints / clipping
        createPortal(
          <div className="flex flex-col absolute w-96 p-2 text-sm rounded-lg shadow-2xl z-20 bg-edBlue dark:bg-edDarker dark:border border-edDividerGray"
            style={{ top: tooltipPosition.top - 2, left: tooltipPosition.left - 2, height: `${heightInRem}rem` }}>
            <h2 className="text-center text-edWhite text-2xl border-b-2 pb-2 border-edWhite font-semibold">{title} Tips</h2>
            {helpTextList.map(helpText => {
              return <p className="px-2 py-4 border-b border-white dark:border-edDividerGray text-edWhite text-center whitespace-pre text-wrap">{helpText}</p>;
            })}
            <p className="py-4 text-edWhite text-center">Move your mouse outside of this window to close it.</p>
          </div>,
          document.body
        )
      }
    </div>
  );
}

export default QuestionMarkHoverHelp;