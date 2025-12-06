import { Music, BookOpen, Timer, Settings, BarChart2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface HeaderProps {
  onMetronomeClick: () => void;
}

const Header = ({ onMetronomeClick }: HeaderProps) => {
  const { 
    showPlan, 
    togglePlan,
    currentSong,
    practiceStats,
    toggleSettings
  } = useAppStore();

  return (
    <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-20 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-lg text-slate-900 shadow-lg shadow-amber-500/20">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 leading-none flex items-center gap-2">
              HarpHero
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-normal">
                v1.0
              </span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                Chromatic 12-Hole • C4 Solo
              </span>
              {currentSong && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] text-slate-400">
                    {currentSong.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-400 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
              <span>{Math.floor(practiceStats.totalTime / 60)}m practiced</span>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span className="text-slate-300 font-bold">{practiceStats.notesPlayed}</span> notes
            </div>
          </div>

          {/* Metronome Button */}
          <button
            onClick={onMetronomeClick}
            className="flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors text-slate-200"
            title="Open Metronome"
          >
            <Timer className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Metronome</span>
          </button>

          {/* Learning Plan Button */}
          <button
            onClick={togglePlan}
            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${
              showPlan 
                ? 'bg-amber-500 text-slate-900 hover:bg-amber-600' 
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{showPlan ? 'Close Plan' : 'Practice Plan'}</span>
          </button>

          {/* Settings */}
          <button
            onClick={toggleSettings}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
