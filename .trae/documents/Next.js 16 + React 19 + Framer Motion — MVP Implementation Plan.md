## Context & Constraints
- You asked to read `c:\Users\Cliente\Desktop\import React, { useState, useRef, u.txt` (MVP layout/specifications). I cannot access files outside the current workspace path. To ensure strict layout fidelity, please copy the MVP file into the project workspace (e.g., `./docs/mvp.txt`) or paste its contents in a future message. I will proceed with a robust implementation plan that anticipates that MVP layout.

## Tech Stack Targets
- Next.js 16 (App Router, Server Components, Server Actions where beneficial)
- React 19 (concurrent features; strict mode; server actions if available)
- Framer Motion v11/12 (page transitions, section reveals, micro-interactions)
- TypeScript, ESLint/Prettier, TailwindCSS (for rapid, responsive layout)

## Security & AI Key Handling
- NEVER hardcode secrets. Integrate the provided API key via environment variables only.
- `AI_API_KEY` stored in `.env.local` and accessed server-side or via API routes. No client-side exposure unless the specific AI API requires it and we can scope it safely.

## Project Structure (Next.js App Router)
- `app/` — routes, layouts, templates
  - `app/(site)/layout.tsx` — global layout/shell with header/footer
  - `app/(site)/page.tsx` — home or landing, builds MVP hero structure
  - `app/(site)/upload/page.tsx` — upload wizard (if MVP includes it)
  - `app/(site)/review/page.tsx` — review UI, fidelity to MVP
  - `app/(site)/generate/page.tsx` — generation/preview UI
  - `app/(site)/components/*` — shared UI components
  - `app/api/*/route.ts` — API routes (AI calls, forms, SSR data fetching)
- `lib/` — utils, API clients, SSR handlers, validation
- `styles/` — global styles (Tailwind + CSS variables)
- `public/` — images, icons
- `motion/` — animation variants and helpers
- `docs/` — MVP specs and improvements documentation

## Routing & SSR Strategy
- Use App Router with layouts and nested segments for clean routing.
- SSR where beneficial:
  - Landing and content pages: static or SSG
  - Data-bound pages (review/generate): SSR + dynamic
- Image optimization: Next.js `Image` component, local and remote patterns defined in `next.config.js`.
- API handlers: `app/api/ai/route.ts` (calls AI using server-side key); `app/api/upload/route.ts`; `app/api/review/route.ts` (if needed by MVP).

## State Management
- React 19 hooks + Server Actions for form mutations where applicable.
- Local state for UI; context for cross-page state (e.g., selected document or template).
- Optional lightweight store (Zustand or Context) if MVP requires multi-page persistence.

## Framer Motion Plan
- Page transitions: fade/slide with layout-aware `AnimatePresence`.
- Section-level reveals: staggered children, viewport triggers.
- Micro-interactions: buttons, hovering cards, accordions.
- Performance: `motion.div` variants reused; reduced re-renders; `will-change`/transform usage.

## AI Integration
- API route `app/api/ai/route.ts` fetches model responses using `process.env.AI_API_KEY`.
- Typed request/response schemas; retries with exponential backoff; error handling.
- If the MVP requires client-side suggestions, expose only scoped endpoints that return processed outputs.

## Layout Fidelity Workflow
- Import MVP layout specs into `docs/mvp.txt`.
- Create UI screens based on the MVP’s wireframes/sections:
  - Header/Nav, Hero, Feature Blocks, Forms/Upload, Review Panels, Generation Preview, Footer.
- Implement exact spacing, typography, colors, grids specified; use CSS vars + Tailwind tokens.
- Add optional UX improvements: accessible focus states, motion cues, skeleton loaders.

## Pages & Components (Representative)
- `Header.tsx` (sticky, shadow on scroll)
- `Hero.tsx` (animated entrance; CTA)
- `UploadForm.tsx` (drag-and-drop; validation)
- `ReviewPanel.tsx` (editor; diff preview if MVP mentions)
- `GeneratePreview.tsx` (document/template preview; action buttons)
- `MotionSection.tsx` (wrapper with variants)
- `Footer.tsx`

## Animations (Variants)
- `motion/variants.ts` defines:
  - `page`: `{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } }`
  - `staggerContainer`: uses `staggerChildren` for list reveals
  - `fadeInUp`: single-item variant
- Smoothness: low `duration`, `ease` presets; lazyMotion if needed.

## Example API Route (AI)
- `/app/api/ai/route.ts`:
  - `POST` expects `{ prompt: string }`
  - Validates input; uses `fetch` to provider or server-side SDK with `AI_API_KEY` env
  - Returns `{ output: string, usage: {...} }`

## Example Server Action (if supported)
- In `app/(site)/upload/page.tsx`, use server action to process uploads (or fallback to API route) and return results.

## Styling & Responsiveness
- TailwindCSS with responsive breakpoints; fluid typography; grid layout
- Accessibility: semantic markup, focus outlines, aria labels
- Theming: CSS variables for colors/spacing

## next.config.js & Env
- Configure image domains; enable experimental React 19 flags if required.
- `.env.local`:
  - `AI_API_KEY=AIzaSyCZhsX7h9PyvLuk6ijgW35E4xuKSKc25K8`
- Never commit `.env.*` files.

## Documentation of Improvements
- `docs/improvements.md` records any visual/UX enhancements beyond MVP: motion cues, accessibility, skeleton loading, error states, microcopy.

## Tasks & Timeline
1. Bootstrap Next.js 16 project (TypeScript, Tailwind, ESLint/Prettier)
2. Create App Router structure and base pages
3. Implement Header/Hero/Sections per MVP layout
4. Build Upload/Review/Generate flows per MVP with SSR/API routes
5. Integrate AI key via server-side route; add typed request/response
6. Add Framer Motion animations and variants; test performance
7. Add responsive/adaptive tweaks; accessibility pass
8. Write documentation for improvements; finalize polishing

## Validation & QA
- Lighthouse (performance, accessibility)
- Unit tests for components; integration tests for API routes
- Visual regression (optional) to ensure MVP fidelity

## Delivery
- Complete Next.js project repository
- Responsive design across breakpoints
- Documentation of improvements
- Clean, maintainable React 19 code with best practices

## Next Step
- Once the MVP file is accessible in the workspace, I will map each screen/section 1:1 and finalize pixel-perfect fidelity. I’m ready to start implementing immediately after your confirmation of this plan.