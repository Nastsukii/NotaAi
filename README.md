# NotaAi Next MVP

- Next.js 16 + React 19 + Framer Motion 12
- App Router, SSR where beneficial, API routes
- AI integration via server-side route using `AI_API_KEY`

## Setup
- `npm install`
- Crie `.env.local` (não versionar):
  - `AI_PROVIDER=gemini`
  - `GEMINI_API_KEY=...` (chave da Gemini API — Google Generative Language)
  - Opcional: `OPENAI_API_KEY=...` e `OPENAI_MODEL=gpt-4o-mini` se usar OpenAI (`AI_PROVIDER=openai`)
- `npm run dev`

## Improvements beyond MVP
- Accessible focus states, responsive grid, animation variants consolidation.
