import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import {GoogleGenAI} from '@google/genai';
import {createServer as createViteServer} from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

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

      // Implement self-healing failover mechanism for high availability
      const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-latest'];
      let response;
      let lastError = null;

      for (const model of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: message,
            config: {
              systemInstruction: systemInstruction || 'You are Swara AI, a smart helper.'
            }
          });
          if (response) break;
        } catch (err: any) {
          console.warn(`Model ${model} failed, attempting failover...`, err.message || err);
          lastError = err;
        }
      }

      if (!response) {
        throw lastError || new Error('All models in the failover pool are currently unavailable');
      }

      return res.status(200).json({ text: response.text || 'No response generated.' });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      return res.status(500).json({ error: error.message || 'Error occurred during generation' });
    }
  });

  // Integrate Vite Dev Server in Non-Production setup or serve compiled assets in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Swara Academy Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer();
