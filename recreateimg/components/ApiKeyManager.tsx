
import React from 'react';

interface ApiKeyManagerProps {
  apiKey: string;
  onClear: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKey, onClear }) => {
  // Mask the API key for display, showing first 4 and last 4 characters
  const maskedKey = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between flex-wrap gap-4">
      <div>
        <span className="font-medium text-gray-700 dark:text-gray-300">Current API Key:</span>
        <span className="ml-2 font-mono text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">{maskedKey}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200"
          aria-label="Edit API Key"
        >
          <i className="fas fa-pencil-alt mr-2"></i>
          Edit
        </button>
        <button
          onClick={onClear}
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
          aria-label="Delete API Key"
        >
          <i className="fas fa-trash-alt mr-2"></i>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ApiKeyManager;
