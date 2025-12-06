import { Lightbulb, X } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';

const SongTips = () => {
  const { currentSong } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!currentSong || !currentSong.tips || currentSong.tips.length === 0) {
    return null;
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 z-30 bg-amber-500 text-slate-900 p-3 rounded-full shadow-lg hover:bg-amber-400 transition-all hover:scale-105"
        title="Show Tips"
      >
        <Lightbulb className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-30 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-amber-400">
          <Lightbulb className="w-4 h-4" />
          <span className="font-bold text-sm">Tips for {currentSong.name}</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <ul className="space-y-2">
        {currentSong.tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 pt-3 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Difficulty: {'★'.repeat(currentSong.difficulty)}{'☆'.repeat(5 - currentSong.difficulty)}</span>
          <span>BPM: {currentSong.bpm}</span>
        </div>
      </div>
    </div>
  );
};

export default SongTips;
