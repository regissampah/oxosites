import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  if (!apiKey.trim()) {
    return false;
  }
  // Gunakan panggilan REST API langsung untuk validasi yang lebih andal,
  // menghindari fallback SDK ke variabel lingkungan.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Gunakan payload minimal untuk validasi
        contents: [{ parts: [{ text: 'hello' }] }],
      }),
    });

    if (response.ok) {
      return true; // Kunci valid jika responsnya 200 OK.
    } else {
      // Tangkap dan log pesan kesalahan dari API jika memungkinkan
      const errorData = await response.json().catch(() => ({}));
      console.error(`Validasi Kunci API gagal dengan status ${response.status}:`, errorData.error?.message || response.statusText);
      return false; // Kunci tidak valid untuk status kesalahan apa pun (4xx, 5xx).
    }
  } catch (error) {
    console.error("Kesalahan Jaringan selama Validasi Kunci API:", error);
    // Kembalikan false jika ada kesalahan jaringan.
    return false;
  }
};

export const generatePromptFromImage = async (apiKey: string, imageFile: File): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.5-flash';

  const visionPrompt = `Jelaskan gambar ini dengan sangat detail. Fokus pada semua objek utama, elemen latar belakang, warna, pencahayaan, tekstur, dan gaya keseluruhan. Tangkap suasana dan atmosfernya. Berdasarkan deskripsi ini, buat prompt yang ringkas namun sangat deskriptif yang cocok untuk AI generasi gambar canggih untuk menciptakan kembali gambar ini dengan kualitas fotorealistik dan sinematik. Prompt harus secara eksplisit meminta rasio aspek 16:9 dan tampilan layar lebar yang sinematik.`;
  
  const imagePart = await fileToGenerativePart(imageFile);
  const textPart = { text: visionPrompt };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: { parts: [textPart, imagePart] },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gagal menghasilkan prompt dari gambar. Respons AI kosong.');
  }
  return text.trim();
};

export const generateImageFromPrompt = async (apiKey: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  const model = 'imagen-3.0-generate-002';

  const response = await ai.models.generateImages({
    model,
    prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '16:9',
    },
  });

  const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
  if (!base64ImageBytes) {
    throw new Error('Gagal menghasilkan gambar. Respons AI tidak berisi data gambar.');
  }

  return base64ImageBytes;
};