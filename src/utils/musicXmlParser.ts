import JSZip from 'jszip';
import { NOTE_MAPPINGS, NOTE_TO_MIDI, normalizeToSharp } from './noteMappings';
import { Note } from './noteParser';

interface DurationInfo {
  beats: number;
  dotted: boolean;
  triplet: boolean;
  value?: number;
}

function buildNote(
  pitch: string,
  duration: DurationInfo,
  id: number,
  measure: number,
  beat: number
): Note {
  const normalized = normalizeToSharp(pitch);
  const mapping = NOTE_MAPPINGS[normalized];
  if (!mapping) {
    return {
      id,
      raw: pitch,
      error: true,
      errorMessage: `No harmonica mapping for ${pitch}`,
      duration,
      measure,
      beat
    };
  }

  return {
    id,
    raw: pitch,
    pitch: normalized,
    ...mapping,
    duration,
    measure,
    beat,
    midi: NOTE_TO_MIDI[normalized]
  };
}

function parseDuration(divisions: number, durationStr: string | null): DurationInfo {
  const divisionsPerQuarter = divisions || 1;
  const raw = parseInt(durationStr || '0', 10);
  const beats = raw > 0 ? raw / divisionsPerQuarter : 1;
  return {
    beats,
    dotted: false,
    triplet: false,
    value: divisionsPerQuarter
  };
}

function tokenToPitch(step: string | null, alter: string | null, octave: string | null): string | null {
  if (!step || !octave) return null;
  const accidental = alter ? (parseInt(alter, 10) === -1 ? 'b' : parseInt(alter, 10) === 1 ? '#' : '') : '';
  return `${step.toUpperCase()}${accidental}${octave}`;
}

export function parseMusicXml(xml: string): Note[] {
  if (!xml || typeof xml !== 'string') return [];

  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(xml, 'application/xml');
  } catch (err) {
    console.error('MusicXML parse error', err);
    return [];
  }

  // Basic error detection
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    console.error('MusicXML parser error:', parserError.textContent);
    return [];
  }

  const measures = Array.from(doc.getElementsByTagName('measure'));
  const divisionsNode = doc.querySelector('divisions');
  const divisions = parseInt(divisionsNode?.textContent || '1', 10) || 1;

  const sequence: Note[] = [];
  let idCounter = 0;

  measures.forEach((measureEl, measureIdx) => {
    const measureNumber = measureIdx + 1;
    let beatInMeasure = 0;

    const notes = Array.from(measureEl.getElementsByTagName('note'));
    notes.forEach((noteEl) => {
      const isRest = !!noteEl.querySelector('rest');
      const durationText = noteEl.querySelector('duration')?.textContent || null;
      const duration = parseDuration(divisions, durationText);

      if (isRest) {
        sequence.push({
          id: idCounter++,
          raw: 'rest',
          isRest: true,
          duration,
          measure: measureNumber,
          beat: beatInMeasure
        });
        beatInMeasure += duration.beats;
        return;
      }

      const step = noteEl.querySelector('pitch > step')?.textContent || null;
      const alter = noteEl.querySelector('pitch > alter')?.textContent || null;
      const octave = noteEl.querySelector('pitch > octave')?.textContent || null;
      const pitch = tokenToPitch(step, alter, octave);

      if (pitch) {
        const noteObj = buildNote(pitch, duration, idCounter++, measureNumber, beatInMeasure);
        sequence.push(noteObj);
      }

      beatInMeasure += duration.beats;
    });
  });

  return sequence;
}

export default parseMusicXml;

/**
 * Parse compressed .mxl (MuseScore/MusicXML) files
 */
export async function parseMusicXmlFromBuffer(buffer: ArrayBuffer): Promise<Note[]> {
  try {
    const zip = await JSZip.loadAsync(buffer);

    const entries = Object.keys(zip.files);
    // Prefer .musicxml, then other .xml but skip container.xml
    const preferred = entries.find((key) => key.toLowerCase().endsWith('.musicxml'));
    const fallback = entries.find((key) => key.toLowerCase().endsWith('.xml') && !key.toLowerCase().includes('container.xml'));
    const xmlPath = preferred || fallback;

    if (!xmlPath) return [];

    const xmlContent = await zip.file(xmlPath)?.async('string');
    if (!xmlContent) return [];
    return parseMusicXml(xmlContent);
  } catch (err) {
    console.error('Failed to parse MXL', err);
    return [];
  }
}
