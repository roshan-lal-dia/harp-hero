import { X, Trophy, Lock, Flame, Clock, Music, Star } from 'lucide-react';
import { useAppStore, ACHIEVEMENTS } from '../store/appStore';

const AchievementsPanel = () => {
  const {
    achievements,
    toggleAchievements,
    practiceStreak,
    practiceStats,
    completedSongs
  } = useAppStore();

  const unlockedCount = achievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-amber-900/20 to-slate-900">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="text-lg font-bold text-white">Achievements</h2>
              <p className="text-sm text-slate-400">{unlockedCount} of {totalCount} unlocked</p>
            </div>
          </div>
          <button
            onClick={toggleAchievements}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close achievements"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-bold text-amber-400">{Math.round(progressPercent)}%</span>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-3 px-6 py-4 bg-slate-800/30 border-b border-slate-700">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xl font-bold">{practiceStreak}</span>
            </div>
            <p className="text-xs text-slate-500">Day Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xl font-bold">{Math.floor(practiceStats.totalTime / 60)}h</span>
            </div>
            <p className="text-xs text-slate-500">Practice Time</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <Music className="w-4 h-4" />
              <span className="text-xl font-bold">{completedSongs.length}</span>
            </div>
            <p className="text-xs text-slate-500">Songs Completed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
              <Star className="w-4 h-4" />
              <span className="text-xl font-bold">{practiceStats.notesPlayed.toLocaleString()}</span>
            </div>
            <p className="text-xs text-slate-500">Notes Played</p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = achievements.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-900/30 to-slate-800 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-800/50 border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-3xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${isUnlocked ? 'text-amber-300' : 'text-slate-500'}`}>
                          {achievement.name}
                        </h3>
                        {!isUnlocked && <Lock className="w-3 h-3 text-slate-600" />}
                      </div>
                      <p className={`text-xs mt-1 ${isUnlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  {isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Keep practicing to unlock more achievements!
            </p>
            <button
              onClick={toggleAchievements}
              className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold text-sm hover:bg-amber-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPanel;
