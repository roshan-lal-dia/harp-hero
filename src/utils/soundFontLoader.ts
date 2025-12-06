/**
 * SoundFont Loader Utility
 * Loads SF2 SoundFont files for realistic harmonica sounds
 */

import * as Tone from 'tone';

class SoundFontLoader {
  constructor() {
    this.loaded = false;
    this.samples = new Map();
    this.sampler = null;
    this.audioContext = null;
  }

  /**
   * Initialize the audio context
   */
  async init() {
    if (this.audioContext) return;
    await Tone.start();
    this.audioContext = Tone.context.rawContext;
  }

  /**
   * Load a SoundFont file
   * Note: Browser SF2 loading is complex - this provides a framework
   * For production, consider using pre-converted audio samples
   */
  async loadSF2(url) {
    try {
      await this.init();
      console.log('Attempting to load SoundFont from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch SoundFont: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log('SoundFont file loaded, size:', arrayBuffer.byteLength);

      // SF2 files need special parsing - this is a placeholder
      // In production, you'd use a library like sf2-parser or js-synthesizer
      // For now, we'll create a synthetic harmonica sound

      this.loaded = true;
      return true;
    } catch (error) {
      console.warn('Could not load SoundFont, using synthesized sound:', error);
      return false;
    }
  }

  /**
   * Create a harmonica-like sampler using Tone.js
   * This is a fallback when SF2 loading isn't available
   */
  createSynthSampler() {
    // Create a custom synth that mimics harmonica timbre
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'fatsawtooth',
        count: 3,
        spread: 20,
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.8,
        release: 0.3,
      },
    });

    // Add effects for realism
    const vibrato = new Tone.Vibrato({
      frequency: 5,
      depth: 0.08,
    });

    const filter = new Tone.Filter({
      frequency: 2000,
      type: 'lowpass',
      rolloff: -12,
    });

    const reverb = new Tone.Reverb({
      decay: 1.2,
      wet: 0.15,
    });

    // Chain effects
    synth.chain(vibrato, filter, reverb, Tone.Destination);

    return synth;
  }

  /**
   * Get a playable sampler/synth
   */
  getInstrument() {
    if (this.sampler) {
      return this.sampler;
    }
    return this.createSynthSampler();
  }

  /**
   * Dispose all resources
   */
  dispose() {
    if (this.sampler) {
      this.sampler.dispose();
      this.sampler = null;
    }
    this.samples.clear();
    this.loaded = false;
  }
}

// Singleton instance
export const soundFontLoader = new SoundFontLoader();

/**
 * Convert MIDI note number to note name
 */
export function midiToNote(midi) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const note = notes[midi % 12];
  return `${note}${octave}`;
}

/**
 * Convert note name to MIDI number
 */
export function noteToMidi(note) {
  const notes = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
  const match = note.match(/^([A-G])(#|b)?(\d)$/);
  if (!match) return null;

  let [, letter, accidental, octave] = match;
  let midi = notes[letter] + (parseInt(octave) + 1) * 12;

  if (accidental === '#') midi += 1;
  if (accidental === 'b') midi -= 1;

  return midi;
}

export default soundFontLoader;
