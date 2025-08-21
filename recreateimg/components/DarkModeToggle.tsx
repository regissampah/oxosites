
import React from 'react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 z-50 shadow-md flex items-center justify-center"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <i className="fas fa-sun text-yellow-400 text-xl"></i>
      ) : (
        <i className="fas fa-moon text-blue-800 text-xl"></i>
      )}
    </button>
  );
};

export default DarkModeToggle;
