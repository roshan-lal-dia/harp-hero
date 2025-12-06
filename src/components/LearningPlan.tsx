import React, { useMemo } from 'react';
import { CheckCircle2, Circle, Clock, Target, BookOpen } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { generateLearningPlan, getDailyDrills } from '../utils/learningPlan';

const LearningPlan = () => {
  const { 
    bpm, 
    currentDay, 
    completedDays, 
    setCurrentDay, 
    completeDay,
    practiceStats 
  } = useAppStore();

  const plan = useMemo(() => generateLearningPlan(null, bpm), [bpm]);
  const drills = getDailyDrills();

  const getDayStatus = (day) => {
    if (completedDays.includes(day)) return 'completed';
    if (day === currentDay) return 'current';
    if (day < currentDay) return 'skipped';
    return 'upcoming';
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-amber-500/10 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-amber-500 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            15-Day Learning Path
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">Day {currentDay}</div>
            <div className="text-xs text-slate-400">{completedDays.length}/15 completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
            style={{ width: `${(completedDays.length / 15) * 100}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-slate-900/50 rounded-lg">
            <div className="text-lg font-bold text-white">{Math.floor(practiceStats.totalTime / 60)}m</div>
            <div className="text-[10px] text-slate-400 uppercase">Total Practice</div>
          </div>
          <div className="text-center p-3 bg-slate-900/50 rounded-lg">
            <div className="text-lg font-bold text-white">{practiceStats.sessionsCompleted}</div>
            <div className="text-[10px] text-slate-400 uppercase">Sessions</div>
          </div>
          <div className="text-center p-3 bg-slate-900/50 rounded-lg">
            <div className="text-lg font-bold text-white">{practiceStats.notesPlayed}</div>
            <div className="text-[10px] text-slate-400 uppercase">Notes Played</div>
          </div>
        </div>
      </div>

      {/* Daily Drills Quick Access */}
      <div className="p-4 border-b border-slate-700 bg-slate-900/30">
        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-amber-500" />
          Daily Drills
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {[...drills.warmup, ...drills.technique].map((drill, i) => (
            <div key={i} className="flex-shrink-0 bg-slate-800 rounded-lg p-3 border border-slate-700 min-w-[140px]">
              <div className="text-xs font-bold text-slate-200">{drill.name}</div>
              <div className="text-[10px] text-slate-500 mt-1">{drill.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Day List */}
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {plan.map((day, i) => {
          const dayNum = day.day;
          const status = getDayStatus(dayNum);
          const isExpanded = dayNum === currentDay;
          
          return (
            <div 
              key={i}
              className={`border-b border-slate-700/50 transition-all ${
                isExpanded ? 'bg-slate-700/30' : 'hover:bg-slate-700/20'
              }`}
            >
              <button
                onClick={() => setCurrentDay(dayNum)}
                className="w-full p-4 flex items-start gap-4 text-left"
              >
                {/* Day Number & Status */}
                <div className="flex-shrink-0">
                  {status === 'completed' ? (
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  ) : status === 'current' ? (
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center animate-pulse">
                      <span className="text-slate-900 font-bold">{dayNum}</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <Circle className="w-5 h-5 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400 text-sm">Day {dayNum}</span>
                    <span className="text-slate-400 text-sm">—</span>
                    <span className="text-white font-medium">{day.title}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{day.focus}</div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                      {/* Warmup */}
                      <div>
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Warm-up</h4>
                        <p className="text-sm text-slate-300">{day.warmup}</p>
                      </div>

                      {/* Exercises */}
                      <div>
                        <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Exercises</h4>
                        <ul className="space-y-1">
                          {day.exercises.map((ex, j) => (
                            <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-slate-600">•</span>
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Song Work */}
                      <div>
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Song Work</h4>
                        <p className="text-sm text-slate-300">{day.songWork}</p>
                      </div>

                      {/* Tips */}
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                        <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <BookOpen className="w-3 h-3" />
                          Tips
                        </h4>
                        <ul className="space-y-1">
                          {day.tips.map((tip, j) => (
                            <li key={j} className="text-xs text-slate-400 flex items-start gap-2">
                              <span className="text-green-500">✓</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Duration & Complete Button */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Clock className="w-3 h-3" />
                          {day.duration}
                        </div>
                        
                        {status !== 'completed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              completeDay(dayNum);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPlan;
