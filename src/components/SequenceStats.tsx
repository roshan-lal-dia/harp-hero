import React, { useMemo } from 'react';
import { BarChart2, Music, Target, Clock, TrendingUp, Award } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { getSequenceStats } from '../utils/noteParser';

const SequenceStats = () => {
  const { sequence, currentSong, practiceStats } = useAppStore();

  const stats = useMemo(() => {
    return getSequenceStats(sequence);
  }, [sequence]);

  if (sequence.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-md">
        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-amber-500" />
          Sequence Analysis
        </h3>
        <div className="text-center text-slate-500 py-8">
          <Music className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Load a song to see analysis</p>
        </div>
      </div>
    );
  }

  // Get most used notes
  const topNotes = Object.entries(stats.noteFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Get most used holes
  const topHoles = Object.entries(stats.holeUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-md">
      <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-amber-500" />
        Sequence Analysis
      </h3>

      {/* Overview Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{stats.validNotes}</div>
          <div className="text-[10px] text-slate-400 uppercase">Notes</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{stats.totalBeats.toFixed(1)}</div>
          <div className="text-[10px] text-slate-400 uppercase">Beats</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-500">{stats.slidePercentage}%</div>
          <div className="text-[10px] text-slate-400 uppercase">Slide Use</div>
        </div>
      </div>

      {/* Range Indicator */}
      <div className="mb-6">
        <div className="text-xs text-slate-400 mb-2">Note Range</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-cyan-400 font-mono">
            {stats.range.lowest ? `MIDI ${stats.range.lowest}` : '-'}
          </span>
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 rounded-full"
              style={{ width: `${Math.min(100, (stats.range.span / 24) * 100)}%` }}
            />
          </div>
          <span className="text-sm text-rose-400 font-mono">
            {stats.range.highest ? `MIDI ${stats.range.highest}` : '-'}
          </span>
        </div>
        <div className="text-center text-xs text-slate-500 mt-1">
          Span: {stats.range.span} semitones ({(stats.range.span / 12).toFixed(1)} octaves)
        </div>
      </div>

      {/* Top Notes */}
      <div className="mb-4">
        <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Most Used Notes
        </div>
        <div className="flex gap-2 flex-wrap">
          {topNotes.map(([note, count]) => (
            <div key={note} className="bg-slate-900 rounded px-2 py-1 text-xs">
              <span className="text-white font-mono">{note}</span>
              <span className="text-slate-500 ml-1">×{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hole Usage */}
      <div>
        <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
          <Target className="w-3 h-3" />
          Hole Usage
        </div>
        <div className="grid grid-cols-12 gap-1">
          {[...Array(12)].map((_, i) => {
            const holeNum = i + 1;
            const usage = stats.holeUsage[holeNum] || 0;
            const maxUsage = Math.max(...Object.values(stats.holeUsage), 1);
            const intensity = usage / maxUsage;
            
            return (
              <div key={i} className="text-center">
                <div 
                  className="h-8 rounded-sm mb-1 transition-all"
                  style={{
                    backgroundColor: `rgba(245, 158, 11, ${intensity * 0.8 + 0.1})`
                  }}
                />
                <div className="text-[8px] text-slate-500">{holeNum}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Count */}
      {stats.errors > 0 && (
        <div className="mt-4 p-2 bg-red-900/20 rounded border border-red-500/30 text-xs text-red-400">
          ⚠ {stats.errors} invalid note(s) in sequence
        </div>
      )}
    </div>
  );
};

export default SequenceStats;
