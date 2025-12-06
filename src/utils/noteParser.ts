import { NOTE_MAPPINGS, FLAT_TO_SHARP, getMidiNote } from './noteMappings';

export interface NoteDuration {
  beats: number;
  dotted: boolean;
  triplet: boolean;
  value?: number;
}

export interface Note {
  id: number;
  raw: string;
  isRest?: boolean;
  duration: NoteDuration;
  measure: number;
  beat: number;
  pitch?: string;
  hole?: number;
  action?: string;
  slide?: boolean;
  display?: string;
  octave?: number;
  dynamics?: string;
  midi?: number;
  error?: boolean;
  errorMessage?: string;
  time?: number;
  durationSec?: number;
}

/**
 * Parse a note string and normalize it
 * Handles various input formats: C4, C#4, Db4, C4, c4, C, c#, etc.
 */
export function normalizeNote(note: string): string | null {
  if (!note || typeof note !== 'string') return null;
  
  let clean = note.trim().toUpperCase();
  
  // Handle double flats/sharps (rare but possible)
  clean = clean.replace(/##/g, 'x'); // Double sharp placeholder
  clean = clean.replace(/BB/g, 'bb'); // Double flat placeholder
  
  // Convert flats to sharps for consistent processing
  for (const [flat, sharp] of Object.entries(FLAT_TO_SHARP)) {
    if (clean.includes(flat.toUpperCase())) {
      clean = clean.replace(flat.toUpperCase(), sharp);
    }
  }
  
  // Remove any invalid characters but preserve note letters, #, and numbers
  clean = clean.replace(/[^A-G#0-9]/g, '');
  
  // If no octave specified, default to octave 4 (middle register)
  if (!/\d/.test(clean)) {
    clean += '4';
  }
  
  // Validate the result
  const match = clean.match(/^([A-G])(#)?(\d)$/);
  if (!match) return null;
  
  return clean;
}

/**
 * Parse duration notation
 * Examples: "4" = quarter note, "8" = eighth note, "2" = half note
 * "4." = dotted quarter, "4t" = quarter triplet
 */
export function parseDuration(durationStr: string | undefined): NoteDuration {
  if (!durationStr) return { beats: 1, dotted: false, triplet: false };
  
  const str = durationStr.toString().toLowerCase();
  const dotted = str.includes('.');
  const triplet = str.includes('t');
  const baseValue = parseInt(str.replace(/[.t]/g, '')) || 4;
  
  // Convert note value to beats (assuming quarter note = 1 beat)
  let beats = 4 / baseValue;
  
  if (dotted) beats *= 1.5;
  if (triplet) beats *= 2/3;
  
  return { beats, dotted, triplet, value: baseValue };
}

/**
 * Parse a complete note entry with optional duration and dynamics
 * Format: "C4:4" (note:duration), "C4" (note only), "C4:4:mf" (note:duration:dynamics)
 */
export function parseNoteEntry(entry: string): Omit<Note, 'id' | 'measure' | 'beat'> | null {
  if (!entry || typeof entry !== 'string') return null;
  
  const parts = entry.trim().split(':');
  const noteStr = parts[0];
  const durationStr = parts[1];
  const dynamics = parts[2];
  
  const normalizedNote = normalizeNote(noteStr);
  if (!normalizedNote) return null;
  
  const mapping = NOTE_MAPPINGS[normalizedNote];
  if (!mapping) return null;
  
  const duration = parseDuration(durationStr);
  
  return {
    pitch: normalizedNote,
    raw: entry,
    ...mapping,
    duration,
    dynamics: dynamics || 'mf',
    midi: getMidiNote(normalizedNote)
  };
}

/**
 * Parse a full sequence of notes
 * Supports multiple formats:
 * - Space separated: "C4 D4 E4"
 * - Pipe separated measures: "C4 D4 | E4 F4"
 * - With durations: "C4:4 D4:8 E4:8"
 * - Line breaks for phrases
 */
export function parseNoteSequence(inputString: string): Note[] {
  if (!inputString || typeof inputString !== 'string') return [];
  
  // Normalize line breaks and clean up
  const cleaned = inputString
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, ' | ')  // Convert line breaks to measure markers
    .trim();
  
  // Split by whitespace and pipes
  const tokens = cleaned.split(/[\s|]+/).filter(t => t.length > 0);
  
  const sequence: Note[] = [];
  let measureNumber = 1;
  let beatInMeasure = 0;
  
  tokens.forEach((token, index) => {
    // Skip pure pipe markers (already handled in split)
    if (token === '|') {
      measureNumber++;
      beatInMeasure = 0;
      return;
    }
    
    // Check for rest notation
    if (token.toLowerCase() === 'r' || token.toLowerCase().startsWith('rest')) {
      const duration = parseDuration(token.split(':')[1]);
      sequence.push({
        id: index,
        raw: token,
        isRest: true,
        duration,
        measure: measureNumber,
        beat: beatInMeasure
      });
      beatInMeasure += duration.beats;
      return;
    }
    
    // Parse the note
    const parsed = parseNoteEntry(token);
    
    if (parsed) {
      const duration = parsed.duration ?? { beats: 1, dotted: false, triplet: false };
      const note: Note = {
        id: index,
        ...parsed,
        raw: parsed.raw ?? token,
        duration,
        measure: measureNumber,
        beat: beatInMeasure
      };
      sequence.push(note);
      beatInMeasure += duration.beats;
    } else {
      // Invalid note - mark as error but keep for display
      sequence.push({
        id: index,
        raw: token,
        error: true,
        errorMessage: `Invalid note: "${token}"`,
        duration: { beats: 1, dotted: false, triplet: false },
        measure: measureNumber,
        beat: beatInMeasure
      });
      beatInMeasure += 1;
    }
    
    // Check for measure overflow (assuming 4/4 time)
    if (beatInMeasure >= 4) {
      measureNumber++;
      beatInMeasure = beatInMeasure % 4;
    }
  });
  
  return sequence;
}

/**
 * Calculate timing information for a sequence at a given BPM
 */
export function calculateTiming(sequence: Note[], bpm: number): Note[] {
  const msPerBeat = 60000 / bpm;
  let currentTime = 0;
  
  return sequence.map(note => {
    const durationMs = (note.duration?.beats || 1) * msPerBeat;
    const result = {
      ...note,
      startTime: currentTime,
      endTime: currentTime + durationMs,
      durationMs
    };
    currentTime += durationMs;
    return result;
  });
}

/**
 * Get statistics about a parsed sequence
 */
export function getSequenceStats(sequence: Note[]) {
  const validNotes = sequence.filter(n => !n.error && !n.isRest);
  const errors = sequence.filter(n => n.error);
  const rests = sequence.filter(n => n.isRest);
  
  // Calculate note frequency
  const noteFrequency: Record<string, number> = {};
  validNotes.forEach(note => {
    const key = note.pitch!;
    noteFrequency[key] = (noteFrequency[key] || 0) + 1;
  });
  
  // Calculate hole usage
  const holeUsage: Record<number, number> = {};
  validNotes.forEach(note => {
    const key = note.hole!;
    holeUsage[key] = (holeUsage[key] || 0) + 1;
  });
  
  // Calculate slide usage
  const slideCount = validNotes.filter(n => n.slide).length;
  
  // Find range
  const midiNotes = validNotes.map(n => n.midi!).filter(m => m != null);
  const lowestNote = Math.min(...midiNotes);
  const highestNote = Math.max(...midiNotes);
  
  return {
    totalNotes: sequence.length,
    validNotes: validNotes.length,
    errors: errors.length,
    rests: rests.length,
    noteFrequency,
    holeUsage,
    slideCount,
    slidePercentage: validNotes.length > 0 ? (slideCount / validNotes.length * 100).toFixed(1) : 0,
    range: {
      lowest: lowestNote,
      highest: highestNote,
      span: highestNote - lowestNote
    },
    totalBeats: sequence.reduce((acc, n) => acc + (n.duration?.beats || 1), 0)
  };
}

/**
 * Transpose an entire sequence by semitones
 */
export function transposeSequence(sequence: Note[], semitones: number) {
  return sequence.map(note => {
    if (note.error || note.isRest || !note.midi) return note;
    // Simplified transposition; mapping lookup omitted for now
    return {
      ...note,
      transposed: semitones,
      originalPitch: note.pitch
    };
  });
}

/**
 * Validate a note is playable on chromatic harmonica
 */
export function validateNote(note: string) {
  const normalized = normalizeNote(note);
  if (!normalized) {
    return { valid: false, error: 'Invalid note format' };
  }
  
  const mapping = NOTE_MAPPINGS[normalized];
  if (!mapping) {
    return { valid: false, error: 'Note out of harmonica range' };
  }
  
  return { valid: true, mapping };
}

/**
 * Format a note for display with proper accidentals
 */
export function formatNoteDisplay(note: string | null | undefined, preferFlats = false): string {
  if (!note) return '';
  
  const match = note.match(/^([A-G])(#)?(\d)?$/i);
  if (!match) return note;
  
  const [, letter, sharp, octave] = match;
  
  if (sharp && preferFlats) {
    const flatMap: Record<'C#' | 'D#' | 'F#' | 'G#' | 'A#', string> = { 'C#': 'D♭', 'D#': 'E♭', 'F#': 'G♭', 'G#': 'A♭', 'A#': 'B♭' };
    const key = `${letter.toUpperCase()}#` as keyof typeof flatMap;
    const flatNote = flatMap[key];
    if (flatNote) return flatNote + (octave || '');
  }
  
  // Convert # to proper sharp symbol
  const displayNote = letter.toUpperCase() + (sharp ? '♯' : '');
  return displayNote + (octave || '');
}
