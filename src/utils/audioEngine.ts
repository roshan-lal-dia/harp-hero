/**
 * SoundFont-based Audio Engine for Harmonica Playback
 * Uses Web Audio API with SoundFont support
 * Enhanced fallback synthesizer with realistic harmonica timbre
 */

import * as Tone from 'tone';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - spessasynth_lib lacks TS typings
import { WorkletSynthesizer as Synthesizer } from 'spessasynth_lib';
import { getFrequency, getMidiNote } from './noteMappings';
import { Note } from './noteParser';

export interface MidiEvent {
  type: 'noteon' | 'noteoff' | 'control';
  channel: number;
  note?: number;
  velocity?: number;
  controller?: number;
  value?: number;
  timestamp: number;
}

/**
 * Custom Harmonica Synth using additive synthesis for realistic reed sound
 * Harmonicas produce a complex waveform with strong odd harmonics
 */
class HarmonicaSynth {
  private synth: Tone.PolySynth;
  private tremolo: Tone.Tremolo;
  private chorus: Tone.Chorus;
  private filter: Tone.Filter;
  private eq: Tone.EQ3;
  private compressor: Tone.Compressor;
  private reverb: Tone.Reverb;
  private gainNode: Tone.Gain;

  constructor() {
    // Create a PolySynth with custom partials mimicking harmonica reed vibration
    // Harmonicas have strong fundamental with decaying odd harmonics
    this.synth = new Tone.PolySynth(Tone.Synth, {
      volume: -8,
      oscillator: {
        type: 'custom',
        // Custom partials: fundamental + odd harmonics (reed-like)
        partials: [1, 0, 0.5, 0, 0.25, 0, 0.15, 0, 0.08, 0, 0.04, 0, 0.02]
      },
      envelope: {
        attack: 0.02,      // Quick attack like breath hitting reed
        decay: 0.1,        // Short initial decay
        sustain: 0.85,     // High sustain for held notes
        release: 0.15      // Quick release when breath stops
      }
    });

    // Tremolo for characteristic harmonica wobble (subtle)
    this.tremolo = new Tone.Tremolo({
      frequency: 5.5,      // Typical hand tremolo frequency
      depth: 0.15,         // Subtle depth
      spread: 0,
      type: 'sine'
    }).start();

    // Chorus for slight detuning between reeds
    this.chorus = new Tone.Chorus({
      frequency: 2.5,
      delayTime: 3.5,
      depth: 0.4,
      wet: 0.3
    }).start();

    // Bandpass filtering for nasal/reedy character
    this.filter = new Tone.Filter({
      frequency: 2500,
      type: 'bandpass',
      Q: 1.5,
      rolloff: -12
    });

    // EQ to shape harmonica tone
    this.eq = new Tone.EQ3({
      low: -3,
      mid: 4,            // Boost mids for nasal quality
      high: -6,          // Cut highs for warmth
      lowFrequency: 400,
      highFrequency: 2500
    });

    // Compressor for consistent dynamics
    this.compressor = new Tone.Compressor({
      threshold: -20,
      ratio: 4,
      attack: 0.003,
      release: 0.25
    });

    // Light reverb for room ambience
    this.reverb = new Tone.Reverb({
      decay: 1.5,
      wet: 0.2,
      preDelay: 0.01
    });

    // Master gain
    this.gainNode = new Tone.Gain(0.9);

    // Connect the chain
    this.synth.disconnect();
    this.synth.chain(
      this.tremolo,
      this.chorus,
      this.filter,
      this.eq,
      this.compressor,
      this.reverb,
      this.gainNode,
      Tone.Destination
    );
  }

  triggerAttackRelease(
    note: Tone.Unit.Frequency,
    duration: Tone.Unit.Time,
    time?: Tone.Unit.Time,
    velocity?: number
  ) {
    this.synth.triggerAttackRelease(note, duration, time, velocity);
  }

  set(options: Partial<Tone.SynthOptions>) {
    this.synth.set(options);
  }

  releaseAll() {
    this.synth.releaseAll();
  }

