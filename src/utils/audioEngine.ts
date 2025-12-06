/**
 * SoundFont-based Audio Engine for Harmonica Playback
 * Uses Web Audio API with SoundFont support
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

class AudioEngine {
  private initialized: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private spessaSynth: any | null;
  private synth: Tone.PolySynth | null;
  private volume: number; // dB
  private vibrato: Tone.Vibrato | null;
  private reverb: Tone.Reverb | null;
  private filter: Tone.Filter | null;
  private useSoundFont: boolean;
  private currentSoundFont: string | null;
  private spessaCtx: AudioContext | null;

  constructor() {
    this.initialized = false;
    this.spessaSynth = null;
    this.synth = null;
    this.volume = -6; // dB
    this.vibrato = null;
    this.reverb = null;
    this.filter = null;
    this.useSoundFont = false;
    this.currentSoundFont = null;
    this.spessaCtx = null;
  }

  /**
   * Initialize the audio engine
   */
  async initialize() {
    if (this.initialized) return;

    try {
      await Tone.start();
      
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
      if (this.vibrato && this.filter && this.reverb) {
          this.synth.chain(this.vibrato, this.filter, this.reverb, Tone.Destination);
      }
      
      this.synth.volume.value = this.volume;
      this.initialized = true;
      
      console.log('Audio engine initialized');
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
   * Apply a named soundfont (basic/full) by loading the corresponding asset.
   */
  async applySoundFont(choice: 'basic' | 'full'): Promise<boolean> {
    const map: Record<'basic' | 'full', string> = {
      basic: '/harmonica%20soundfont/harmonica%20basic%20soundfont.sf2',
      full: '/harmonica%20soundfont/harmonica%20full%20soundfont.sf2'
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

    // Fallback to Tone.js
    const freq = getFrequency(note);
    if (!freq) {
      console.warn('Unknown note:', note);
      return;
    }

    if (this.synth) {
      const now = Tone.now();
      this.synth.triggerAttackRelease(freq, duration, now, velocity);
    }
  }

  /**
   * Play a note with blow/draw articulation
   */
  async playHarmonicaNote(noteInfo: Note, duration = 0.5) {
    if (!noteInfo || noteInfo.error) return;
    if (!noteInfo.pitch) return;

    const { pitch, action, slide } = noteInfo;
    
    // Adjust velocity based on action
    const velocity = action === 'blow' ? 0.75 : 0.7;
    const attackTime = slide ? 0.08 : 0.05;

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

    // Fallback
    const freq = getFrequency(pitch);
    if (!freq) return;

    if (this.synth) {
      this.synth.set({
          envelope: {
          attack: attackTime
          }
      });

      const now = Tone.now();
      this.synth.triggerAttackRelease(freq, duration, now, velocity);
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
          } else if (this.synth) {
              this.synth.triggerAttackRelease(freq, duration * 0.9, Tone.now(), velocity);
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
    if (this.synth) {
      this.synth.releaseAll();
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
    if (this.synth) {
      this.synth.volume.value = db;
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
    if (this.synth) {
      this.synth.dispose();
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
    this.spessaSynth = null;
    this.initialized = false;
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();

export default audioEngine;