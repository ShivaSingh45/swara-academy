import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {GoogleGenAI} from '@google/genai';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'gemini-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/chat' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              
              req.on('end', async () => {
                try {
                  const parsed = JSON.parse(body || '{}');
                  const apiKey = process.env.GEMINI_API_KEY;
                  if (!apiKey) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                      error: 'GEMINI_API_KEY is missing. Please make sure the API key is configured under Settings > Secrets.' 
                    }));
                    return;
                  }

                  const ai = new GoogleGenAI({
                    apiKey,
                    httpOptions: {
                      headers: {
                        'User-Agent': 'aistudio-build'
                      }
                    }
                  });

                  const systemInstruction = parsed.systemInstruction || 'You are helpful.';
                  const message = parsed.message || 'Hello';

                  const response = await ai.models.generateContent({
                    model: 'gemini-3.5-flash',
                    contents: message,
                    config: {
                      systemInstruction
                    }
                  });

                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ text: response.text || 'No response from Swara AI.' }));
                } catch (err: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: err.message || 'Internal server error processing chatbot request' }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
