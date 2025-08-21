import React, { useState, useCallback } from 'react';
import { generatePromptFromImage, generateImageFromPrompt, validateApiKey } from './services/geminiService';
import type { ImageDimensions } from './types';
import { useDarkMode } from './hooks/useDarkMode';
import ApiKeyInput from './components/ApiKeyInput';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import StatusBar from './components/StatusBar';
import DarkModeToggle from './components/DarkModeToggle';
import ApiKeyManager from './components/ApiKeyManager';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('geminiApiKey') || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>('');
  const [generatedImageSrc, setGeneratedImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [originalImageDimensions, setOriginalImageDimensions] = useState<ImageDimensions | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isKeyValidating, setIsKeyValidating] = useState<boolean>(false);

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleApiKeySubmit = async (key: string) => {
    if (!key.trim()) {
      setError('Kunci API tidak boleh kosong.');
      return;
    }
    const trimmedKey = key.trim();
    setIsKeyValidating(true);
    setError('');
    setStatusMessage('Memvalidasi Kunci API...');
    
    const isValid = await validateApiKey(trimmedKey);

    setIsKeyValidating(false);
    if (isValid) {
      setApiKey(trimmedKey);
      localStorage.setItem('geminiApiKey', trimmedKey);
      setStatusMessage('Kunci API berhasil disimpan!');
      // Hapus pesan setelah beberapa detik
      setTimeout(() => setStatusMessage(''), 3000);
    } else {
      setError('Kunci API tidak valid. Silakan periksa kunci Anda dan coba lagi.');
      setStatusMessage('');
    }
  };
  
  const handleApiKeyClear = () => {
      setApiKey('');
      localStorage.removeItem('geminiApiKey');
      // Reset state untuk awal yang baru
      setImageFile(null);
      setUploadedImagePreview('');
      setGeneratedImageSrc('');
      setStatusMessage('');
      setError('Kunci API telah dihapus. Silakan masukkan yang baru untuk melanjutkan.');
      setProgress(0);
      setGeneratedPrompt('');
  };

  const handleImageUpload = (file: File) => {
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setUploadedImagePreview(previewUrl);
      setGeneratedImageSrc('');
      setError('');
      setStatusMessage('');
      setProgress(0);
      setGeneratedPrompt('');
      getOriginalImageDimensions(previewUrl);
    }
  };

  const getOriginalImageDimensions = (src: string) => {
    const img = new Image();
    img.onload = () => {
      setOriginalImageDimensions({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      console.warn("Tidak dapat memuat gambar untuk mendapatkan dimensi.");
      setOriginalImageDimensions(null);
    };
    img.src = src;
  };

  const recreateImage = useCallback(async () => {
    if (!imageFile) {
      setError('Silakan unggah gambar untuk memulai.');
      return;
    }
    if (!apiKey) {
      setError('Silakan masukkan Kunci API Gemini Anda untuk melanjutkan.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Memulai proses...');
    setProgress(0);
    setError('');
    setGeneratedImageSrc('');
    setGeneratedPrompt('');

    try {
      setStatusMessage('Menganalisis gambar dan membuat prompt...');
      setProgress(25);
      const prompt = await generatePromptFromImage(apiKey, imageFile);
      setGeneratedPrompt(prompt);
      console.log("Generated Prompt:", prompt);
      
      setStatusMessage('Membuat ulang gambar dari prompt...');
      setProgress(65);
      const base64Data = await generateImageFromPrompt(apiKey, prompt);

      setGeneratedImageSrc(`data:image/png;base64,${base64Data}`);
      setStatusMessage('Gambar berhasil dibuat ulang!');
      setProgress(100);

    } catch (err) {
      console.error("Kesalahan saat pembuatan ulang gambar:", err);
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
      setError(`Operasi gagal: ${errorMessage}. Silakan periksa kunci API Anda dan coba lagi.`);
      setStatusMessage('');
      setProgress(0);
      setGeneratedImageSrc('');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, apiKey]);

  const downloadImage = () => {
    if (generatedImageSrc && generatedPrompt) {
      const date = new Date();
      const timestamp = date.toISOString().replace(/[-:.]/g, "").slice(0, -4);
      const promptWords = generatedPrompt.split(' ').slice(0, 5).join('_');
      const sanitizedPrompt = promptWords.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 30);
      const filename = `recreated_${sanitizedPrompt}_${timestamp}.png`;
      
      const link = document.createElement('a');
      link.href = generatedImageSrc;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setError('Tidak ada gambar yang dihasilkan untuk diunduh.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container mx-auto p-4 py-8 md:py-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extralight mb-2">AI Image Replicator</h1>
          <p className="text-md md:text-lg text-gray-500 dark:text-gray-400">Unggah gambar dan saksikan AI menciptakannya kembali dari awal.</p>
        </header>

        <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-4xl mx-auto transition-colors duration-300">
          {!apiKey ? (
            <>
              <ApiKeyInput onSubmit={handleApiKeySubmit} isSubmitting={isKeyValidating} />
              <StatusBar isLoading={isKeyValidating} statusMessage={statusMessage} error={error} />
            </>
          ) : (
            <div>
              <ApiKeyManager apiKey={apiKey} onClear={handleApiKeyClear} />

              <ImageUploader onImageUpload={handleImageUpload} onRecreate={recreateImage} isLoading={isLoading} isImageUploaded={!!imageFile} />

              <StatusBar isLoading={isLoading} statusMessage={statusMessage} progress={progress} error={error} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {uploadedImagePreview && (
                  <ImagePreview
                    title="Gambar Asli"
                    src={uploadedImagePreview}
                    dimensions={originalImageDimensions}
                  />
                )}
                {generatedImageSrc && (
                  <ImagePreview
                    title="Gambar Dibuat Ulang"
                    src={generatedImageSrc}
                    note="AI akan mencoba rasio 16:9, tetapi hasilnya mungkin bervariasi."
                  />
                )}
              </div>

              {generatedImageSrc && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={downloadImage}
                    className="flex items-center justify-center px-6 py-3 rounded-lg bg-green-600 text-white font-semibold transition-transform duration-200 hover:bg-green-700 active:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 dark:active:bg-green-500 transform hover:scale-105"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Unduh Gambar
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
