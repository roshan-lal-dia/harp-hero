/**
 * 15-Day Learning Plan Generator
 * Creates personalized practice schedules for chromatic harmonica
 */

import { Song } from './songLibrary';

export interface DayPlan {
  day: number;
  title: string;
  focus: string;
  warmup: string;
  exercises: string[];
  songWork: string;
  tips: string[];
  duration: string;
}

export interface Drill {
  name: string;
  description: string;
  duration: string;
}

export interface DailyDrills {
  warmup: Drill[];
  technique: Drill[];
  cooldown: Drill[];
}

export function generateLearningPlan(_song: Song | null, bpm = 120): DayPlan[] {
  const plan: DayPlan[] = [
    {
      day: 1,
      title: 'Foundation: Single Notes',
      focus: 'Embouchure & Clean Tones',
      warmup: 'Hole 4 Blow (C) - 5 min sustained tones',
      exercises: [
        'Hold C4 (Hole 4 Blow) for 4 counts, rest 2 counts. Repeat 10x',
        'Practice "pucker" embouchure - lips like whistling',
        'Aim for zero adjacent hole buzz'
      ],
      songWork: 'No song work today - focus on fundamentals',
      tips: [
        'Place harmonica deep in mouth',
        'Keep corners of mouth sealed',
        'Breathe from diaphragm'
      ],
      duration: '20-30 minutes'
    },
    {
      day: 2,
      title: 'Breath Control',
      focus: 'Blow vs Draw Technique',
      warmup: 'Hole 4: Blow (C) then Draw (D) - smooth transitions',
      exercises: [
        'C4-D4 pattern: 4 counts each, no break between',
        'Focus on equal volume for blow and draw',
        'Practice "support" breathing from belly'
      ],
      songWork: 'Identify all C and D notes in your goal song',
      tips: [
        'Draw notes often feel harder - use more air support',
        'Keep jaw relaxed',
        'Don\'t puff cheeks'
      ],
      duration: '25-30 minutes'
    },
    {
      day: 3,
      title: 'Expanding Range',
      focus: 'Holes 1-4 Navigation',
      warmup: 'C Major arpeggio: C4-E4-G4-C5 (slow)',
      exercises: [
        'Play each hole: blow then draw, move to next',
        'Sliding exercise: 1B-1D-2B-2D-3B-3D-4D',
        'Accuracy drill: Random hole calling'
      ],
      songWork: 'Find the lowest and highest notes in your song',
      tips: [
        'Feel holes with your tongue tip',
        'Small, precise movements',
        'Hole 4 Draw (B4) is the break point before octave 2'
      ],
      duration: '30 minutes'
    },
    {
      day: 4,
      title: 'Octave Transition',
      focus: 'Crossing to Holes 5-8',
      warmup: 'B4 (Hole 4 Draw) to C5 (Hole 5 Blow) - 20x',
      exercises: [
        'Pattern: C4-E4-G4-B4-C5 (crossing the break)',
        'Reverse: C5-B4-G4-E4-C4',
        'Speed building: start at 60 BPM, add 10 BPM each set'
      ],
      songWork: 'Practice any passages that cross from octave 1 to 2',
      tips: [
        'The break between hole 4 and 5 is the trickiest part',
        'Memorize: Hole 5 Blow = C5 (same note as Hole 1, octave higher)'
      ],
      duration: '30 minutes'
    },
    {
      day: 5,
      title: 'Introduction to Slide',
      focus: 'Chromatic Slide Button',
      warmup: 'C4 (no slide) then C#4 (with slide) - feel the difference',
      exercises: [
        'Slide on/off on each blow note: C-C#-C-C#',
        'Chromatic run: C4-C#4-D4-D#4-E4',
        'Practice pressing slide smoothly, not abruptly'
      ],
      songWork: 'Mark all sharps (#) and flats (b) in your song',
      tips: [
        'Slide raises pitch by one semitone',
        'Press with consistent pressure',
        'Keep playing while pressing/releasing'
      ],
      duration: '30-35 minutes'
    },
    {
      day: 6,
      title: 'Slide Mastery',
      focus: 'Smooth Chromatic Passages',
      warmup: 'Full chromatic scale C4 to C5',
      exercises: [
        'Slide workout: every note with slide, then without',
        'Triplet patterns with slide: C-C#-D, D-D#-E, etc.',
        'Accuracy: play random sharps on command'
      ],
      songWork: 'Practice all slide notes in your song in isolation',
      tips: [
        'Your pinky or ring finger controls the slide',
        'Build muscle memory for slide position',
        'Some notes feel awkward with slide - that\'s normal'
      ],
      duration: '35 minutes'
    },
    {
      day: 7,
      title: 'Rest & Review',
      focus: 'Consolidation Day',
      warmup: 'Easy scales at comfortable tempo',
      exercises: [
        'Play through all exercises from days 1-6',
        'Identify your weakest area',
        'Light practice only - let muscles rest'
      ],
      songWork: 'Listen to your goal song multiple times',
      tips: [
        'Rest is crucial for muscle memory',
        'Mental practice works too',
        'Review technique videos if available'
      ],
      duration: '15-20 minutes'
    },
    {
      day: 8,
      title: 'Song Introduction',
      focus: 'Learning the Melody',
      warmup: 'Full range warm-up: C4 to G5',
      exercises: [
        'Sight-read first 8 notes of song slowly',
        'Clap rhythm before playing',
        'Sing/hum melody while looking at tabs'
      ],
      songWork: `Play first phrase of song at ${Math.floor(bpm * 0.4)} BPM (40% speed)`,
      tips: [
        'Break song into 4-8 note phrases',
        'Accuracy before speed',
        'Use a metronome from day 1'
      ],
      duration: '35-40 minutes'
    },
    {
      day: 9,
      title: 'Phrase Building',
      focus: 'Connecting Musical Ideas',
      warmup: 'Yesterday\'s phrase + next phrase',
      exercises: [
        'Practice phrase transitions',
        'Work on breath points (where to breathe)',
        'Dynamics: try playing louder and softer'
      ],
      songWork: `Learn first half of song at ${Math.floor(bpm * 0.5)} BPM`,
      tips: [
        'Musical phrasing = telling a story',
        'Breathe at natural pause points',
        'Mark breath points on your score'
      ],
      duration: '40 minutes'
    },
    {
      day: 10,
      title: 'Speed Development',
      focus: 'Building Tempo Gradually',
      warmup: 'Scales at increasing speeds: 60-80-100 BPM',
      exercises: [
        'Metronome drill: 5 BPM increments',
        'Burst practice: play 4 notes fast, pause, repeat',
        'Identify "speed bumps" - tricky transitions'
      ],
      songWork: `First half at ${Math.floor(bpm * 0.6)} BPM, second half at ${Math.floor(bpm * 0.4)} BPM`,
      tips: [
        'Speed comes from efficiency, not effort',
        'Relax hands and face at faster tempos',
        'If you make mistakes, slow down'
      ],
      duration: '40-45 minutes'
    },
    {
      day: 11,
      title: 'Full Song Run-Through',
      focus: 'Complete Performance',
      warmup: 'Chromatic warm-up covering song\'s range',
      exercises: [
        'Play through entire song slowly',
        'Don\'t stop for mistakes - keep going',
        'Record yourself and listen back'
      ],
      songWork: `Full song at ${Math.floor(bpm * 0.6)} BPM`,
      tips: [
        'Mistakes happen - keep playing',
        'Record and review regularly',
        'Notice what improves and what needs work'
      ],
      duration: '45 minutes'
    },
    {
      day: 12,
      title: 'Problem Solving',
      focus: 'Fixing Trouble Spots',
      warmup: 'Focused practice on weakest sections',
      exercises: [
        'Isolate 3 hardest passages',
        'Loop each passage 20x slowly',
        'Gradually increase speed for each'
      ],
      songWork: `Target passages at ${Math.floor(bpm * 0.7)} BPM`,
      tips: [
        'Work hardest parts when freshest',
        'Break difficult runs into smaller chunks',
        'Visualization helps between practice sessions'
      ],
      duration: '45 minutes'
    },
    {
      day: 13,
      title: 'Musical Expression',
      focus: 'Dynamics & Articulation',
      warmup: 'Scales with dynamics: soft to loud and back',
      exercises: [
        'Add dynamics to your song',
        'Experiment with vibrato (subtle!)',
        'Practice different attacks: soft vs. punchy'
      ],
      songWork: `Full song at ${Math.floor(bpm * 0.8)} BPM with expression`,
      tips: [
        'Music is emotion - feel the melody',
        'Dynamics keep listeners engaged',
        'Vibrato: subtle jaw movement or breath pulsing'
      ],
      duration: '45 minutes'
    },
    {
      day: 14,
      title: 'Performance Prep',
      focus: 'Consistency & Confidence',
      warmup: 'Full run-through of exercises and song',
      exercises: [
        'Play song 3x through without stopping',
        'Practice "recovering" from mistakes',
        'Simulate performance: play for someone'
      ],
      songWork: `Full song at ${Math.floor(bpm * 0.9)} BPM`,
      tips: [
        'Mistakes are learning opportunities',
        'Perform for friends/family to build confidence',
        'Record your best take'
      ],
      duration: '50 minutes'
    },
    {
      day: 15,
      title: 'Performance Day!',
      focus: 'Full Speed Performance',
      warmup: 'Light warm-up - don\'t tire yourself',
      exercises: [
        'Gentle scales to wake up muscles',
        'One slow run-through',
        'Then: PERFORM!'
      ],
      songWork: `Full song at ${bpm} BPM - You did it!`,
      tips: [
        'You\'ve prepared - trust yourself',
        'Breathe, relax, and enjoy',
        'Celebrate your achievement!'
      ],
      duration: '30-40 minutes'
    }
  ];

  return plan;
}

export function getDailyDrills(): DailyDrills {
  return {
    warmup: [
      { name: 'Long Tones', description: 'Hold each note for 8 counts', duration: '3 min' },
      { name: 'Scales', description: 'C Major up and down', duration: '2 min' },
      { name: 'Chromatic', description: 'C to C with all sharps', duration: '2 min' }
    ],
    technique: [
      { name: 'Blow-Draw Switch', description: 'Alternate on same hole', duration: '2 min' },
      { name: 'Slide Drill', description: 'Press and release smoothly', duration: '2 min' },
      { name: 'Hole Accuracy', description: 'Jump between random holes', duration: '3 min' }
    ],
    cooldown: [
      { name: 'Slow Melody', description: 'Play any simple song slowly', duration: '3 min' },
      { name: 'Free Play', description: 'Improvise in C major', duration: '2 min' }
    ]
  };
}

export default generateLearningPlan;
