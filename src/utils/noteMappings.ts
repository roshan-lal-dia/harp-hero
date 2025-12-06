/**
 * Chromatic Harmonica Note Mappings
 * 12-Hole Solo Tuning in C
 * 
 * Each hole can produce 4 notes:
 * - Blow (slide out)
 * - Blow (slide in) - raises pitch by semitone
 * - Draw (slide out)
 * - Draw (slide in) - raises pitch by semitone
 */

export interface NoteMapping {
  hole: number;
  action: 'blow' | 'draw';
  slide: boolean;
  display: string;
  octave: number;
  enharmonic?: string;
}

// Complete note mappings for 12-hole chromatic harmonica
export const NOTE_MAPPINGS: Record<string, NoteMapping> = {
  // --- OCTAVE 1 (Holes 1-4) - C4 to B4 ---
  'C4':  { hole: 1, action: 'blow', slide: false, display: 'C', octave: 4 },
  'C#4': { hole: 1, action: 'blow', slide: true,  display: 'C#', octave: 4 },
  'Db4': { hole: 1, action: 'blow', slide: true,  display: 'Db', octave: 4, enharmonic: 'C#4' },
  'D4':  { hole: 1, action: 'draw', slide: false, display: 'D', octave: 4 },
  'D#4': { hole: 1, action: 'draw', slide: true,  display: 'D#', octave: 4 },
  'Eb4': { hole: 1, action: 'draw', slide: true,  display: 'Eb', octave: 4, enharmonic: 'D#4' },
  'E4':  { hole: 2, action: 'blow', slide: false, display: 'E', octave: 4 },
  'F4':  { hole: 2, action: 'draw', slide: false, display: 'F', octave: 4 },
  'E#4': { hole: 2, action: 'draw', slide: false, display: 'E#', octave: 4, enharmonic: 'F4' },
  'F#4': { hole: 2, action: 'draw', slide: true,  display: 'F#', octave: 4 },
  'Gb4': { hole: 2, action: 'draw', slide: true,  display: 'Gb', octave: 4, enharmonic: 'F#4' },
  'G4':  { hole: 3, action: 'blow', slide: false, display: 'G', octave: 4 },
  'G#4': { hole: 3, action: 'blow', slide: true,  display: 'G#', octave: 4 },
  'Ab4': { hole: 3, action: 'blow', slide: true,  display: 'Ab', octave: 4, enharmonic: 'G#4' },
  'A4':  { hole: 3, action: 'draw', slide: false, display: 'A', octave: 4 },
  'A#4': { hole: 3, action: 'draw', slide: true,  display: 'A#', octave: 4 },
  'Bb4': { hole: 3, action: 'draw', slide: true,  display: 'Bb', octave: 4, enharmonic: 'A#4' },
  'B4':  { hole: 4, action: 'draw', slide: false, display: 'B', octave: 4 },
  'Cb5': { hole: 4, action: 'draw', slide: false, display: 'Cb', octave: 4, enharmonic: 'B4' },

  // --- OCTAVE 2 (Holes 5-8) - C5 to B5 ---
  'C5':  { hole: 5, action: 'blow', slide: false, display: 'C', octave: 5 },
  'B#4': { hole: 5, action: 'blow', slide: false, display: 'B#', octave: 5, enharmonic: 'C5' },
  'C#5': { hole: 5, action: 'blow', slide: true,  display: 'C#', octave: 5 },
  'Db5': { hole: 5, action: 'blow', slide: true,  display: 'Db', octave: 5, enharmonic: 'C#5' },
  'D5':  { hole: 5, action: 'draw', slide: false, display: 'D', octave: 5 },
  'D#5': { hole: 5, action: 'draw', slide: true,  display: 'D#', octave: 5 },
  'Eb5': { hole: 5, action: 'draw', slide: true,  display: 'Eb', octave: 5, enharmonic: 'D#5' },
  'E5':  { hole: 6, action: 'blow', slide: false, display: 'E', octave: 5 },
  'F5':  { hole: 6, action: 'draw', slide: false, display: 'F', octave: 5 },
  'E#5': { hole: 6, action: 'draw', slide: false, display: 'E#', octave: 5, enharmonic: 'F5' },
  'F#5': { hole: 6, action: 'draw', slide: true,  display: 'F#', octave: 5 },
  'Gb5': { hole: 6, action: 'draw', slide: true,  display: 'Gb', octave: 5, enharmonic: 'F#5' },
  'G5':  { hole: 7, action: 'blow', slide: false, display: 'G', octave: 5 },
  'G#5': { hole: 7, action: 'blow', slide: true,  display: 'G#', octave: 5 },
  'Ab5': { hole: 7, action: 'blow', slide: true,  display: 'Ab', octave: 5, enharmonic: 'G#5' },
  'A5':  { hole: 7, action: 'draw', slide: false, display: 'A', octave: 5 },
  'A#5': { hole: 7, action: 'draw', slide: true,  display: 'A#', octave: 5 },
  'Bb5': { hole: 7, action: 'draw', slide: true,  display: 'Bb', octave: 5, enharmonic: 'A#5' },
  'B5':  { hole: 8, action: 'draw', slide: false, display: 'B', octave: 5 },

  // --- OCTAVE 3 (Holes 9-12) - C6 to B6 ---
  'C6':  { hole: 9, action: 'blow', slide: false, display: 'C', octave: 6 },
  'B#5': { hole: 9, action: 'blow', slide: false, display: 'B#', octave: 6, enharmonic: 'C6' },
  'C#6': { hole: 9, action: 'blow', slide: true,  display: 'C#', octave: 6 },
  'Db6': { hole: 9, action: 'blow', slide: true,  display: 'Db', octave: 6, enharmonic: 'C#6' },
  'D6':  { hole: 9, action: 'draw', slide: false, display: 'D', octave: 6 },
  'D#6': { hole: 9, action: 'draw', slide: true,  display: 'D#', octave: 6 },
  'Eb6': { hole: 9, action: 'draw', slide: true,  display: 'Eb', octave: 6, enharmonic: 'D#6' },
  'E6':  { hole: 10, action: 'blow', slide: false, display: 'E', octave: 6 },
  'F6':  { hole: 10, action: 'draw', slide: false, display: 'F', octave: 6 },
  'E#6': { hole: 10, action: 'draw', slide: false, display: 'E#', octave: 6, enharmonic: 'F6' },
  'F#6': { hole: 10, action: 'draw', slide: true,  display: 'F#', octave: 6 },
  'Gb6': { hole: 10, action: 'draw', slide: true,  display: 'Gb', octave: 6, enharmonic: 'F#6' },
  'G6':  { hole: 11, action: 'blow', slide: false, display: 'G', octave: 6 },
  'G#6': { hole: 11, action: 'blow', slide: true,  display: 'G#', octave: 6 },
  'Ab6': { hole: 11, action: 'blow', slide: true,  display: 'Ab', octave: 6, enharmonic: 'G#6' },
  'A6':  { hole: 11, action: 'draw', slide: false, display: 'A', octave: 6 },
  'A#6': { hole: 11, action: 'draw', slide: true,  display: 'A#', octave: 6 },
  'Bb6': { hole: 11, action: 'draw', slide: true,  display: 'Bb', octave: 6, enharmonic: 'A#6' },
  'B6':  { hole: 12, action: 'draw', slide: false, display: 'B', octave: 6 },

  // --- HIGH RANGE (Hole 12) - C7+ ---
  'C7':  { hole: 12, action: 'blow', slide: false, display: 'C', octave: 7 },
  'C#7': { hole: 12, action: 'blow', slide: true,  display: 'C#', octave: 7 },
  'Db7': { hole: 12, action: 'blow', slide: true,  display: 'Db', octave: 7, enharmonic: 'C#7' },
  'D7':  { hole: 12, action: 'draw', slide: true,  display: 'D', octave: 7 },
};

