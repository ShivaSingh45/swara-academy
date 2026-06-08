import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import {GoogleGenAI} from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Serve static assets from the dist folder
const distPath = path.resolve('dist');
app.use(express.static(distPath));

// Endpoint for Swara AI
app.post('/api/chat', async (req, res) => {
  try {
    const { message, systemInstruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY is not defined on the server side. Please configure it in your Secrets tab.' 
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction || 'You are Swara AI, a smart helper.'
      }
    });

    return res.status(200).json({ text: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'Error occurred during generation' });
  }
});

// Fallback for SPA routing: send index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Swara Academy Server is running in production mode on port ${PORT}`);
});
