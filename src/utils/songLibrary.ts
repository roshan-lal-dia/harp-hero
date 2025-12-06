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
  },

  // ============ FOLK SONGS ============
  
  WHEN_THE_SAINTS: {
    id: 'when-the-saints',
    name: 'When the Saints Go Marching In',
    category: 'Folk Songs',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 110,
    notes: 'C4 E4 F4 G4 C4 E4 F4 G4 C4 E4 F4 G4 E4 C4 E4 D4 C4 E4 E4 D4 C4 E4 G4 G4 F4 E4 F4 G4 E4 C4 D4 C4',
    description: 'Classic New Orleans jazz standard, perfect for beginners.',
    tips: ['Focus on the upbeat rhythm', 'Keep a steady marching tempo']
  },

  OH_SUSANNA: {
    id: 'oh-susanna',
    name: 'Oh! Susanna',
    category: 'Folk Songs',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 120,
    notes: 'C4 D4 E4 G4 G4 A4 G4 E4 C4 D4 E4 E4 D4 D4 C4 C4 D4 E4 G4 G4 A4 G4 E4 C4 D4 E4 D4 C4 D4 E4 G4 E4 C4',
    description: 'Stephen Foster classic, great for building confidence.',
    tips: ['Simple melody line', 'Practice consistent breath control']
  },

  CAMPTOWN_RACES: {
    id: 'camptown-races',
    name: 'Camptown Races',
    category: 'Folk Songs',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 130,
    notes: 'G4 G4 E4 G4 A4 G4 E4 D4 E4 G4 G4 E4 G4 A4 G4 G4 G4 E4 G4 A4 G4 E4 D4 E4 D4 C4',
    description: 'Fun and bouncy American folk song.',
    tips: ['Doo-dah rhythm', 'Keep it light and playful']
  },

  HOME_ON_THE_RANGE: {
    id: 'home-on-the-range',
    name: 'Home on the Range',
    category: 'Folk Songs',
    difficulty: DIFFICULTY.EASY,
    bpm: 80,
    notes: 'C4 C4 E4 G4 C5 C5 B4 A4 G4 E4 G4 A4 G4 E4 D4 C4 C4 E4 G4 C5 C5 B4 A4 G4 A4 G4 E4 D4 C4',
    description: 'The official state song of Kansas.',
    tips: ['Slow, lyrical phrasing', 'Work on smooth transitions']
  },

  RED_RIVER_VALLEY: {
    id: 'red-river-valley',
    name: 'Red River Valley',
    category: 'Folk Songs',
    difficulty: DIFFICULTY.EASY,
    bpm: 72,
    notes: 'G4 C5 C5 C5 D5 C5 A4 G4 G4 C5 C5 D5 E5 D5 C5 G4 C5 C5 C5 D5 C5 E5 D5 C5 A4 G4',
    description: 'Beautiful cowboy ballad with emotional melody.',
    tips: ['Express the emotion', 'Gentle breath for soft passages']
  },

  SHENANDOAH: {
    id: 'shenandoah',
    name: 'Shenandoah',
    category: 'Folk Songs',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 66,
    notes: 'G4 C5 C5 E5 D5 C5 A4 G4 E4 G4 A4 C5 C5 D5 E5 G5 E5 D5 C5 A4 C5 D5 C5 A4 G4',
    description: 'Majestic American folk song about the Shenandoah River.',
    tips: ['Long flowing phrases', 'Expressive dynamics']
  },

  DANNY_BOY: {
    id: 'danny-boy',
    name: 'Danny Boy',
    category: 'Folk Songs',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 60,
    notes: 'G4 C5 D5 E5 G5 E5 D5 C5 D5 E5 D5 C5 A4 G4 C5 D5 E5 G5 A5 G5 E5 D5 C5 D5 C5',
    description: 'Beautiful Irish ballad, emotionally moving.',
    tips: ['Breathe with the phrases', 'Build to the climax']
  },

  GREENSLEEVES: {
    id: 'greensleeves',
    name: 'Greensleeves',
    category: 'Folk Songs',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 72,
    notes: 'A4 C5 D5 E5 F5 E5 D5 B4 G4 A4 B4 C5 A4 A4 G#4 A4 B4 G#4 E4 A4 C5 D5 E5 F5 E5 D5 B4 G4 A4 B4 C5 B4 A4 G#4 A4',
    description: 'Traditional English folk tune, also known as "What Child Is This".',
    tips: ['Minor key feel', 'Watch the G# slide notes']
  },

  SCARBOROUGH_FAIR: {
    id: 'scarborough-fair',
    name: 'Scarborough Fair',
    category: 'Folk Songs',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 68,
    notes: 'E4 A4 A4 A4 B4 C5 A4 G4 E4 D4 E4 G4 A4 B4 A4 G4 E4 A4 G4 E4 D4 C4 D4 E4',
    description: 'Haunting medieval English ballad.',
    tips: ['Modal melody feel', 'Light, airy tone']
  },

  // ============ CLASSICAL ============
  
  FUR_ELISE: {
    id: 'fur-elise',
    name: 'Für Elise (Theme)',
    category: 'Classical',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 80,
    notes: 'E5 D#5 E5 D#5 E5 B4 D5 C5 A4 C4 E4 A4 B4 E4 G#4 B4 C5 E4 E5 D#5 E5 D#5 E5 B4 D5 C5 A4',
    description: 'Beethoven\'s beloved piano piece, main theme.',
    tips: ['The D#5 requires slide', 'Maintain steady tempo']
  },

  MOONLIGHT_SONATA: {
    id: 'moonlight-sonata',
    name: 'Moonlight Sonata (Theme)',
    category: 'Classical',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 54,
    notes: 'G#4 C#5 E5 G#4 C#5 E5 G#4 C#5 E5 G#4 C#5 E5 A4 C#5 E5 A4 C#5 E5 A4 D5 F#5 A4 D5 F#5',
    description: 'Beethoven\'s haunting first movement theme.',
    tips: ['Very slow and expressive', 'Arpeggiated feel']
  },

  CANON_IN_D: {
    id: 'canon-in-d',
    name: 'Canon in D (Melody)',
    category: 'Classical',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 60,
    notes: 'F#5 E5 D5 C#5 B4 A4 B4 C#5 D5 C#5 B4 A4 G4 F#4 G4 E4 D4 F#4 A4 G4 F#4 D4 F#4 E4 D4 B4 A4 G4 F#4 D4 E4 F#4',
    description: 'Pachelbel\'s famous wedding favorite.',
    tips: ['Flowing legato', 'Multiple sharps require slide practice']
  },

  JESU_JOY: {
    id: 'jesu-joy',
    name: 'Jesu, Joy of Man\'s Desiring',
    category: 'Classical',
    difficulty: DIFFICULTY.ADVANCED,
    bpm: 72,
    notes: 'G4 A4 B4 D5 C5 B4 A4 G4 F#4 G4 A4 D4 E4 F#4 G4 A4 B4 G4 A4 B4 C5 D5 B4 A4 G4',
    description: 'Bach\'s beautiful chorale melody.',
    tips: ['Continuous flowing line', 'Careful with the F# slides']
  },

  AVE_MARIA: {
    id: 'ave-maria',
    name: 'Ave Maria (Schubert)',
    category: 'Classical',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 52,
    notes: 'C5 E5 G5 C6 G5 E5 C5 D5 F5 A5 D6 A5 F5 D5 E5 G5 B5 E6 B5 G5 E5 C5',
    description: 'Schubert\'s sublime sacred melody.',
    tips: ['Long breath support needed', 'Pure, angelic tone']
  },

  SPRING_VIVALDI: {
    id: 'spring-vivaldi',
    name: 'Spring (Vivaldi)',
    category: 'Classical',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 110,
    notes: 'E5 F#5 G#5 G#5 G#5 F#5 E5 E5 E5 F#5 G#5 G#5 G#5 F#5 E5 E5 D#5 E5 F#5 D#5 B4 E5 F#5 G#5 A5 G#5 F#5 E5',
    description: 'Joyful opening theme from The Four Seasons.',
    tips: ['Bright and energetic', 'Multiple sharps throughout']
  },

  TURKISH_MARCH: {
    id: 'turkish-march',
    name: 'Turkish March (Mozart)',
    category: 'Classical',
    difficulty: DIFFICULTY.ADVANCED,
    bpm: 120,
    notes: 'B4 A4 G#4 A4 C5 A4 C5 A4 D5 C5 B4 C5 E5 C5 E5 C5 B4 A4 G#4 A4 B4 A4 G#4 A4 C5 A4 E5 D5 C5 B4 A4',
    description: 'Mozart\'s famous energetic rondo.',
    tips: ['Fast and precise', 'Many slide changes']
  },

  // ============ WORLD MUSIC ============
  
  SAKURA: {
    id: 'sakura',
    name: 'Sakura (Cherry Blossoms)',
    category: 'World Music',
    difficulty: DIFFICULTY.EASY,
    bpm: 60,
    notes: 'A4 A4 B4 A4 A4 B4 A4 B4 C5 B4 A4 B4 A4 E4 D4 E4 D4 E4 A4 A4 B4 A4 A4 B4',
    description: 'Traditional Japanese folk song celebrating spring.',
    tips: ['Pentatonic scale', 'Gentle and contemplative']
  },

  ARIRANG: {
    id: 'arirang',
    name: 'Arirang',
    category: 'World Music',
    difficulty: DIFFICULTY.EASY,
    bpm: 72,
    notes: 'A4 C5 D5 E5 E5 D5 C5 A4 A4 C5 D5 E5 G5 E5 D5 C5 A4 G4 A4 C5 D5 C5 A4',
    description: 'Korea\'s most beloved folk song.',
    tips: ['Flowing melody', 'Emotional expression']
  },

  HATIKVAH: {
    id: 'hatikvah',
    name: 'Hatikvah',
    category: 'World Music',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 72,
    notes: 'D4 D4 E4 F4 G4 A4 Bb4 A4 G4 F4 E4 D4 E4 F4 G4 A4 G4 F4 E4 D4 D4 E4 F4 G4 F4 E4 D4',
    description: 'Israeli national anthem with deep emotion.',
    tips: ['Minor key', 'The Bb requires slide']
  },

  LA_BAMBA: {
    id: 'la-bamba',
    name: 'La Bamba',
    category: 'World Music',
    difficulty: DIFFICULTY.EASY,
    bpm: 130,
    notes: 'C5 C5 D5 E5 E5 E5 D5 C5 C5 C5 D5 E5 E5 E5 D5 C5 G4 G4 A4 B4 C5 A4 G4 E4 G4 G4 A4 B4 C5',
    description: 'Lively Mexican folk song made famous by Ritchie Valens.',
    tips: ['Upbeat rhythm', 'Strong accents']
  },

  KOOKABURRA: {
    id: 'kookaburra',
    name: 'Kookaburra',
    category: 'World Music',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 100,
    notes: 'C5 C5 C5 C5 D5 E5 E5 D5 E5 F5 G5 G5 G5 G5 E5 E5 E5 C5 D5 D5 D5 B4 C5',
    description: 'Fun Australian children\'s round about a laughing bird.',
    tips: ['Can be sung as a round', 'Light and playful']
  },

  FRERE_JACQUES: {
    id: 'frere-jacques',
    name: 'Frère Jacques',
    category: 'World Music',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 110,
    notes: 'C4 D4 E4 C4 C4 D4 E4 C4 E4 F4 G4 E4 F4 G4 G4 A4 G4 F4 E4 C4 G4 A4 G4 F4 E4 C4 C4 G3 C4 C4 G3 C4',
    description: 'Classic French nursery rhyme known worldwide.',
    tips: ['Perfect for rounds', 'Simple and memorable']
  },

  KALINKA: {
    id: 'kalinka',
    name: 'Kalinka',
    category: 'World Music',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 100,
    notes: 'E5 E5 F#5 E5 D5 C#5 D5 E5 E5 F#5 E5 D5 C#5 B4 A4 B4 C#5 D5 E5 F#5 E5 D5 C#5 D5 E5 A4',
    description: 'Energetic Russian folk song.',
    tips: ['Accelerates traditionally', 'Uses F# and C# slides']
  },

  // ============ JAZZ STANDARDS ============
  
  SUMMERTIME: {
    id: 'summertime',
    name: 'Summertime',
    category: 'Jazz Standards',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 66,
    notes: 'E5 A5 B5 A5 E5 D5 E5 A4 E5 A5 B5 C6 B5 A5 E5 A5 G5 E5 D5 A4 B4 A4 E4',
    description: 'Gershwin\'s iconic jazz and blues standard from Porgy and Bess.',
    tips: ['Bluesy feel', 'Laid back tempo']
  },

  AUTUMN_LEAVES: {
    id: 'autumn-leaves',
    name: 'Autumn Leaves',
    category: 'Jazz Standards',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 75,
    notes: 'E5 F#5 G5 C5 D5 E5 F#5 B4 C5 D5 E5 A4 B4 C5 D5 G4 A4 B4 C5 B4 A4 G4 F#4 E4',
    description: 'Jazz standard with beautiful chord changes.',
    tips: ['Swing feel', 'Express the melancholy']
  },

  FLY_ME_TO_THE_MOON: {
    id: 'fly-me-to-the-moon',
    name: 'Fly Me to the Moon',
    category: 'Jazz Standards',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 120,
    notes: 'C5 B4 A4 G4 F4 G4 A4 C5 B4 A4 G4 A4 B4 C5 D5 E5 F5 E5 D5 C5 B4 C5 D5 A4',
    description: 'Frank Sinatra made this song famous.',
    tips: ['Swing rhythm', 'Smooth transitions']
  },

  TAKE_FIVE: {
    id: 'take-five',
    name: 'Take Five',
    category: 'Jazz Standards',
    difficulty: DIFFICULTY.ADVANCED,
    bpm: 88,
    notes: 'Eb5 F5 Gb5 Ab5 Bb5 Bb5 Ab5 Gb5 Eb5 Db5 Eb5 F5 Gb5 Ab5 Bb5 Ab5 Gb5 F5 Eb5 Db5 C5 Bb4',
    description: 'Dave Brubeck\'s famous 5/4 time signature piece.',
    tips: ['Count in 5/4 time', 'Many slide notes required']
  },

  MISTY: {
    id: 'misty',
    name: 'Misty',
    category: 'Jazz Standards',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 66,
    notes: 'G4 C5 E5 G5 F5 E5 D5 C5 A4 G4 E4 D4 C4 G4 C5 E5 G5 F5 E5 D5 C5',
    description: 'Erroll Garner\'s romantic jazz ballad.',
    tips: ['Rubato feel', 'Dreamy and expressive']
  },

  // ============ POP & MOVIE THEMES ============
  
  HAPPY_BIRTHDAY: {
    id: 'happy-birthday',
    name: 'Happy Birthday',
    category: 'Pop & Standards',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 100,
    notes: 'G4 G4 A4 G4 C5 B4 G4 G4 A4 G4 D5 C5 G4 G4 G5 E5 C5 B4 A4 F5 F5 E5 C5 D5 C5',
    description: 'The world\'s most sung song!',
    tips: ['Everyone knows it', 'Great for beginners']
  },

  SOMEWHERE_OVER_RAINBOW: {
    id: 'over-the-rainbow',
    name: 'Over the Rainbow',
    category: 'Movie Themes',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 80,
    notes: 'C4 C5 B4 G4 A4 B4 C5 C4 A4 G4 F4 E4 F4 G4 C4 D4 E4 F4 G4 A4 A4 G4',
    description: 'From The Wizard of Oz, a timeless classic.',
    tips: ['Big octave jump at start', 'Dreamy and hopeful']
  },

  STAR_WARS: {
    id: 'star-wars',
    name: 'Star Wars Theme',
    category: 'Movie Themes',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 108,
    notes: 'G4 G4 G4 C5 G5 F5 E5 D5 C6 G5 F5 E5 D5 C6 G5 F5 E5 F5 D5',
    description: 'John Williams\' iconic space opera fanfare.',
    tips: ['Majestic and bold', 'Strong accents']
  },

  PIRATES_CARIBBEAN: {
    id: 'pirates-caribbean',
    name: 'He\'s a Pirate',
    category: 'Movie Themes',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 140,
    notes: 'D4 D4 D4 E4 F4 F4 F4 G4 E4 E4 D4 C4 C4 D4 D4 D4 E4 F4 F4 G4 A4 D4 D4 E4 F4 F4 G4 E4 E4 D4 C4 D4',
    description: 'Rousing pirate adventure theme by Hans Zimmer.',
    tips: ['Fast and energetic', 'Keep rhythm driving']
  },

  MY_HEART_WILL_GO_ON: {
    id: 'my-heart-will-go-on',
    name: 'My Heart Will Go On (Titanic)',
    category: 'Movie Themes',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 100,
    notes: 'E5 E5 E5 E5 D5 E5 F#5 E5 D5 E5 E5 F#5 E5 D5 E5 F#5 A5 G#5 A5 B5 A5 G#5 F#5 E5',
    description: 'Celine Dion\'s Oscar-winning Titanic theme.',
    tips: ['Emotional and sweeping', 'Watch the sharps']
  },

  GODFATHER: {
    id: 'godfather',
    name: 'The Godfather Theme',
    category: 'Movie Themes',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 60,
    notes: 'A4 D5 F5 E5 D5 C5 D5 E5 A4 D5 F5 G5 F5 E5 D5 C#5 D5 A4 Bb4 A4 G4 F4 E4 D4',
    description: 'Nino Rota\'s haunting Italian waltz.',
    tips: ['Sicilian feel', 'Minor key emotion']
  },

  PINK_PANTHER: {
    id: 'pink-panther',
    name: 'Pink Panther Theme',
    category: 'Movie Themes',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 110,
    notes: 'E4 G4 A4 Bb4 E4 G4 A4 Bb4 D5 Db5 C5 B4 E4 G4 A4 Bb4 E5 Eb5 D5 Db5 C5 B4 Bb4 A4',
    description: 'Henry Mancini\'s sneaky jazz theme.',
    tips: ['Chromatic movement', 'Playful and slinky']
  },

  GAME_OF_THRONES: {
    id: 'game-of-thrones',
    name: 'Game of Thrones Theme',
    category: 'Movie Themes',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 85,
    notes: 'G4 C5 Eb5 F5 G5 C5 Eb5 F5 D5 G4 Bb4 C5 D5 G4 Bb4 C5 F5 Bb5 Eb5 D5 F5 Bb5 Eb5 D5',
    description: 'Ramin Djawadi\'s epic HBO series theme.',
    tips: ['Minor key power', 'Epic and dramatic']
  },

  // ============ MORE EXERCISES ============
  
  THIRDS_EXERCISE: {
    id: 'thirds-exercise',
    name: 'Thirds Interval Training',
    category: 'Exercises',
    difficulty: DIFFICULTY.EASY,
    bpm: 70,
    notes: 'C4 E4 D4 F4 E4 G4 F4 A4 G4 B4 A4 C5 B4 D5 C5 E5 D5 F5 E5 G5',
    description: 'Practice playing in thirds for harmony skills.',
    tips: ['Smooth interval jumps', 'Listen for the harmony']
  },

  OCTAVE_EXERCISE: {
    id: 'octave-exercise',
    name: 'Octave Jump Workout',
    category: 'Exercises',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 60,
    notes: 'C4 C5 D4 D5 E4 E5 F4 F5 G4 G5 A4 A5 B4 B5 C5 C6',
    description: 'Build confidence jumping between octaves.',
    tips: ['Accuracy is key', 'Feel the hole positions']
  },

  ARTICULATION_EXERCISE: {
    id: 'articulation-exercise',
    name: 'Tongue Articulation Drill',
    category: 'Exercises',
    difficulty: DIFFICULTY.INTERMEDIATE,
    bpm: 80,
    notes: 'C4 C4 C4 C4 D4 D4 D4 D4 E4 E4 E4 E4 F4 F4 F4 F4 G4 G4 G4 G4',
    description: 'Practice clean note attacks with tongue.',
    tips: ['Use "ta" or "da" articulation', 'Keep airflow steady']
  },

  SPEED_BUILDER: {
    id: 'speed-builder',
    name: 'Speed Building Sequence',
    category: 'Exercises',
    difficulty: DIFFICULTY.ADVANCED,
    bpm: 100,
    notes: 'C4 D4 E4 F4 G4 A4 B4 C5 B4 A4 G4 F4 E4 D4 C4 D4 E4 F4 G4 A4 B4 C5 D5 E5 F5 G5 A5 G5 F5 E5 D5 C5 B4 A4 G4 F4 E4 D4 C4',
    description: 'Build speed with scale runs up and down.',
    tips: ['Start slow', 'Gradually increase tempo']
  },

  BENDING_PREP: {
    id: 'bending-prep',
    name: 'Slide Control Precision',
    category: 'Exercises',
    difficulty: DIFFICULTY.ADVANCED,
    bpm: 50,
    notes: 'C4 C#4 C4 D4 D#4 D4 E4 F4 F#4 F4 G4 G#4 G4 A4 A#4 A4 B4 C5 C#5 C5',
    description: 'Develop precise slide button control.',
    tips: ['Half-step movements', 'Listen for pitch accuracy']
  },

  // ============ SEASONAL/HOLIDAY ============
  
  JINGLE_BELLS: {
    id: 'jingle-bells',
    name: 'Jingle Bells',
    category: 'Holiday',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 120,
    notes: 'E4 E4 E4 E4 E4 E4 E4 G4 C4 D4 E4 F4 F4 F4 F4 F4 E4 E4 E4 E4 D4 D4 E4 D4 G4',
    description: 'Classic Christmas favorite.',
    tips: ['Joyful and bouncy', 'Everyone can sing along']
  },

  SILENT_NIGHT: {
    id: 'silent-night',
    name: 'Silent Night',
    category: 'Holiday',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 66,
    notes: 'G4 A4 G4 E4 G4 A4 G4 E4 D5 D5 B4 C5 C5 G4 A4 A4 C5 B4 A4 G4 A4 G4 E4',
    description: 'Peaceful Christmas carol.',
    tips: ['Soft and gentle', 'Reverent feeling']
  },

  WE_WISH_YOU: {
    id: 'we-wish-you-merry-christmas',
    name: 'We Wish You a Merry Christmas',
    category: 'Holiday',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 140,
    notes: 'G4 C5 C5 D5 C5 B4 A4 A4 A4 D5 D5 E5 D5 C5 B4 G4 G4 E5 E5 F5 E5 D5 C5 A4 G4 G4 A4 D5 B4 C5',
    description: 'Festive Christmas song with good cheer.',
    tips: ['Energetic and joyful', 'Clear articulation']
  },

  AULD_LANG_SYNE: {
    id: 'auld-lang-syne',
    name: 'Auld Lang Syne',
    category: 'Holiday',
    difficulty: DIFFICULTY.EASY,
    bpm: 90,
    notes: 'G4 C5 C5 C5 E5 D5 C5 D5 E5 C5 C5 E5 G5 A5 A5 G5 E5 E5 C5 D5 E5 D5 C5 C5 A4 A4 G4',
    description: 'New Year\'s Eve traditional song.',
    tips: ['Nostalgic feeling', 'Build to the ending']
  },

  DREIDEL_SONG: {
    id: 'dreidel-song',
    name: 'Dreidel Song',
    category: 'Holiday',
    difficulty: DIFFICULTY.BEGINNER,
    bpm: 120,
    notes: 'E4 E4 E4 G4 F4 F4 F4 A4 E4 E4 E4 G4 F4 E4 D4 D4 E4 E4 E4 G4 F4 F4 F4 A4 G4 F4 E4 D4 E4',
    description: 'Fun Hanukkah children\'s song.',
    tips: ['Playful rhythm', 'Great for kids']
  }
};

// Get songs by category
export function getSongsByCategory(category: string): Song[] {
  return Object.values(SONGS).filter(song => song.category === category);
}

// Get songs by difficulty
export function getSongsByDifficulty(difficulty: number): Song[] {
  return Object.values(SONGS).filter(song => song.difficulty === difficulty);
}

// Get all categories
export function getCategories(): string[] {
  const categories = new Set<string>();
  Object.values(SONGS).forEach(song => categories.add(song.category));
  return Array.from(categories);
}

// Get song by ID
export function getSongById(id: string): Song | undefined {
  return Object.values(SONGS).find(song => song.id === id);
}

// Default song for the app
export const DEFAULT_SONG = SONGS.GOAL_SONG;

export default SONGS;