// Note frequencies in Hz (A4 = 440Hz standard tuning)
export const NOTE_FREQUENCIES: Record<string, number> = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 
  'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 
  'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 
  'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 
  'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 
  'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 
  'A#6': 1864.66, 'B6': 1975.53,
  'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32
};

// MIDI note numbers for SoundFont playback
export const NOTE_TO_MIDI: Record<string, number> = {
  'C4': 60, 'C#4': 61, 'D4': 62, 'D#4': 63, 'E4': 64, 'F4': 65, 'F#4': 66, 
  'G4': 67, 'G#4': 68, 'A4': 69, 'A#4': 70, 'B4': 71,
  'C5': 72, 'C#5': 73, 'D5': 74, 'D#5': 75, 'E5': 76, 'F5': 77, 'F#5': 78, 
  'G5': 79, 'G#5': 80, 'A5': 81, 'A#5': 82, 'B5': 83,
  'C6': 84, 'C#6': 85, 'D6': 86, 'D#6': 87, 'E6': 88, 'F6': 89, 'F#6': 90, 
  'G6': 91, 'G#6': 92, 'A6': 93, 'A#6': 94, 'B6': 95,
  'C7': 96, 'C#7': 97, 'D7': 98
};

// Reverse mapping: MIDI to Note
export const MIDI_TO_NOTE: Record<number, string> = Object.fromEntries(
  Object.entries(NOTE_TO_MIDI).map(([note, midi]) => [midi, note])
);