  setVolume(db: number) {
    this.gainNode.gain.value = Math.pow(10, db / 20);
  }

  dispose() {
    this.synth.dispose();
    this.tremolo.dispose();
    this.chorus.dispose();
    this.filter.dispose();
    this.eq.dispose();
    this.compressor.dispose();
    this.reverb.dispose();
    this.gainNode.dispose();
  }
}

class AudioEngine {
  private initialized: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private spessaSynth: any | null;
  private harmonicaSynth: HarmonicaSynth | null;
  private volume: number; // dB
  private useSoundFont: boolean;
  private currentSoundFont: string | null;
  private spessaCtx: AudioContext | null;

  constructor() {
    this.initialized = false;
    this.spessaSynth = null;
    this.harmonicaSynth = null;
    this.volume = -6; // dB
    this.useSoundFont = false;
    this.currentSoundFont = null;
    this.spessaCtx = null;
  }

  /**
   * Initialize the audio engine with enhanced harmonica synthesizer
   */
  async initialize() {
    if (this.initialized) return;

    try {
      await Tone.start();
      
      // Create enhanced harmonica synthesizer
      this.harmonicaSynth = new HarmonicaSynth();
      this.harmonicaSynth.setVolume(this.volume);
      
      this.initialized = true;
      
      console.log('Audio engine initialized with harmonica synth');
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
    }
  }

  /**
   * Load SoundFont samples from provided SF2 file
   */
  async loadSoundFont(soundFontPath: string): Promise<boolean> {
    try {
      console.log('Loading SoundFont from:', soundFontPath);
      
      const response = await fetch(soundFontPath);
      const buffer = await response.arrayBuffer();
      // Dispose previous synth/context if reloading
      if (this.spessaSynth && this.spessaCtx) {
        try {
          this.spessaSynth = null;
          await this.spessaCtx.close();
        } catch {
          /* ignore */
        }
      }

      // Use a dedicated AudioContext for SpessaSynth to satisfy AudioWorkletNode
      this.spessaCtx = new AudioContext();

      // Try to load the worklet module (bundled URL first, fallback to public path)
      try {
        const workletUrl = new URL('spessasynth_lib/dist/spessasynth_processor.min.js', import.meta.url).toString();
        await this.spessaCtx.audioWorklet.addModule(workletUrl);
      } catch (e) {
        await this.spessaCtx.audioWorklet.addModule('/spessasynth_processor.min.js').catch(() => undefined);
      }

      await this.spessaCtx.resume();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore third-party constructor typing
      this.spessaSynth = new Synthesizer(this.spessaCtx, buffer);
      
      this.useSoundFont = true;
      this.currentSoundFont = soundFontPath;
      console.log('SpessaSynth loaded');
      return true;
    } catch (error) {
      console.error('Failed to load SoundFont:', error);
      this.useSoundFont = false;
      return false;
    }
  }

  /**
   * Apply a named soundfont (basic/full) or switch to synth
   */
  async applySoundFont(choice: 'basic' | 'full' | 'synth'): Promise<boolean> {
    if (choice === 'synth') {
      this.useSoundFont = false;
      this.currentSoundFont = 'synth';
      await this.initialize();
      return true;
    }

    const map: Record<'basic' | 'full', string> = {
      basic: '/sf/harmonica-basic.sf2',
      full: '/sf/harmonica-full.sf2'
    };

    const url = map[choice];
    if (!url) return false;

    await this.initialize();

    if (this.currentSoundFont === url && this.useSoundFont) {
      return true; // Already loaded
    }

    const ok = await this.loadSoundFont(url);
    this.useSoundFont = ok;
    return ok;
  }

