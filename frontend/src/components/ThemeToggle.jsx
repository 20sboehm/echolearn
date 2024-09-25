import React from 'react';
import { useTheme } from '../hooks';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='flex flex-col gap-1 items-center'>
      <div
        onClick={toggleTheme}
        className="flex items-center w-12 h-6 rounded-full bg-elGray dark:bg-edDarkGray cursor-pointer p-1 transition-colors duration-300"
      >
        {/* Ball that moves left or right */}
        <div
          className={`w-4 h-4 bg-elDarkGray dark:bg-white rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;