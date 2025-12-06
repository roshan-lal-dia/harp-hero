import { Note, NoteDuration } from './noteParser';
import { NOTE_MAPPINGS, getMidiNote } from './noteMappings';

/**
 * Pitch mapping for LilyPond absolute mode
 * Middle C (C4) is represented as 'c' in LilyPond absolute mode (usually).
 * However, often c' is used for C4.
 * Let's assume standard:
 * c = C3
 * c' = C4
 * c'' = C5
 * 
 * Note Names:
 * c, d, e, f, g, a, b
 * 
 * Accidentals:
 * is = sharp (cis)
 * es = flat (ces)
 */

// Regex for parsing a single LilyPond note token
// Group 1: Pitch (a-g)
// Group 2: Accidental (is, es, iss, ess)
// Group 3: Octave marks (' or ,)
// Group 4: Duration (1, 2, 4, 8, 16...)
// Group 5: Dotted (.)
const LILY_REGEX = /^([a-g])(is|es|iss|ess)?([',]*)?(\d+)?(\.)?$/i;

export function parseLilyPondSequence(input: string): Note[] {
  if (!input || typeof input !== 'string') return [];

  // Clean input: remove comments %... and { ... } (simple approximation)
  let cleaned = input.replace(/%.*$/gm, ''); 
  // cleaned = cleaned.replace(/\relative\s+\w+\s*{/, ''); // Ignore relative block start for now
  // cleaned = cleaned.replace(/}/, ''); // Ignore block end

  // Split by whitespace
  const tokens = cleaned.trim().split(/\s+/);
  const sequence: Note[] = [];
  
  let measureNumber = 1;
  let beatInMeasure = 0;
  let lastDuration: NoteDuration = { beats: 1, dotted: false, triplet: false, value: 4 }; // Default quarter note

  tokens.forEach((token, index) => {
    if (!token) return;
    
    // Handle bar checks
    if (token === '|') {
      measureNumber++;
      beatInMeasure = 0;
      return;
    }

    // Handle rests
    if (token.startsWith('r')) {
      // Parse rest duration similar to notes
      const durationMatch = token.match(/^r(\d+)?(\.)?$/);
      let duration = { ...lastDuration };
      
      if (durationMatch) {
        if (durationMatch[1]) {
          const val = parseInt(durationMatch[1]);
          duration = { 
            beats: 4 / val * (durationMatch[2] ? 1.5 : 1), 
            dotted: !!durationMatch[2], 
            triplet: false, 
            value: val 
          };
          lastDuration = duration;
        }
      }

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

    const match = token.match(LILY_REGEX);
    if (match) {
      const [, letter, accidental, octaveStr, durationStr, dottedStr] = match;

      // 1. Pitch
      let noteName = letter.toUpperCase();
      
      // 2. Accidental
      let accidentalSymbol = '';
      if (accidental === 'is') accidentalSymbol = '#';
      else if (accidental === 'es') accidentalSymbol = 'b';
      else if (accidental === 'iss') accidentalSymbol = 'x'; // Double sharp (unsupported map)
      else if (accidental === 'ess') accidentalSymbol = 'bb'; // Double flat

      // 3. Octave
      // Base octave for 'c' is usually C3.
      // ' = +1 octave, , = -1 octave
      let octave = 3; 
      if (octaveStr) {
        const up = (octaveStr.match(/'/g) || []).length;
        const down = (octaveStr.match(/,/g) || []).length;
        octave += (up - down);
      }

      // Convert Flat to Sharp for mapping lookup
      let lookupNote = noteName + accidentalSymbol + octave;
      
      // Manual flat conversion if needed (simple version)
      if (accidentalSymbol === 'b') {
        // This logic should ideally use the noteMappings normalization, 
        // but let's reconstruct the "Sharp" equivalent manually or rely on normalizeNote
        // e.g., Db4 -> C#4
      }

      // 4. Duration
      let duration = { ...lastDuration };
      if (durationStr) {
        const val = parseInt(durationStr);
        duration = { 
          beats: 4 / val * (dottedStr ? 1.5 : 1), 
          dotted: !!dottedStr, 
          triplet: false, 
          value: val 
        };
        lastDuration = duration;
      }

      // Construct Note Object
      // We'll use the existing normalization from noteParser to handle the sharp conversion
      // We construct a "Raw" string that noteParser.normalizeNote likes: "C#4"
      
      // Handle "es" (flat) specifically before sending to normalizer
      let rawPitch = noteName + (accidentalSymbol === 'b' ? 'b' : accidentalSymbol) + octave;
      
      // Map to app's Note structure
      // We can actually reuse `parseNoteEntry` logic if we format the string right,
      // OR just construct the object directly.
      
      // Let's construct a "Standard" string "C#4"
      const normalizedPitch = normalizeLilyPondPitch(noteName, accidentalSymbol, octave);
      const midi = getMidiNote(normalizedPitch);
      const mapping = NOTE_MAPPINGS[normalizedPitch];

      if (mapping) {
        sequence.push({
          id: index,
          raw: token,
          pitch: normalizedPitch,
          ...mapping,
          duration,
          measure: measureNumber,
          beat: beatInMeasure,
          midi: midi,
          isRest: false
        });
      } else {
        sequence.push({
          id: index,
          raw: token,
          error: true,
          errorMessage: `Unknown mapping: ${rawPitch}`,
          duration,
          measure: measureNumber,
          beat: beatInMeasure
        });
      }
      
      beatInMeasure += duration.beats;
    }
  });

  return sequence;
}

function normalizeLilyPondPitch(letter: string, accidental: string, octave: number): string {
  // Simple flat to sharp conversion for our hash map
  // C b -> B (octave - 1)
  // D b -> C#
  // E b -> D#
  // F b -> E
  // G b -> F#
  // A b -> G#
  // B b -> A#
  
  if (accidental === 'b') {
    const flatMap: Record<string, string> = { 
      'C': 'B', 'D': 'C#', 'E': 'D#', 'F': 'E', 'G': 'F#', 'A': 'G#', 'B': 'A#'
    };
    
    const mappedLetter = flatMap[letter];
    let mappedOctave = octave;
    if (letter === 'C') mappedOctave -= 1;
    
    return mappedLetter + mappedOctave;
  }
  
  return letter + accidental + octave;
}