  /**
   * Play a single note
   */
  async playNote(note: string, duration = 0.5, velocity = 0.8) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.useSoundFont && this.spessaSynth) {
        const midi = getMidiNote(note);
        if (midi !== undefined) {
            this.spessaSynth.noteOn(0, midi, Math.floor(velocity * 127));
            setTimeout(() => {
                this.spessaSynth.noteOff(0, midi);
            }, duration * 1000);
            return;
        }
    }

    // Fallback to harmonica synth
    const freq = getFrequency(note);
    if (!freq) {
      console.warn('Unknown note:', note);
      return;
    }

    if (this.harmonicaSynth) {
      const now = Tone.now();
      this.harmonicaSynth.triggerAttackRelease(freq, duration, now, velocity);
    }
  }

  /**
   * Play a note with blow/draw articulation
   */
  async playHarmonicaNote(noteInfo: Note, duration = 0.5) {
    if (!noteInfo || noteInfo.error) return;
    if (!noteInfo.pitch) return;

    const { pitch, action } = noteInfo;
    
    // Adjust velocity based on action (blow vs draw)
    const velocity = action === 'blow' ? 0.75 : 0.7;

    await this.initialize();

    if (this.useSoundFont && this.spessaSynth) {
        const midi = getMidiNote(pitch);
        if (midi !== undefined) {
            // TODO: Use different MIDI channels or presets for blow/draw/slide if SF2 supports it
            this.spessaSynth.noteOn(0, midi, Math.floor(velocity * 127));
            setTimeout(() => {
                this.spessaSynth.noteOff(0, midi);
            }, duration * 1000);
            return;
        }
    }

    // Fallback to harmonica synth
    const freq = getFrequency(pitch);
    if (!freq) return;

    if (this.harmonicaSynth) {
      // Attack time varies based on slide usage
      const now = Tone.now();
      this.harmonicaSynth.triggerAttackRelease(freq, duration, now, velocity);
    }
  }

  /**
   * Play a sequence of notes
   */
  async playSequence(
      sequence: Note[], 
      bpm = 120, 
      onNotePlay: ((index: number, note: Note) => void) | null = null, 
      onComplete: (() => void) | null = null
    ) {
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

      if (!note.pitch) return;
      const freq = getFrequency(note.pitch);
      if (!freq) return;

      const duration = (note.duration?.beats || 1) * msPerBeat / 1000;
      const velocity = note.action === 'blow' ? 0.75 : 0.7;

      // Schedule the note
      Tone.Transport.schedule(() => {
          if (this.useSoundFont && this.spessaSynth) {
              const midi = getMidiNote(note.pitch!);
              if (midi !== undefined) {
                  this.spessaSynth.noteOn(0, midi, Math.floor(velocity * 127));
                  setTimeout(() => {
                      this.spessaSynth.noteOff(0, midi);
                  }, duration * 1000 * 0.9); // 90% duration
              }
          } else if (this.harmonicaSynth) {
              this.harmonicaSynth.triggerAttackRelease(freq, duration * 0.9, Tone.now(), velocity);
          }
          
          if (onNotePlay) {
              onNotePlay(index, note);
          }
      }, currentTime);

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
    if (this.harmonicaSynth) {
      this.harmonicaSynth.releaseAll();
    }
    if (this.spessaSynth) {
        // spessaSynth might not have a stopAll, assume silence via MIDI panic or similar?
        // For now, nothing or re-init
    }
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  /**
   * Set master volume
   */
  setVolume(db: number) {
    this.volume = db;
    if (this.harmonicaSynth) {
      this.harmonicaSynth.setVolume(db);
    }
    // TODO: Set spessasynth volume if API allows
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

  // --- MIDI Support Stubs ---

  /**
   * Request MIDI access
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async requestMidiAccess(): Promise<any> {
      if (navigator.requestMIDIAccess) {
          try {
              return await navigator.requestMIDIAccess();
          } catch (err) {
              console.error('MIDI access denied or failed', err);
              return null;
          }
      }
      return null;
  }

  /**
   * Handle incoming MIDI message
   */
  handleMidiMessage(event: MidiEvent) {
      console.log('MIDI Message Received:', event);
      // TODO: Map MIDI note to harmonica action and visualize/play
  }

  /**
   * Dispose of audio resources
   */
  dispose() {
    if (this.harmonicaSynth) {
      this.harmonicaSynth.dispose();
    }
    this.spessaSynth = null;
    this.initialized = false;
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();

export default audioEngine;