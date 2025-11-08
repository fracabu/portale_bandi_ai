# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Portale Bandi AI** is a React/TypeScript web application that aggregates, structures, and presents Italian public funding opportunities (bandi). It leverages Google's Gemini AI and VAPI for:
1. Parsing unstructured grant data into structured JSON (at app load)
2. AI-powered search with Google Search grounding
3. Real-time voice assistant using VAPI or Gemini Live API with native audio

The app is built with Vite, React 19, and the `@google/genai` SDK.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

**Required API Keys in `.env.local`:**
- `GEMINI_API_KEY` - Required for all AI features (data parsing, search, Gemini Live voice)
- `VAPI_API_KEY` - Optional, for VAPI voice assistant alternative

The Vite config (`vite.config.ts:14-16`) exposes these as:
- `process.env.API_KEY` and `process.env.GEMINI_API_KEY` for Gemini
- `process.env.VAPI_API_KEY` for VAPI

## Architecture

### Data Flow

1. **App Load**: `App.tsx` loads bandi from static JSON file `data/bandi.json`
2. **Static Data**: 17+ curated Italian grants loaded immediately (no API calls)
3. **State Management**: Bandi array stored in React state, filtered client-side via `useMemo`
4. **Filtering**: Multi-dimensional filters (category, type, target, area, text search) defined in `constants.ts`
5. **Manual Refresh**: Refresh button reloads data from static JSON (instant, no fetch)
6. **AI Search**: Optional search via `GeminiSearch` component uses Google Search grounding for web queries
7. **Voice Assistant**: VAPI assistant receives full bandi array for context-aware voice responses

### Key Components

**App.tsx** (main orchestrator)
- Loads and filters bandi data
- Manages filter state
- Renders FilterSidebar + BandoList layout

**services/geminiService.ts** (AI integration layer)
- `generateWithGoogleSearch()`: Text search with Google Search grounding (used by GeminiSearch component)
- `startLiveSession()`: Sets up Gemini Live audio session with Web Audio API (alternative to VAPI)
- Note: `fetchAndParseBandiData()`, `getCachedBandi()`, `saveBandiToCache()`, `clearBandiCache()` are legacy functions no longer used since data is now static

**services/vapiService.ts** (VAPI integration)
- Alternative voice assistant using VAPI SDK (`@vapi-ai/web`)
- `startVapiSession()`: Simpler WebRTC-based voice interface
- Automatically handles audio capture, transcription, and playback

**components/LiveAssistant.tsx** (voice UI)
- Currently uses VAPI for voice interactions (imports from `vapiService.ts`)
- Note: Can be switched to use Gemini Live by changing import to `geminiService.ts`
- Manages call lifecycle (start, stop, error handling)
- Displays conversation transcripts with chat bubbles
- Floating button UI (bottom-right corner) with expandable modal
- Shows speaking indicators and bandi count

**components/GeminiSearch.tsx** (text search UI)
- Modal-based AI search interface
- Displays sources from grounding metadata
- Header search bar triggers modal with AI response

### Type System

**types.ts** defines:
- `Bando`: Complete grant structure with nested `dettagli` object
- `Filters`: Five filter dimensions
- `GroundingChunk`: Google Search source metadata

### Data Model

Each `Bando` includes:
- Metadata: ID, title, provider, category, geography
- Details: target audience, funding info, how to participate
- Metrics: aid intensity (%), max amount (€)
- Dates: opening/closing (ISO format)
- Complexity: 'Bassa' | 'Media' | 'Alta'

### Filter Categories

Defined in `constants.ts`:
- **Categorie Tematiche**: Tech, Environment, Culture, Social, Agriculture, Business
- **Tipologie Intervento**: Grant, Loan, Tax Credit, Guarantee, Training
- **Target Beneficiari**: SMEs, Startups, Third Sector, Youth, Women, Self-employed
- **Aree Geografiche**: National, North, Center, South, and specific regions

## AI Integration Details

### Gemini Models Used

- **Data parsing**: `gemini-2.5-flash` with structured output (`responseMimeType: 'application/json'`)
- **Search**: `gemini-2.5-flash` with `googleSearch` tool
- **Voice (Gemini Live)**: `gemini-2.0-flash-exp` with audio modalities and voice `Puck` (Italian female)

### Schema Validation

`fetchAndParseBandiData()` uses a strict schema (geminiService.ts:55-87) that enforces all required fields. The AI estimates missing values (e.g., aid intensity, opening date) when not present in raw data.

### Audio Processing (Gemini Live)

