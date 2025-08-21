import React from 'react';

interface StatusBarProps {
  isLoading: boolean;
  statusMessage: string;
  progress?: number;
  error: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ isLoading, statusMessage, progress, error }) => {
  if (!isLoading && !statusMessage && !error) {
    return null;
  }

  return (
    <div className="my-4 text-center">
      {isLoading && (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400 font-medium">{statusMessage}</p>
          {typeof progress === 'number' && (
            <>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{progress}% Selesai</p>
            </>
          )}
        </div>
      )}
      {!isLoading && statusMessage && (
        <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-medium">
          <i className="fas fa-check-circle mr-2"></i>
          {statusMessage}
        </div>
      )}
      {error && (
        <div className="p-3 mt-2 rounded-md bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 font-medium">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}
    </div>
  );
};

export default StatusBar;
