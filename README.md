# 🎵 HarpHero - Chromatic Harmonica Learning App

A modern, interactive web application that converts musical note sequences into chromatic harmonica tablature with real-time visualization for learning and single-note practice.

## Features

### 🎼 Core Features
- **Note-to-Tablature Conversion**: Convert any note sequence (e.g., "D D D D C# | F G A") into full chromatic harmonica tablature
- **12-Hole Chromatic Harmonica Support**: Complete mapping for C4-C7 range with slide button notation
- **Real-time Visualization**: Interactive harmonica display showing:
  - Active hole highlight
  - Blow/Draw indication with airflow animation
  - Slide button state (in/out)
  - Color-coded feedback (cyan for blow, rose for draw, amber for slide)

### 🎹 Audio Engine
- High-quality synthesized harmonica sound using Tone.js
- Adjustable playback speed (40-200 BPM)
- Volume control
- Metronome with customizable time signatures

### 📚 Learning Features
- **15-Day Practice Plan**: Structured curriculum for beginners
- **Progress Tracking**: Session time, notes played, and daily goals
- **Song Library**: Pre-loaded songs and exercises
- **Sequence Analysis**: Note frequency, hole usage, and range statistics

### 🎯 Practice Modes
- Standard playback with auto-scroll
- Step-by-step note navigation
- Loop sections for focused practice
- Adjustable tempo for gradual speed building

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

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### Basic Workflow

1. **Enter Notes**: Type or paste a note sequence in the input area
   - Use standard notation: C4, D#5, Bb4, F#, etc.
   - Use `|` for measure breaks
   - Use line breaks for phrases

2. **Parse & Load**: Click the button to generate tablature

3. **Play**: Use the transport controls to play through the sequence
   - Space bar: Play/Pause
   - Arrow keys: Step through notes
   - Adjust tempo with the slider

4. **Practice**: Follow the visual cues on the harmonica display

### Note Input Format

```
C4 D4 E4 F4 G4        # Space-separated notes
C4 D4 | E4 F4         # Measure breaks
C#4 Db4 F#5           # Sharps and flats
D D D D C#            # Without octave (defaults to 4)
```

## Project Structure

```
harp-hero/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # App header with navigation
│   │   ├── HarmonicaVisualizer.jsx # Main harmonica display
│   │   ├── PlaybackControls.jsx    # Transport and tempo controls
│   │   ├── TabViewer.jsx           # Scrolling tablature list
│   │   ├── NoteInput.jsx           # Note input textarea
│   │   ├── LearningPlan.jsx        # 15-day practice curriculum
│   │   ├── Metronome.jsx           # Metronome modal
│   │   ├── SongBrowser.jsx         # Song library browser
│   │   └── SequenceStats.jsx       # Analysis and statistics
│   ├── store/
│   │   └── appStore.js             # Zustand state management
│   ├── utils/
│   │   ├── noteMappings.js         # Harmonica note-to-hole mappings
│   │   ├── noteParser.js           # Note sequence parsing
│   │   ├── audioEngine.js          # Tone.js audio playback
│   │   ├── songLibrary.js          # Pre-loaded songs
│   │   ├── learningPlan.js         # Practice plan generator
│   │   └── soundFontLoader.js      # SoundFont support (future)
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
│   └── favicon.svg
├── harmonica soundfont/            # SoundFont files (for future use)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Chromatic Harmonica Layout

```
         Hole:  1    2    3    4    5    6    7    8    9   10   11   12
    ─────────────────────────────────────────────────────────────────────
    Blow:      C    E    G    C    C    E    G    C    C    E    G    C
    Blow+Slide: C#   F   G#   C#   C#   F   G#   C#   C#   F   G#   C#
    Draw:      D    F    A    B    D    F    A    B    D    F    A    B
    Draw+Slide: D#  F#   A#   C   D#   F#   A#   C   D#   F#   A#   D
    ─────────────────────────────────────────────────────────────────────
    Octave:         4              5              6              7
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Tone.js** - Audio synthesis
- **Lucide React** - Icons

## Roadmap

- [ ] SoundFont (.sf2) file support for realistic harmonica samples
- [ ] MIDI input/output support
- [ ] Recording and playback of practice sessions
- [ ] Export to PDF tablature sheets
- [ ] Mobile app (React Native)
- [ ] User accounts with cloud sync
- [ ] Community song sharing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Chromatic harmonica layout based on standard 12-hole Solo tuning in C
- Music theory and pedagogy inspired by established harmonica teaching methods
