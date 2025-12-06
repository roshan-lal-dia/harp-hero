import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { parseNoteSequence, calculateTiming, Note } from '../utils/noteParser';
import { parseLilyPondSequence } from '../utils/lilyPondParser';
import { parseMusicXml, parseMusicXmlFromBuffer } from '../utils/musicXmlParser';
import { DEFAULT_SONG, Song } from '../utils/songLibrary';
import { generateLearningPlan, DayPlan } from '../utils/learningPlan';

// Achievement definitions
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-note', name: 'First Note', description: 'Play your first note', icon: '🎵' },
  { id: 'first-song', name: 'Song Starter', description: 'Complete your first song', icon: '🎶' },
  { id: 'ten-songs', name: 'Melody Master', description: 'Complete 10 different songs', icon: '🏅' },
  { id: 'practice-streak-3', name: 'Consistent Player', description: 'Practice 3 days in a row', icon: '🔥' },
  { id: 'practice-streak-7', name: 'Week Warrior', description: 'Practice 7 days in a row', icon: '💪' },
  { id: 'practice-streak-30', name: 'Monthly Master', description: 'Practice 30 days in a row', icon: '👑' },
  { id: 'hour-played', name: 'Dedicated', description: 'Practice for 1 hour total', icon: '⏱️' },
  { id: 'five-hours', name: 'Enthusiast', description: 'Practice for 5 hours total', icon: '🌟' },
  { id: 'slide-master', name: 'Slide Master', description: 'Play 100 notes with slide', icon: '🎹' },
  { id: 'chromatic-complete', name: 'Chromatic Champion', description: 'Play all 12 chromatic notes', icon: '🌈' },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete a song at 150+ BPM', icon: '⚡' },
  { id: 'perfect-run', name: 'Perfect Run', description: 'Complete a song without stopping', icon: '✨' },
  { id: 'explorer', name: 'Explorer', description: 'Try songs from 5 different categories', icon: '🗺️' },
  { id: 'night-owl', name: 'Night Owl', description: 'Practice after midnight', icon: '🦉' },
  { id: 'early-bird', name: 'Early Bird', description: 'Practice before 7 AM', icon: '🐦' },
];

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
  showAchievements: boolean;
  showStats: boolean;
  
  // Learning State
  currentDay: number;
  completedDays: number[];
  practiceStats: {
    totalTime: number;
    sessionsCompleted: number;
    notesPlayed: number;
    slideNotesPlayed: number;
    songsCompleted: number;
    perfectRuns: number;
    categoriesExplored: string[];
    notesPlayedToday: number;
    uniqueNotesPlayed: string[];
  };
  
  // Achievement & Streak State
  achievements: string[];
  practiceStreak: number;
  lastPracticeDate: string | null;
  completedSongs: string[];
  
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
    slowPracticeRatio: number;
    showKeyboardShortcuts: boolean;
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
  toggleAchievements: () => void;
  toggleStats: () => void;
  setPracticeMode: (mode: 'normal' | 'slow' | 'loop') => void;
  loadSong: (song: Song) => void;
  setCurrentDay: (day: number) => void;
  completeDay: (day: number) => void;
  updatePracticeStats: (stats: { time?: number; sessions?: number; notes?: number; slideNotes?: number; noteName?: string }) => void;
  completeSong: (songId: string) => void;
  recordPerfectRun: () => void;
  updateSettings: (newSettings: Partial<AppState['settings']>) => void;
  setLoop: (start: number, end: number) => void;
  clearLoop: () => void;
  getCurrentNote: () => Note | null;
  getLearningPlan: () => DayPlan[];
  getProgress: () => number;
  getAchievements: () => Achievement[];
  checkAndUnlockAchievements: () => void;
  updatePracticeStreak: () => void;
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
      showAchievements: false,
      showStats: false,
      
      // Learning State
      currentDay: 1,
      completedDays: [],
      practiceStats: {
        totalTime: 0,
        sessionsCompleted: 0,
        notesPlayed: 0,
        slideNotesPlayed: 0,
        songsCompleted: 0,
        perfectRuns: 0,
        categoriesExplored: [],
        notesPlayedToday: 0,
        uniqueNotesPlayed: []
      },
      
      // Achievement & Streak State
      achievements: [],
      practiceStreak: 0,
      lastPracticeDate: null,
      completedSongs: [],
      
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
        loopEnd: 0,
        slowPracticeRatio: 0.5,
        showKeyboardShortcuts: true
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
        // Track category exploration
        const category = song.category;
        const { practiceStats } = get();
        if (!practiceStats.categoriesExplored.includes(category)) {
          set((state) => ({
            practiceStats: {
              ...state.practiceStats,
              categoriesExplored: [...state.practiceStats.categoriesExplored, category]
            }
          }));
        }
        get().checkAndUnlockAchievements();
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
        const { practiceStats } = get();
        const newUniqueNotes = stats.noteName && !practiceStats.uniqueNotesPlayed.includes(stats.noteName)
          ? [...practiceStats.uniqueNotesPlayed, stats.noteName]
          : practiceStats.uniqueNotesPlayed;
        
        set((state) => ({
          practiceStats: {
            ...state.practiceStats,
            totalTime: state.practiceStats.totalTime + (stats.time || 0),
            sessionsCompleted: state.practiceStats.sessionsCompleted + (stats.sessions || 0),
            notesPlayed: state.practiceStats.notesPlayed + (stats.notes || 0),
            slideNotesPlayed: state.practiceStats.slideNotesPlayed + (stats.slideNotes || 0),
            notesPlayedToday: state.practiceStats.notesPlayedToday + (stats.notes || 0),
            uniqueNotesPlayed: newUniqueNotes
          }
        }));
        
        // Check for first note achievement
        if (stats.notes && stats.notes > 0) {
          get().updatePracticeStreak();
          get().checkAndUnlockAchievements();
        }
      },
      
      completeSong: (songId) => {
        const { completedSongs, bpm } = get();
        if (!completedSongs.includes(songId)) {
          set({
            completedSongs: [...completedSongs, songId]
          });
        }
        set((state) => ({
          practiceStats: {
            ...state.practiceStats,
            songsCompleted: state.practiceStats.songsCompleted + 1
          }
        }));
        
        // Check for speed achievement
        if (bpm >= 150) {
          const { achievements } = get();
          if (!achievements.includes('speed-demon')) {
            set({ achievements: [...achievements, 'speed-demon'] });
          }
        }
        
        get().checkAndUnlockAchievements();
      },
      
      recordPerfectRun: () => {
        set((state) => ({
          practiceStats: {
            ...state.practiceStats,
            perfectRuns: state.practiceStats.perfectRuns + 1
          }
        }));
        const { achievements } = get();
        if (!achievements.includes('perfect-run')) {
          set({ achievements: [...achievements, 'perfect-run'] });
        }
      },
      
      toggleAchievements: () => set((state) => ({ showAchievements: !state.showAchievements })),
      toggleStats: () => set((state) => ({ showStats: !state.showStats })),
      
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
      
      // Achievement system
      checkAndUnlockAchievements: () => {
        const { achievements, practiceStats, completedSongs, practiceStreak } = get();
        const newAchievements = [...achievements];
        
        // First note
        if (practiceStats.notesPlayed >= 1 && !achievements.includes('first-note')) {
          newAchievements.push('first-note');
        }
        
        // First song
        if (practiceStats.songsCompleted >= 1 && !achievements.includes('first-song')) {
          newAchievements.push('first-song');
        }
        
        // 10 songs
        if (completedSongs.length >= 10 && !achievements.includes('ten-songs')) {
          newAchievements.push('ten-songs');
        }
        
        // Practice streaks
        if (practiceStreak >= 3 && !achievements.includes('practice-streak-3')) {
          newAchievements.push('practice-streak-3');
        }
        if (practiceStreak >= 7 && !achievements.includes('practice-streak-7')) {
          newAchievements.push('practice-streak-7');
        }
        if (practiceStreak >= 30 && !achievements.includes('practice-streak-30')) {
          newAchievements.push('practice-streak-30');
        }
        
        // Time played (totalTime is in minutes)
        if (practiceStats.totalTime >= 60 && !achievements.includes('hour-played')) {
          newAchievements.push('hour-played');
        }
        if (practiceStats.totalTime >= 300 && !achievements.includes('five-hours')) {
          newAchievements.push('five-hours');
        }
        
        // Slide notes
        if (practiceStats.slideNotesPlayed >= 100 && !achievements.includes('slide-master')) {
          newAchievements.push('slide-master');
        }
        
        // Chromatic (all 12 notes)
        if (practiceStats.uniqueNotesPlayed.length >= 12 && !achievements.includes('chromatic-complete')) {
          newAchievements.push('chromatic-complete');
        }
        
        // Explorer (5 categories)
        if (practiceStats.categoriesExplored.length >= 5 && !achievements.includes('explorer')) {
          newAchievements.push('explorer');
        }
        
        // Time-based achievements
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5 && !achievements.includes('night-owl')) {
          newAchievements.push('night-owl');
        }
        if (hour >= 5 && hour < 7 && !achievements.includes('early-bird')) {
          newAchievements.push('early-bird');
        }
        
        if (newAchievements.length !== achievements.length) {
          set({ achievements: newAchievements });
        }
      },
      
      updatePracticeStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastPracticeDate, practiceStreak } = get();
        
        if (lastPracticeDate === today) {
          return; // Already practiced today
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastPracticeDate === yesterdayStr) {
          // Consecutive day
          set({
            practiceStreak: practiceStreak + 1,
            lastPracticeDate: today,
            practiceStats: {
              ...get().practiceStats,
              notesPlayedToday: 0
            }
          });
        } else {
          // Streak broken or first practice
          set({
            practiceStreak: 1,
            lastPracticeDate: today,
            practiceStats: {
              ...get().practiceStats,
              notesPlayedToday: 0
            }
          });
        }
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
      },
      
      getAchievements: () => {
        const { achievements } = get();
        return ACHIEVEMENTS.map(a => ({
          ...a,
          unlockedAt: achievements.includes(a.id) ? Date.now() : undefined
        }));
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
        volume: state.volume,
        achievements: state.achievements,
        practiceStreak: state.practiceStreak,
        lastPracticeDate: state.lastPracticeDate,
        completedSongs: state.completedSongs
      })
    }
  )
);

export default useAppStore;