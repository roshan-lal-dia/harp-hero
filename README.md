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
├── src/
│   ├── components/
│   │   ├── HarmonicaVisualizer.tsx # Main harmonica display
│   │   ├── PlaybackControls.tsx    # Transport and tempo controls
│   │   ├── TabViewer.tsx           # Scrolling tablature list
│   │   ├── NoteInput.tsx           # Note input area
│   │   ├── SongBrowser.tsx         # Song library & upload
│   │   ├── LearningPlan.tsx        # Practice curriculum
│   │   └── ...
│   ├── store/
│   │   └── appStore.ts             # Zustand state management
│   ├── utils/
│   │   ├── noteMappings.ts         # Harmonica note-to-hole mappings
│   │   ├── noteParser.ts           # Text note parsing
│   │   ├── lilyPondParser.ts       # LilyPond parsing
│   │   ├── musicXmlParser.ts       # MusicXML parsing
│   │   ├── audioEngine.ts          # SpessaSynth/Tone.js audio wrapper
│   │   └── ...
│   ├── App.tsx                     # Main app layout
│   └── index.css                   # Tailwind v4 configuration
├── public/
│   └── sf/                         # SoundFont files
├── package.json
└── vite.config.ts
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