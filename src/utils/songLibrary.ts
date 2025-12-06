/**
 * Song Library for HarpHero
 * Pre-loaded songs with metadata and difficulty ratings
 */

export interface Song {
  id: string;
  name: string;
  category: string;
  difficulty: number;
  bpm: number;
  notes: string;
  description: string;
  tips?: string[];
}

export const DIFFICULTY = {
  BEGINNER: 1,
  EASY: 2,
  INTERMEDIATE: 3,
  ADVANCED: 4,
  EXPERT: 5
};

export const SONGS: Record<string, Song> = {
  // Scales
  C_MAJOR_SCALE: {
    id: 'c-major-scale',
    name: 'C Major Scale',
    category: 'Scales',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 80,
    notes: 'C4 D4 E4 F4 G4 A4 B4 C5',
    description: 'The fundamental C major scale. Perfect for beginners.',
    tips: ['Focus on clean single notes', 'Keep steady airflow']
  },
  
  D_MAJOR_SCALE: {
    id: 'd-major-scale',
    name: 'D Major Scale',
    category: 'Scales',
    difficulty: DIFFICULTY.EASY,
    bpm: 80,
    notes: 'D4 E4 F#4 G4 A4 B4 C#5 D5',
    description: 'D major scale with sharps. Practice slide technique.',
    tips: ['F# and C# require slide button', 'Smooth slide transitions']
  },
  
  G_MAJOR_SCALE: {
    id: 'g-major-scale',
    name: 'G Major Scale',
    category: 'Scales',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 80,
    notes: 'G4 A4 B4 C5 D5 E5 F#5 G5',
    description: 'G major scale spanning two octave positions.',
    tips: ['Only one sharp (F#)', 'Good for building range']
  },
  
  CHROMATIC_EXERCISE: {
    id: 'chromatic-exercise',
    name: 'Chromatic Exercise',
    category: 'Exercises',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 60,
    notes: 'C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5',
    description: 'Full chromatic scale. Essential for slide mastery.',
    tips: ['Half the notes use the slide', 'Practice slowly at first']
  },
  
  // Simple Songs
  TWINKLE_TWINKLE: {
    id: 'twinkle-twinkle',
    name: 'Twinkle Twinkle Little Star',
    category: 'Beginner Songs',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 100,
    notes: 'C4 C4 G4 G4 A4 A4 G4 F4 F4 E4 E4 D4 D4 C4',
    description: 'Classic nursery rhyme. Great first song!',
    tips: ['All natural notes', 'No slide required', 'Focus on rhythm']
  },
  
  MARY_HAD_A_LITTLE_LAMB: {
    id: 'mary-lamb',
    name: 'Mary Had a Little Lamb',
    category: 'Beginner Songs',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 110,
    notes: 'E4 D4 C4 D4 E4 E4 E4 D4 D4 D4 E4 G4 G4 E4 D4 C4 D4 E4 E4 E4 E4 D4 D4 E4 D4 C4',
    description: 'Simple melody using only 4 notes.',
    tips: ['Uses holes 1-3 only', 'Practice breath control']
  },
  
  ODE_TO_JOY: {
    id: 'ode-to-joy',
    name: 'Ode to Joy',
    category: 'Classical',
    difficulty: DIFFICULTY.EASY,
    bpm: 100,
    notes: 'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4 E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4',
    description: 'Beethoven\'s famous melody from the 9th Symphony.',
    tips: ['Smooth legato playing', 'All natural notes']
  },
  
  AMAZING_GRACE: {
    id: 'amazing-grace',
    name: 'Amazing Grace',
    category: 'Traditional',
    difficulty: DIFFICULTY.EASY,
    bpm: 72,
    notes: 'G4 C5 E5 C5 E5 D5 C5 A4 G4 G4 C5 E5 C5 E5 D5 G5',
    description: 'Beautiful hymn with flowing melody.',
    tips: ['Work on breath support for long notes', 'Expressive dynamics']
  },
  
  // Goal Song from prototype
  GOAL_SONG: {
    id: 'goal-song',
    name: 'Goal Song (Full)',
    category: 'Featured',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 120,
    notes: `B4 B4 D5 D5 D5 E5 E5 F#5 E5 D5
B4 B4 D5 D5 D5 E5 E5 F#5 E5 D5
D5 E5 A5 A5 A5 G5 E5 D5 A5
G5 F#5 E5 D5 E5
B4 B4 D5 D5 D5 E5 E5 F#5 E5 D5
B4 B4 D5 D5 D5 E5 E5 F#5 E5 D5
D5 E5 A5 A5 A5 C6 B5 A5 B5
G5 G5 B5 A5 G5 F#5 E5 D5 E5
F#5 G5 A5 A5 A5 A5 A5 A5 A5
G5 F#5 E5 D5 A5 G5 F#5 E5
F#5 G5 B5 A5 A5 A5 A5 A5 A5 A5
G5 F#5 E5 D5 A5 G5 F#5 E5
F#5 F#5 A5 A5 A5 B5 B5 C#6 B5 A5
F#5 F#5 A5 A5 A5 B5 B5 C#6 B5 A5
A5 B5 E6 D6 E6 C#6 D6 B5 C6 A5
A5 B5 A5 C6 B5 A5 G5 F#5 E5`,
    description: 'The main goal song to master. Contains sharps and wide range.',
    tips: ['Break into sections', 'Practice each phrase separately', 'Build up speed gradually']
  },
  
  // Exercises
  BLOW_DRAW_EXERCISE: {
    id: 'blow-draw',
    name: 'Blow-Draw Pattern',
    category: 'Exercises',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 60,
    notes: 'C4 D4 C4 D4 E4 F4 E4 F4 G4 A4 G4 A4 B4 C5 B4 C5',
    description: 'Alternate between blow and draw notes.',
    tips: ['Smooth transitions', 'Equal volume on blow and draw']
  },
  
  HOLE_JUMPING: {
    id: 'hole-jumping',
    name: 'Hole Jumping Exercise',
    category: 'Exercises',
    difficulty: DIFFICULTY.EASY,
    bpm: 70,
    notes: 'C4 E4 G4 C5 G4 E4 C4 D4 F4 A4 D5 A4 F4 D4',
    description: 'Practice moving between non-adjacent holes.',
    tips: ['Accuracy over speed', 'Use tongue to feel hole positions']
  },
  
  SLIDE_WORKOUT: {
    id: 'slide-workout',
    name: 'Slide Button Workout',
    category: 'Exercises',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 50,
    notes: 'C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5 C#5 D5 D#5 E5',
    description: 'Practice smooth slide engagement and release.',
    tips: ['Press slide firmly but smoothly', 'Listen for clean pitch changes']
  }
};

// Get songs by category
export function getSongsByCategory(category) {
  return Object.values(SONGS).filter(song => song.category === category);
}

// Get songs by difficulty
export function getSongsByDifficulty(difficulty) {
  return Object.values(SONGS).filter(song => song.difficulty === difficulty);
}

// Get all categories
export function getCategories() {
  const categories = new Set();
  Object.values(SONGS).forEach(song => categories.add(song.category));
  return Array.from(categories);
}

// Get song by ID
export function getSongById(id) {
  return Object.values(SONGS).find(song => song.id === id);
}

// Default song for the app
export const DEFAULT_SONG = SONGS.GOAL_SONG;

export default SONGS;
