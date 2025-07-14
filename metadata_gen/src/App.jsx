
import React, { useState } from 'react';
import { Sparkles, FileText, Key, Download, Loader2, Image as ImageIcon, Globe } from 'lucide-react';

// Text content based on selected language for AI output
const textContent = { ... }; // [Truncated for brevity, use full content from user]

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generatedMetadata, setGeneratedMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [outputLanguage, setOutputLanguage] = useState('id');

  const uiText = textContent.id;

  // ... [All the functions and UI rendering, unchanged]
}

export default App;
