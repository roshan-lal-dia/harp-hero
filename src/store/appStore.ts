import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { parseNoteSequence, calculateTiming, Note } from '../utils/noteParser';
import { parseLilyPondSequence } from '../utils/lilyPondParser';
import { parseMusicXml, parseMusicXmlFromBuffer } from '../utils/musicXmlParser';
import { DEFAULT_SONG, Song } from '../utils/songLibrary';
import { generateLearningPlan, DayPlan } from '../utils/learningPlan';

interface AppState {
  // Sequence State
  inputText: string;
  sequence: Note[];
  currentIndex: number;
  
  // Transient State (for Piano/Free Play)
  transientNote: Note | null;

  // Playback State
  isPlaying: boolean;
  bpm: number;
  volume: number;
  
  // UI State
  activeTab: 'play' | 'learn' | 'songs' | 'settings';
  showPlan: boolean;
  showMetronome: boolean;
  showSettings: boolean;
  practiceMode: 'normal' | 'slow' | 'loop';
  
  // Learning State
  currentDay: number;
  completedDays: number[];
  practiceStats: {
    totalTime: number;
    sessionsCompleted: number;
    notesPlayed: number;
  };
  
  // Song State
  currentSong: Song;
  
  // Settings
  settings: {
    soundFont: string;
    showNoteNames: boolean;
    showOctave: boolean;
    highlightSlide: boolean;
    autoScroll: boolean;
    countIn: boolean;
    loopEnabled: boolean;
    loopStart: number;
    loopEnd: number;
  };
  
  // Actions
  setInputText: (text: string) => void;
  setSequence: (notes: Note[]) => void;
  parseAndLoadSequence: (text?: string | null) => Note[];
  loadMusicXml: (xml: string) => Note[];
  loadMusicXmlBuffer: (buffer: ArrayBuffer) => Promise<Note[]>;
  setCurrentIndex: (index: number) => void;
  setTransientNote: (note: Note | null) => void;
  nextNote: () => void;
  prevNote: () => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setBpm: (bpm: number) => void;
  setVolume: (volume: number) => void;
  setActiveTab: (tab: 'play' | 'learn' | 'songs' | 'settings') => void;
  togglePlan: () => void;
  toggleMetronome: () => void;
  toggleSettings: () => void;
  setPracticeMode: (mode: 'normal' | 'slow' | 'loop') => void;
  loadSong: (song: Song) => void;
  setCurrentDay: (day: number) => void;
  completeDay: (day: number) => void;
  updatePracticeStats: (stats: { time?: number; sessions?: number; notes?: number }) => void;
  updateSettings: (newSettings: Partial<AppState['settings']>) => void;
  setLoop: (start: number, end: number) => void;
  clearLoop: () => void;
  getCurrentNote: () => Note | null;
  getLearningPlan: () => DayPlan[];
  getProgress: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Sequence State
      inputText: DEFAULT_SONG.notes,
      sequence: [],
      currentIndex: 0,
      transientNote: null,
      
      // Playback State
      isPlaying: false,
      bpm: 120,
      volume: 75,
      
      // UI State
      activeTab: 'play', // 'play', 'learn', 'songs', 'settings'
      showPlan: false,
      showMetronome: false,
      showSettings: false,
      practiceMode: 'normal', // 'normal', 'slow', 'loop'
      
      // Learning State
      currentDay: 1,
      completedDays: [],
      practiceStats: {
        totalTime: 0,
        sessionsCompleted: 0,
        notesPlayed: 0
      },
      
      // Song State
      currentSong: DEFAULT_SONG,
      
      // Settings
      settings: {
        soundFont: 'basic',
        showNoteNames: true,
        showOctave: true,
        highlightSlide: true,
        autoScroll: true,
        countIn: true,
        loopEnabled: false,
        loopStart: 0,
        loopEnd: 0
      },
      
      // Actions
      setInputText: (text) => set({ inputText: text }),

      setSequence: (notes) => {
        const bpm = get().bpm;
        const timedSequence = calculateTiming(notes, bpm);
        set({
            sequence: timedSequence,
            currentIndex: 0,
            isPlaying: false
        });
      },
      
      parseAndLoadSequence: (text = null) => {
        const inputText = text || get().inputText;
        let parsed: Note[];

        const trimmed = inputText.trim();
        const looksLikeMusicXml = trimmed.startsWith('<score-partwise') || trimmed.includes('<measure');

        // Simple heuristic for formats
        if (looksLikeMusicXml) {
          parsed = parseMusicXml(inputText);
        } else if (inputText.includes("'") || inputText.includes("\\") || inputText.includes("{")) {
          parsed = parseLilyPondSequence(inputText);
        } else {
          parsed = parseNoteSequence(inputText);
        }

        const bpm = get().bpm;
        const timedSequence = calculateTiming(parsed, bpm);
        set({
          sequence: timedSequence,
          currentIndex: 0,
          isPlaying: false,
          inputText: text || get().inputText
        });
        return timedSequence;
      },

