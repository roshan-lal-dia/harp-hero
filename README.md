# 🎵 HarpHero - Chromatic Harmonica Learning App

A modern, interactive web application that converts musical note sequences into chromatic harmonica tablature with real-time visualization for learning and single-note practice.

## Features

### 🎼 Core Features
- **Note-to-Tablature Conversion**: Convert note sequences (Text, LilyPond, MusicXML) into full chromatic harmonica tablature.
- **12-Hole Chromatic Harmonica Support**: Complete mapping for C4-C7 range with slide button notation.
- **Real-time Visualization**: Interactive harmonica display showing:
  - Active hole highlight
  - Blow/Draw indication with airflow animation
  - Slide button state (in/out)
  - Color-coded feedback (cyan for blow, rose for draw, amber for slide)

### 🎹 Audio Engine
- **Hybrid Sound Engine**: 
  - **SpessaSynth**: High-quality SoundFont (.sf2) playback for realistic harmonica tones.
  - **Tone.js**: Synthesized fallback and audio scheduling.
- **Playback Control**: Adjustable speed (BPM), volume, and seeking.
- **Metronome**: Integrated metronome for timing practice.

### 📚 Learning Features
- **15-Day Practice Plan**: Structured curriculum for beginners.
- **Progress Tracking**: Session time, notes played, and daily goals.
- **Song Library**: Pre-loaded songs and exercises.
- **Sequence Analysis**: Note frequency, hole usage, and range statistics.
- **Achievements**: Gamified milestones for practice consistency.

### 🎯 Practice Modes
- Standard playback with auto-scroll.
- Step-by-step note navigation.
- Loop sections for focused practice.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd harp-hero

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173` (Vite default).

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### Basic Workflow

1. **Enter Notes**: 
   - Type text (e.g., "C4 D4 E4")
   - Paste LilyPond notation (e.g., "c'4 d'8")
   - Upload MusicXML/.mxl files
2. **Parse & Load**: The app automatically detects format and generates tablature.
3. **Play**: Use the transport controls to play through the sequence.
   - Space bar: Play/Pause
   - Arrow keys: Step through notes
4. **Practice**: Follow the visual cues on the harmonica display.

### Note Input Format

**Standard Text:**
```
C4 D4 E4 F4 G4        # Space-separated notes
C4 D4 | E4 F4         # Measure breaks
C#4 Db4 F#5           # Sharps and flats
```

**LilyPond (Subset):**
```
c'4 d'8 e'4 r4        # Pitches with duration and rests
```

## Project Structure

```
harp-hero/
├── .github/                       # GitHub specific configurations (e.g., Copilot instructions)
├── .gemini/                       # Gemini AI specific configurations and documentation
├── public/
│   ├── favicon.svg                # Favicon for the application
│   └── sf/                        # SoundFont files for SpessaSynth
│       ├── harmonica-basic.sf2
│       └── harmonica-full.sf2
├── src/
│   ├── components/
│   │   ├── AchievementsPanel.tsx  # Displays user achievements
│   │   ├── BreathTrainer.tsx      # Component for breath training exercises
│   │   ├── ErrorBoundary.tsx      # Catches and displays UI errors
│   │   ├── HarmonicaVisualizer.tsx # Main harmonica display and interaction
│   │   ├── Header.tsx             # Application header and navigation
│   │   ├── LearningPlan.tsx       # Manages and displays the 15-day practice plan
│   │   ├── Metronome.tsx          # Metronome functionality
│   │   ├── NoteInput.tsx          # Input area for musical notes/sequences
│   │   ├── Piano.tsx              # Virtual piano keyboard (if applicable)
│   │   ├── PlaybackControls.tsx   # Controls for audio playback (play, pause, tempo, etc.)
│   │   ├── SequenceStats.tsx      # Displays statistics about the current note sequence
│   │   ├── SettingsPanel.tsx      # User settings and preferences
│   │   ├── SongBrowser.tsx        # Browsing and loading songs/exercises
│   │   ├── SongTips.tsx           # Displays tips related to the current song
│   │   └── TabViewer.tsx          # Displays the harmonica tablature
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts # Custom hook for handling keyboard shortcuts
│   ├── store/
│   │   └── appStore.ts            # Zustand store for global state management
│   ├── utils/
│   │   ├── audioEngine.ts         # Wrapper for audio synthesis and playback
│   │   ├── constants.ts           # Application-wide constants
│   │   ├── learningPlan.ts        # Logic for the learning plan
│   │   ├── lilyPondParser.ts      # Parser for LilyPond musical notation subset
│   │   ├── musicXmlParser.ts      # Parser for MusicXML and .mxl files
│   │   ├── noteMappings.ts        # Maps musical notes to harmonica holes/actions
│   │   ├── noteParser.ts          # Parser for standard text-based musical notes
│   │   └── songLibrary.ts         # Manages the library of pre-loaded songs
│   ├── App.tsx                    # Main application component
│   ├── index.css                  # Global styles including Tailwind CSS configuration
│   └── main.tsx                   # Entry point for the React application
├── .gitignore                     # Specifies intentionally untracked files to ignore
├── index.html                     # Main HTML file
├── package.json                   # Project dependencies and scripts
├── package-lock.json              # Records the exact versions of dependencies
├── tsconfig.json                  # TypeScript configuration for the project
├── tsconfig.node.json             # TypeScript configuration for Node.js environment
└── vite.config.ts                 # Vite build tool configuration
```

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Language
- **Tailwind CSS v4** - Styling
- **Zustand** - State management
- **SpessaSynth** & **Tone.js** - Audio
- **Lucide React** - Icons

## License

MIT License
