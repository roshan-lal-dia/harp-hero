# Harp Hero - AI Coding Instructions

## Project Overview
Harp Hero is a React-based web application for learning chromatic harmonica. It converts musical note sequences into harmonica tablature (hole, blow/draw, slide) with real-time visualization and audio playback.

## Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with semantic colors)
- **State Management**: Zustand (`src/store/appStore.ts`)
- **Audio**: Tone.js + soundfont-player (`src/utils/audioEngine.ts`)
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
- **Tone.js Integration**: Uses `Tone.PolySynth` as a fallback and `Tone.Sampler` for SoundFonts.
- **Effects Chain**: Synth -> Vibrato -> Filter -> Reverb -> Destination.
- **Usage**: Components should not instantiate `AudioEngine` directly but use the instance provided via context or imported singleton.

### Core Logic (Note Processing)
- **Parsing**: `src/utils/noteParser.ts` converts raw text (e.g., "C4 D4") into normalized note objects.
- **Mapping**: `src/utils/noteMappings.ts` maps musical notes to specific harmonica actions (Hole + Blow/Draw + Slide).
- **Timing**: `calculateTiming` adds duration information based on BPM.
- **Constants**: Use `src/utils/constants.ts` for shared values like `ACTION_BLOW`, `ACTION_DRAW`.

## Component Patterns

### Visualizer (`HarmonicaVisualizer.tsx`)
- **Direct DOM Manipulation**: Uses `useRef` for hole elements to perform high-frequency animations (active state) without triggering full React re-renders.
- **Dynamic Styling**: Uses semantic Tailwind colors defined in `tailwind.config.js`:
  - **Blow**: `harp-blow` (Cyan)
  - **Draw**: `harp-draw` (Rose)
  - **Slide**: `harp-slide` (Amber)

### UI Components
- **Functional Components**: Use React hooks (`useState`, `useEffect`, `useCallback`).
- **Tailwind**: Use utility classes for layout and styling. Prefer semantic colors (`text-harp-blow`) over raw colors (`text-cyan-400`) where possible.

## Development Workflow

### Commands
- `npm run dev`: Start local development server.
- `npm run build`: Production build.
- `npm run lint`: Run ESLint.

### Key Files
- `src/store/appStore.ts`: Central state logic.
- `src/utils/audioEngine.ts`: Audio synthesis and playback logic.
- `src/utils/noteParser.ts`: Input processing logic.
- `src/utils/constants.ts`: Application-wide constants.
- `src/components/HarmonicaVisualizer.tsx`: Main visual feedback component.

## Common Tasks
- **Adding a new setting**: Update `settings` object in `appStore.ts` and add a toggle in the settings UI.
- **Modifying Audio**: Tweak `AudioEngine` class. Ensure `Tone.start()` is called before any audio playback (usually on first user interaction).
- **New Note Syntax**: Update `normalizeNote` in `noteParser.ts`.
- **Theming**: Update `tailwind.config.js` `colors.harp` object to change global theme colors.
