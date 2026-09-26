# Bharatvarsha — Vercel-ready build

This build keeps the React/Vite frontend and the Node/Express AI backend in one repository and one Vercel project.

## Architecture

- React + Vite frontend
- React Router routes: `/`, `/map`, `/map/:state`, `/ai-guide`, `/about`
- Interactive India GeoJSON map at `/public/india-states.json`
- Node.js + Express API exposed under `/api/*`
- Structured cultural data in `src/data/states.json`
- Groq chat API from the server only
- Default Groq model: `openai/gpt-oss-20b`
- Browser Speech Recognition for voice input
- Browser SpeechSynthesis for voice output
- Optional backend Whisper transcription endpoint at `/api/voiceroute/chat`

## AI request flow

React AI Guide → `POST /api/ai/chat` → Express route → AI controller → state data → AI service → Groq → response → React.

The Groq key is never placed in frontend code. Put it in Vercel Environment Variables as `GROQ_API_KEY`.

## Local development

1. Copy `.env.example` to `.env`.
2. Add your Groq key.
3. Install dependencies with `npm install`.
4. Run the backend in one terminal: `npm run server`.
5. Run Vite in another terminal: `npm run dev`.
6. Open the Vite URL shown in the terminal.

During local development the AI frontend automatically uses `http://localhost:5000` for the API. In production it uses the same-origin `/api` path.

## Vercel

Import the repository as one Vercel project.

- Framework: Vite (or Other if Vercel does not detect it automatically)
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Environment variable: `GROQ_API_KEY` for Production, Preview and Development as needed
- Do not set `VITE_API_URL` for the Vercel deployment.

`vercel.json` sends only non-API routes to `index.html`, so React Router can handle deep links without stealing `/api/*` requests from the serverless Express function.

## Quick checks after deployment

- `/` → homepage
- `/map` → interactive map
- click a state → `/map/<state-slug>`
- `/ai-guide` → AI Guide
- `/about` → About page
- `/api/health` → `{ "status": "ok" }`
- `/api/states` → state list

If `/api/health` works but AI does not, check the `GROQ_API_KEY` environment variable and redeploy after adding/changing it.