Live sessions (geminiService.ts:286-541):
- **Input Capture**: 16kHz mono PCM via `ScriptProcessorNode` (4096 sample buffer)
- **Input Encoding**: Float32 → Int16 → Base64
- **Streaming**: Real-time chunks sent via `session.sendRealtimeInput()`
- **Output Playback**: 24kHz PCM via custom `AudioQueue` class for sequential audio chunk playback
- **Output Decoding**: Base64 → Int16 → Float32 → AudioBuffer
- **Transcription**: Both input and output transcripts captured via `turnComplete` events
- **System Instruction**: Dynamically generated with complete bandi data (all 328+ grants) for context-aware responses
- **Cleanup**: Proper resource disposal (audio contexts, streams, processors) on session close

## Project Structure

```
portale_bandi_ai/
├── components/           # React components (no src/ directory)
│   ├── BandoCard.tsx    # Individual grant card display
│   ├── BandoList.tsx    # Grid of grant cards
│   ├── FilterSidebar.tsx # Left sidebar with filters
│   ├── GeminiSearch.tsx  # AI search modal
│   ├── Header.tsx        # Top header with search and refresh
│   └── LiveAssistant.tsx # Voice assistant floating widget
├── services/             # Services at root level
│   ├── geminiService.ts  # Gemini AI integration
│   └── vapiService.ts    # VAPI voice integration
├── data/                 # Static data directory
│   └── bandi.json       # 17+ curated Italian grants (loaded at app startup)
├── App.tsx               # Main app component (root level)
├── types.ts              # TypeScript type definitions
├── constants.ts          # Filter categories and constants
├── index.tsx             # React entry point
├── index.html            # HTML entry with TailwindCSS CDN
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies
├── .env.local            # API keys (not committed)
├── CLAUDE.md             # This file
└── DB.md                 # Comprehensive database of 328+ Italian grants (reference)
```

**Note**: Unlike typical React projects, this uses a flat structure with components/ and services/ at the root level, not inside a src/ directory.

## Component Communication

- **FilterSidebar → App**: Callbacks via `onFilterChange(filterName, value)`
- **Header → App**: `onRefresh` callback clears cache and reloads data
- **GeminiSearch**: Self-contained modal in Header, no parent state
- **LiveAssistant**: Self-contained floating widget, receives `bandi` array as prop for context
- **App → BandoList**: Passes filtered bandi array via props

## Important Implementation Details

### Data Management
- **Static data source**: Bandi loaded from `data/bandi.json` (17+ curated Italian grants from DB.md)
- **No external fetching**: App loads instantly with no API calls at startup
- **Data updates**: To add/update bandi, edit `data/bandi.json` directly (based on comprehensive DB.md database)
- **Manual refresh**: Header refresh button reloads from static JSON (instant)
- **Client-side filtering**: All filtering done in-browser via `useMemo` hook in App.tsx
- **AI Search**: Optional Gemini search still available via search bar for web-based queries

### Technical Constraints
- **No backend server**: All AI calls are direct from browser to Gemini API (API key exposed to client)
- **Microphone permission**: Required for voice assistant (`metadata.json:5`)
- **Triple-slash directives**: `/// <reference types="react" />` used in multiple files to fix JSX type resolution
- **ScriptProcessorNode**: Deprecated but still used for audio capture (consider migrating to AudioWorklet in future)
- **Import maps**: Uses importmap in index.html for React and Gemini SDK (CDN-based, not bundled)

### Voice Assistant Architecture
- **Current implementation**: Uses VAPI (simpler, WebRTC-based)
- **Alternative available**: Gemini Live (more complex, WebSocket + custom audio processing)
- **Switching**: Change imports in `LiveAssistant.tsx` from `vapiService` to `geminiService`
- **Context passing**: Full bandi array (328+ items) passed to assistant for intelligent responses

## Styling

- **Framework**: TailwindCSS loaded via CDN in `index.html:7`
- **Font**: Inter from Google Fonts
- **Approach**: Utility-first classes throughout all components
- **No CSS files**: All styling inline with Tailwind utilities

## Database Reference

### DB.md (Reference Database)
Comprehensive markdown database of 328+ Italian public funding opportunities:
- Complete metadata (title, provider, amounts, deadlines, complexity)
- Geographic coverage (all 20 Italian regions)
- Thematic focus areas (innovation, R&D, green transition, culture, etc.)
- Status tracking (open, closing, closed, recurring)
- Total identified funding: €32+ billion

**Purpose**: Reference document for adding/updating grants. Not directly used by the app.

### data/bandi.json (Active Data)
The actual data file loaded by the app at startup:
- 17+ curated grants from DB.md in structured JSON format
- Each grant follows the `Bando` type schema from `types.ts`
- **To update app data**: Edit this file directly, following the existing structure
- **To add more grants**: Convert entries from DB.md to JSON format matching the schema

The app loads instantly from this static JSON, no API calls required.
