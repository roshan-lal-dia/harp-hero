import { useState, useEffect } from 'react';
import { useAppStore } from './store/appStore';
import audioEngine from './utils/audioEngine';
import { useKeyboardShortcuts, KEYBOARD_SHORTCUTS } from './hooks/useKeyboardShortcuts';

// Components
import Header from './components/Header';
import HarmonicaVisualizer from './components/HarmonicaVisualizer';
import PlaybackControls from './components/PlaybackControls';
import TabViewer from './components/TabViewer';
import NoteInput from './components/NoteInput';
import LearningPlan from './components/LearningPlan';
import Metronome from './components/Metronome';
import SongBrowser from './components/SongBrowser';
import SequenceStats from './components/SequenceStats';
import SettingsPanel from './components/SettingsPanel';
import Piano from './components/Piano';
import AchievementsPanel from './components/AchievementsPanel';
import BreathTrainer from './components/BreathTrainer';
import SongTips from './components/SongTips';

function App() {
  const { 
    showPlan, 
    parseAndLoadSequence,
    inputText,
    updatePracticeStats,
    showSettings,
    showAchievements,
    toggleAchievements,
    practiceStreak,
    achievements,
    settings
  } = useAppStore();
  
  const [showMetronome, setShowMetronome] = useState(false);
  const [showSongBrowser, setShowSongBrowser] = useState(false);
  const [showPiano, setShowPiano] = useState(false);
  const [showBreathTrainer, setShowBreathTrainer] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Parse initial input on mount
  useEffect(() => {
    parseAndLoadSequence(inputText);
  }, []);

  // Load selected soundfont on mount and when the choice changes
  useEffect(() => {
    audioEngine.applySoundFont(settings.soundFont as 'basic' | 'full' | 'synth').catch((err) => {
      console.warn('SoundFont load failed, using fallback synth', err);
    });
  }, [settings.soundFont]);

  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      updatePracticeStats({ time: 1 }); // Add 1 minute
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [updatePracticeStats]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Header */}
      <Header onMetronomeClick={() => setShowMetronome(true)} />

      {/* Streak Banner (shown when streak >= 3) */}
      {practiceStreak >= 3 && (
        <div className="bg-gradient-to-r from-amber-600/20 via-orange-500/20 to-amber-600/20 border-b border-amber-500/30">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-amber-400">
            <span className="text-lg">🔥</span>
            <span className="font-bold">{practiceStreak} Day Streak!</span>
            <span className="text-sm text-amber-500/80">Keep it going!</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Learning Plan Panel */}
        {showPlan && (
          <div className="animate-in slide-in-from-top-4 duration-300">
            <LearningPlan />
          </div>
        )}

        {/* Main Visualizer Section */}
        <section className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} />
          </div>

          {/* Visualizer Content */}
          <div className="relative z-10">
            <div className="flex flex-col items-center justify-center min-h-[320px] gap-6">
              <HarmonicaVisualizer />
            </div>

            {/* Playback Controls */}
            <PlaybackControls />

            {/* Piano Toggle */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPiano((v) => !v)}
                className="text-sm px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                {showPiano ? 'Hide Piano' : 'Show Piano'}
              </button>
            </div>
            {showPiano && (
              <div className="mt-4">
                <Piano />
              </div>
            )}
          </div>
        </section>

        {/* Two Column Layout: Input & Tab Viewer */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <NoteInput />

          {/* Tab Viewer */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-md flex flex-col h-[380px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-300">Generated Tablature</h3>
              <span className={`text-xs px-2 py-1 rounded ${settings.autoScroll ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 bg-slate-900'}`}>
                Auto-scroll {settings.autoScroll ? 'on' : 'off'}
              </span>
            </div>
            <TabViewer />
          </div>
        </section>

        {/* Statistics Section */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SequenceStats />
          </div>
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-md">
            <h3 className="text-sm font-bold text-slate-300 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setShowSongBrowser(true)}
                className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700/50 rounded-lg transition-colors text-sm text-slate-300 flex items-center gap-2"
              >
                <span>📚</span> Browse Song Library
                <span className="ml-auto text-xs text-slate-500">50+ songs</span>
              </button>
              <button 
                onClick={() => setShowMetronome(true)}
                className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700/50 rounded-lg transition-colors text-sm text-slate-300 flex items-center gap-2"
              >
                <span>🎵</span> Open Metronome
              </button>
              <button 
                onClick={() => setShowBreathTrainer(true)}
                className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700/50 rounded-lg transition-colors text-sm text-slate-300 flex items-center gap-2"
              >
                <span>💨</span> Breath Training
                <span className="ml-auto text-xs text-cyan-500">New!</span>
              </button>
              <button 
                onClick={toggleAchievements}
                className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700/50 rounded-lg transition-colors text-sm text-slate-300 flex items-center gap-2"
              >
                <span>🏆</span> Achievements
                <span className="ml-auto text-xs text-amber-400">{achievements.length} unlocked</span>
              </button>
              <button 
                onClick={() => setShowShortcutsHelp(true)}
                className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700/50 rounded-lg transition-colors text-sm text-slate-300 flex items-center gap-2"
              >
                <span>⌨️</span> Keyboard Shortcuts
              </button>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <footer className="text-center text-xs text-slate-600 py-4 border-t border-slate-800">
          <p>HarpHero — Chromatic Harmonica Learning App</p>
          <p className="mt-1">
            Built for 12-hole chromatic harmonica in C • Solo tuning • 50+ songs included
          </p>
        </footer>
      </main>

      {/* Metronome Modal */}
      {showMetronome && (
        <Metronome onClose={() => setShowMetronome(false)} />
      )}

      {/* Song Browser Modal */}
      {showSongBrowser && (
        <SongBrowser 
          isOpen={showSongBrowser} 
          onClose={() => setShowSongBrowser(false)} 
        />
      )}

      {/* Settings Modal */}
      {showSettings && <SettingsPanel />}

      {/* Achievements Modal */}
      {showAchievements && <AchievementsPanel />}

      {/* Breath Trainer Modal */}
      {showBreathTrainer && <BreathTrainer onClose={() => setShowBreathTrainer(false)} />}

      {/* Song Tips Overlay */}
      <SongTips />

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcutsHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowShortcutsHelp(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>⌨️</span> Keyboard Shortcuts
            </h2>
            <div className="space-y-2">
              {KEYBOARD_SHORTCUTS.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                  <span className="text-slate-300">{shortcut.action}</span>
                  <kbd className="px-2 py-1 rounded bg-slate-700 text-amber-400 font-mono text-sm">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowShortcutsHelp(false)}
              className="mt-6 w-full py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;