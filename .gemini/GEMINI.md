# Harp Hero - AI Coding Instructions

## Project Overview
Harp Hero is a React-based web application for learning chromatic harmonica. It converts musical note sequences into harmonica tablature (hole, blow/draw, slide) with real-time visualization and audio playback.

## Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Native CSS configuration)
- **State Management**: Zustand (`src/store/appStore.ts`)
- **Audio**: 
  - **Synthesis**: Tone.js
  - **SoundFonts**: SpessaSynth (`spessasynth_core`, `spessasynth_lib`)
- **Score Parsing**: 
  - **Text (Harp Hero)**: `src/utils/noteParser.ts`
  - **LilyPond (Subset)**: `src/utils/lilyPondParser.ts` (Client-side pitch/duration parsing).
  - **MusicXML**: `src/utils/musicXmlParser.ts` (Custom implementation using DOMParser/JSZip).
- **Icons**: Lucide React

## Architecture & Data Flow

### State Management (Zustand)
- **Global Store**: `useAppStore` in `src/store/appStore.ts` manages:
  - `sequence`: The parsed array of notes to play/display.
  - `currentIndex`: The current position in the sequence.
  - `isPlaying`, `bpm`, `volume`: Playback controls.
  - `settings`: User preferences (soundfont, visual options).
- **Persistence**: The store uses `persist` middleware to save state to localStorage.

### Audio Engine
- **Singleton Pattern**: `AudioEngine` class in `src/utils/audioEngine.ts`.
- **Implementation**: Hybrid approach.
  - **Simple**: Tone.js PolySynth for basic fallback.
  - **Advanced**: SpessaSynth for high-quality SoundFont (.sf2) playback and MIDI handling.
- **Usage**: Components should not instantiate `AudioEngine` directly but use the instance provided via context or imported singleton.

### Core Logic (Note Processing)
- **Parsing**: 
  - `src/utils/noteParser.ts`: Standard "C4 D4" parsing.
  - `src/utils/lilyPondParser.ts`: LilyPond "c'4 d'8" parsing (Pitch/Duration/Rests).
  - `src/utils/musicXmlParser.ts`: MusicXML and .mxl parsing.
- **Mapping**: `src/utils/noteMappings.ts` maps musical notes to specific harmonica actions (Hole + Blow/Draw + Slide).
- **Timing**: `calculateTiming` adds duration information based on BPM.

## Component Patterns

### Visualizer (`HarmonicaVisualizer.tsx`)
- **Direct DOM Manipulation**: Uses `useRef` for hole elements to perform high-frequency animations (active state) without triggering full React re-renders.
- **Dynamic Styling**: Uses CSS variables and Tailwind utility classes.

### UI Components
- **Functional Components**: Use React hooks (`useState`, `useEffect`, `useCallback`).
- **Tailwind**: Use utility classes. Configuration is now in `src/index.css` (Tailwind v4).

## Development Workflow

### Commands
- `npm run dev`: Start local development server.
- `npm run build`: Production build.
- `npm run lint`: Run ESLint.

### Key Files
- `src/store/appStore.ts`: Central state logic. Handles input detection (Text vs LilyPond vs XML).
- `src/utils/audioEngine.ts`: Audio synthesis and playback logic.
- `src/utils/noteParser.ts`: Standard input processing logic.
- `src/utils/lilyPondParser.ts`: LilyPond input processing logic.
- `src/utils/musicXmlParser.ts`: MusicXML input processing logic.
- `src/utils/constants.ts`: Application-wide constants.
- `src/components/HarmonicaVisualizer.tsx`: Main visual feedback component.

## Common Tasks
- **Adding a new setting**: Update `settings` object in `appStore.ts` and add a toggle in the settings UI.
- **Modifying Audio**: Tweak `AudioEngine` class.
- **New Note Syntax**: Update `normalizeNote` in `noteParser.ts`.
- **Theming**: Update `src/index.css` CSS variables.