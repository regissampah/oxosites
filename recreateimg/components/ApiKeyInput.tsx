import React, { useState } from 'react';

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
  isSubmitting: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit, isSubmitting }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting) {
      onSubmit(key);
    }
  };

  return (
    <div className="text-center max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Masukkan Kunci API Gemini Anda</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Untuk menggunakan aplikasi ini, Anda memerlukan kunci API Google Gemini.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Masukkan Kunci API Anda di sini"
          className="flex-grow px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={!key.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memvalidasi...
            </>
          ) : (
            'Simpan Kunci'
          )}
        </button>
      </form>

      <div className="mt-8 text-left p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300">Cara mendapatkan Kunci API Anda:</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Pergi ke <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>.</li>
          <li>Klik "Buat kunci API di proyek baru".</li>
          <li>Salin kunci API yang dihasilkan dan tempelkan di atas.</li>
        </ol>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
          Kunci API Anda hanya disimpan di browser Anda dan tidak pernah dikirim ke server kami.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;
