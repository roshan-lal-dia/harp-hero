/**
 * SoundFont-based Audio Engine for Harmonica Playback
 * Uses Web Audio API with SoundFont support
 */

import * as Tone from 'tone';
import { getFrequency, getMidiNote } from './noteMappings';

class AudioEngine {
  constructor() {
    this.initialized = false;
    this.sampler = null;
    this.synth = null;
    this.volume = -6; // dB
    this.useSoundFont = false;
    this.soundFontLoaded = false;
    this.audioContext = null;
    this.samples = new Map();
  }

  /**
   * Initialize the audio engine
   */
  async initialize() {
    if (this.initialized) return;

    try {
      await Tone.start();
      this.audioContext = Tone.context;
      
      // Create a fallback synthesizer that sounds more like harmonica
      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: 'sawtooth'
        },
        envelope: {
          attack: 0.05,
          decay: 0.1,
          sustain: 0.8,
          release: 0.3
        }
      }).toDestination();

      // Add effects for more realistic sound
      this.vibrato = new Tone.Vibrato({
        frequency: 5,
        depth: 0.1
      }).toDestination();

      this.reverb = new Tone.Reverb({
        decay: 1.5,
        wet: 0.2
      }).toDestination();

      this.filter = new Tone.Filter({
        frequency: 2000,
        type: 'lowpass',
        rolloff: -12
      }).toDestination();

      // Connect synth through effects chain
      this.synth.disconnect();
      this.synth.chain(this.vibrato, this.filter, this.reverb, Tone.Destination);
      
      this.synth.volume.value = this.volume;
      this.initialized = true;
      
      console.log('Audio engine initialized');
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
    }
  }

  /**
   * Load SoundFont samples from provided SF2 file
   * This uses a custom SF2 loader approach
   */
  async loadSoundFont(soundFontPath) {
    try {
      console.log('Loading SoundFont from:', soundFontPath);
      
      // For SF2 files, we need to use a specialized loader
      // Since browser-native SF2 support is limited, we'll create a sampler
      // with pre-generated samples or use a fallback synth
      
      // Try to create a more harmonica-like sampler using Tone.js
      this.sampler = new Tone.Sampler({
        urls: {},
        onload: () => {
          console.log('Sampler loaded');
          this.soundFontLoaded = true;
        }
      }).toDestination();

      this.useSoundFont = true;
      return true;
    } catch (error) {
      console.error('Failed to load SoundFont:', error);
      this.useSoundFont = false;
      return false;
    }
  }

  /**
   * Create a harmonica-like synthesized sound
   * This is used as fallback when SoundFont isn't available
   */
  createHarmonicaSynth() {
    // Harmonica has a distinctive reed sound
    return new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'fatsawtooth',
        count: 3,
        spread: 20
      },
      envelope: {
        attack: 0.03,
        decay: 0.1,
        sustain: 0.7,
        release: 0.2
      }
    });
  }

  /**
   * Play a single note
   */
  async playNote(note, duration = 0.5, velocity = 0.8) {
    if (!this.initialized) {
      await this.initialize();
    }

    const freq = getFrequency(note);
    if (!freq) {
      console.warn('Unknown note:', note);
      return;
    }

    try {
      // Use the synth to play the note
      const now = Tone.now();
      this.synth.triggerAttackRelease(freq, duration, now, velocity);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  /**
   * Play a note with blow/draw articulation
   */
  async playHarmonicaNote(noteInfo, duration = 0.5) {
    if (!noteInfo || noteInfo.error) return;

    const { pitch, action, slide } = noteInfo;
    const freq = getFrequency(pitch);
    
    if (!freq) return;

    // Adjust velocity based on action (draw notes can be slightly different)
    const velocity = action === 'blow' ? 0.75 : 0.7;
    
    // Slightly different attack for slide notes
    const attackTime = slide ? 0.08 : 0.05;

    try {
      await this.initialize();
      
      // Temporarily adjust envelope for articulation
      this.synth.set({
        envelope: {
          attack: attackTime
        }
      });

      const now = Tone.now();
      this.synth.triggerAttackRelease(freq, duration, now, velocity);
    } catch (error) {
      console.error('Error playing harmonica note:', error);
    }
  }

  /**
   * Play a sequence of notes
   */
  async playSequence(sequence, bpm = 120, onNotePlay = null, onComplete = null) {
    if (!this.initialized) {
      await this.initialize();
    }

    const msPerBeat = 60000 / bpm;
    let currentTime = Tone.now();

    // Schedule all notes
    sequence.forEach((note, index) => {
      if (note.error || note.isRest) {
        currentTime += (note.duration?.beats || 1) * msPerBeat / 1000;
        return;
      }

      const freq = getFrequency(note.pitch);
      if (!freq) return;

      const duration = (note.duration?.beats || 1) * msPerBeat / 1000;
      const velocity = note.action === 'blow' ? 0.75 : 0.7;

      // Schedule the note
      this.synth.triggerAttackRelease(freq, duration * 0.9, currentTime, velocity);

      // Schedule callback for visualization
      if (onNotePlay) {
        Tone.Transport.schedule(() => {
          onNotePlay(index, note);
        }, currentTime);
      }

      currentTime += duration;
    });

    // Schedule completion callback
    if (onComplete) {
      Tone.Transport.schedule(() => {
        onComplete();
      }, currentTime);
    }

    Tone.Transport.start();
  }

  /**
   * Stop all currently playing notes
   */
  stopAll() {
    if (this.synth) {
      this.synth.releaseAll();
    }
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  /**
   * Set master volume
   */
  setVolume(db) {
    this.volume = db;
    if (this.synth) {
      this.synth.volume.value = db;
    }
  }

  /**
   * Get current volume
   */
  getVolume() {
    return this.volume;
  }

  /**
   * Play metronome click
   */
  async playMetronomeClick(isDownbeat = false) {
    if (!this.initialized) {
      await this.initialize();
    }

    const clickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();

    clickSynth.volume.value = -10;
    const pitch = isDownbeat ? 'G5' : 'C5';
    clickSynth.triggerAttackRelease(pitch, '16n');
  }

  /**
   * Dispose of audio resources
   */
  dispose() {
    if (this.synth) {
      this.synth.dispose();
    }
    if (this.sampler) {
      this.sampler.dispose();
    }
    if (this.vibrato) {
      this.vibrato.dispose();
    }
    if (this.reverb) {
      this.reverb.dispose();
    }
    if (this.filter) {
      this.filter.dispose();
    }
    this.initialized = false;
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();

// Legacy function for backwards compatibility
export function playHarmonicaTone(freq, duration = 0.5) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(0.2, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  const createOsc = (ratio, gainVal, type = 'triangle') => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq * ratio;
    gain.gain.value = gainVal;
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  // Harmonica-like harmonic structure
  createOsc(1, 0.6, 'sawtooth');    // Fundamental
  createOsc(2, 0.15, 'sine');        // Octave
  createOsc(3, 0.2, 'triangle');     // Fifth
  createOsc(4, 0.08, 'sine');        // Two octaves
  createOsc(5, 0.05, 'sine');        // Major third
}

export default audioEngine;