// All chromatic notes in order
export const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Flat to Sharp equivalents
export const FLAT_TO_SHARP: Record<string, string> = {
  'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 
  'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B'
};

// Sharp to Flat equivalents
export const SHARP_TO_FLAT: Record<string, string> = {
  'C#': 'Db', 'D#': 'Eb', 'E#': 'F', 'F#': 'Gb', 
  'G#': 'Ab', 'A#': 'Bb', 'B#': 'C'
};

/**
 * Get harmonica tablature info for a given note
 */
export function getNoteMapping(note: string): NoteMapping | null {
  // Try direct lookup first
  if (NOTE_MAPPINGS[note]) {
    return NOTE_MAPPINGS[note];
  }
  
  // Try with normalized sharp notation
  const normalized = normalizeToSharp(note);
  return NOTE_MAPPINGS[normalized] || null;
}

/**
 * Convert flat notation to sharp notation
 */
export function normalizeToSharp(note: string): string {
  // Extract components
  const match = note.match(/^([A-Ga-g])([#b])?(\d)?$/);
  if (!match) return note;
  
  let [, letter, accidental, octave] = match;
  letter = letter.toUpperCase();
  octave = octave || '4';
  
  if (accidental === 'b') {
    const flatKey = letter + 'b';
    if (FLAT_TO_SHARP[flatKey]) {
      const sharpNote = FLAT_TO_SHARP[flatKey];
      // Handle octave shift for Cb -> B
      if (flatKey === 'Cb') {
        return `${sharpNote}${parseInt(octave) - 1}`;
      }
      return `${sharpNote}${octave}`;
    }
  }
  
  return `${letter}${accidental || ''}${octave}`;
}

/**
 * Get MIDI note number for a note name
 */
export function getMidiNote(note: string): number | undefined {
  const normalized = normalizeToSharp(note);
  return NOTE_TO_MIDI[normalized];
}

/**
 * Get frequency for a note
 */
export function getFrequency(note: string): number | null {
  const normalized = normalizeToSharp(note);
  return NOTE_FREQUENCIES[normalized] ?? null;
}

/**
 * Transpose a note by semitones
 */
export function transposeNote(note: string, semitones: number): string | null {
  const midi = getMidiNote(note);
  if (midi === undefined) return null;
  
  const newMidi = midi + semitones;
  return MIDI_TO_NOTE[newMidi] || null;
}

/**
 * Calculate interval between two notes in semitones
 */
export function getInterval(note1: string, note2: string): number | null {
  const midi1 = getMidiNote(note1);
  const midi2 = getMidiNote(note2);
  if (midi1 === undefined || midi2 === undefined) return null;
  return midi2 - midi1;
}
