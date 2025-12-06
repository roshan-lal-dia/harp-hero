import { useState, useEffect } from 'react';
import { useAppStore } from './store/appStore';
import audioEngine from './utils/audioEngine';

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

function App() {
  const { 
    showPlan, 
    parseAndLoadSequence,
    inputText,
    updatePracticeStats,
    showSettings,
    toggleSettings,
    settings
  } = useAppStore();
  
  const [showMetronome, setShowMetronome] = useState(false);
  const [showSongBrowser, setShowSongBrowser] = useState(false);
  const [showPiano, setShowPiano] = useState(false);

  // Parse initial input on mount
  useEffect(() => {
    parseAndLoadSequence(inputText);
  }, []);

  // Load selected soundfont on mount and when the choice changes
  useEffect(() => {
    audioEngine.applySoundFont(settings.soundFont as 'basic' | 'full').catch((err) => {
      console.warn('SoundFont load failed, using fallback synth', err);
    });
  }, [settings.soundFont]);

  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      updatePracticeStats({ time: 1 }); // Add 1 second
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [updatePracticeStats]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Header */}
      <Header onMetronomeClick={() => setShowMetronome(true)} />

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
                className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700/50 rounded-lg transition-colors text-sm text-slate-300"
              >
                📚 Browse Song Library
              </button>
              <button 
                onClick={() => setShowMetronome(true)}
                className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700/50 rounded-lg transition-colors text-sm text-slate-300"
              >
                🎵 Open Metronome
              </button>
              <button 
                onClick={toggleSettings}
                className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700/50 rounded-lg transition-colors text-sm text-slate-300"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <footer className="text-center text-xs text-slate-600 py-4 border-t border-slate-800">
          <p>HarpHero — Chromatic Harmonica Learning App</p>
          <p className="mt-1">
            Built for 12-hole chromatic harmonica in C • Solo tuning
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
    </div>
  );
}

export default App;