      loadMusicXml: (xml) => {
        const parsed = parseMusicXml(xml);
        const bpm = get().bpm;
        const timedSequence = calculateTiming(parsed, bpm);
        set({
          sequence: timedSequence,
          currentIndex: 0,
          isPlaying: false
        });
        return timedSequence;
      },

      loadMusicXmlBuffer: async (buffer) => {
        const parsed = await parseMusicXmlFromBuffer(buffer);
        const bpm = get().bpm;
        const timedSequence = calculateTiming(parsed, bpm);
        set({
          sequence: timedSequence,
          currentIndex: 0,
          isPlaying: false
        });
        return timedSequence;
      },
      
      setCurrentIndex: (index) => {
        const { sequence } = get();
        if (index >= 0 && index < sequence.length) {
          set({ currentIndex: index });
        }
      },

      setTransientNote: (note) => set({ transientNote: note }),
      
      nextNote: () => {
        const { currentIndex, sequence, settings } = get();
        const nextIndex = currentIndex + 1;
        
        // Loop handling
        if (settings.loopEnabled && nextIndex > settings.loopEnd) {
          set({ currentIndex: settings.loopStart });
          return;
        }
        
        if (nextIndex >= sequence.length) {
          set({ isPlaying: false, currentIndex: 0 });
          return;
        }
        
        set({ currentIndex: nextIndex });
      },
      
      prevNote: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
          set({ currentIndex: currentIndex - 1, isPlaying: false });
        }
      },
      
      togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },
      
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      stop: () => set({ isPlaying: false, currentIndex: 0 }),
      
      setBpm: (bpm) => {
        set({ bpm });
        // Recalculate timing
        const { sequence, inputText } = get();
        if (sequence.length > 0) {
          let parsed: Note[];
          if (inputText.includes("'") || inputText.includes("\\") || inputText.includes("{")) {
             parsed = parseLilyPondSequence(inputText);
          } else {
             parsed = parseNoteSequence(inputText);
          }
          
          const timedSequence = calculateTiming(parsed, bpm);
          set({ sequence: timedSequence });
        }
      },
      
      setVolume: (volume) => set({ volume }),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      togglePlan: () => set((state) => ({ showPlan: !state.showPlan })),
      
      toggleMetronome: () => set((state) => ({ showMetronome: !state.showMetronome })),

      toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
      
      setPracticeMode: (mode) => set({ practiceMode: mode }),
      
      loadSong: (song) => {
        set({
          currentSong: song,
          inputText: song.notes,
          bpm: song.bpm || 120
        });
        get().parseAndLoadSequence(song.notes);
      },
      
      // Learning actions
      setCurrentDay: (day) => set({ currentDay: day }),
      
      completeDay: (day) => {
        set((state) => ({
          completedDays: [...new Set([...state.completedDays, day])],
          currentDay: Math.min(day + 1, 15)
        }));
      },
      
      updatePracticeStats: (stats) => {
        set((state) => ({
          practiceStats: {
            totalTime: state.practiceStats.totalTime + (stats.time || 0),
            sessionsCompleted: state.practiceStats.sessionsCompleted + (stats.sessions || 0),
            notesPlayed: state.practiceStats.notesPlayed + (stats.notes || 0)
          }
        }));
      },
      
      // Settings actions
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      
      setLoop: (start, end) => {
        set((state) => ({
          settings: {
            ...state.settings,
            loopEnabled: true,
            loopStart: start,
            loopEnd: end
          }
        }));
      },
      
      clearLoop: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            loopEnabled: false,
            loopStart: 0,
            loopEnd: 0
          }
        }));
      },
      
      // Getters
      getCurrentNote: () => {
        const { currentIndex, sequence, transientNote, isPlaying } = get();
        // If user is interacting with Piano (not playing song), show that
        if (!isPlaying && transientNote) {
            return transientNote;
        }
        return sequence[currentIndex] || null;
      },
      
      getLearningPlan: () => {
        const { bpm } = get();
        return generateLearningPlan(null, bpm);
      },
      
      getProgress: () => {
        const { currentIndex, sequence } = get();
        if (sequence.length === 0) return 0;
        return ((currentIndex + 1) / sequence.length) * 100;
      }
    }),
    {
      name: 'harp-hero-storage',
      partialize: (state) => ({
        settings: state.settings,
        completedDays: state.completedDays,
        practiceStats: state.practiceStats,
        currentDay: state.currentDay,
        bpm: state.bpm,
        volume: state.volume
      })
    }
  )
);

export default useAppStore;