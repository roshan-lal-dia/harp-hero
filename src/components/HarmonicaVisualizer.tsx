import React, { useEffect, useCallback, useRef } from 'react';
import { Wind } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { ACTION_BLOW, ACTION_DRAW } from '../utils/constants';

const HarmonicaVisualizer = () => {
  const { sequence, currentIndex } = useAppStore();
  const currentNote = sequence[currentIndex];
  
  const holeRefs = useRef([]);
  
  // Animate the active hole
  useEffect(() => {
    if (currentNote && !currentNote.error && holeRefs.current[currentNote.hole - 1]) {
      const hole = holeRefs.current[currentNote.hole - 1];
      hole.classList.remove('hole-blow', 'hole-draw');
      // Force reflow
      void hole.offsetWidth;
      hole.classList.add(currentNote.action === ACTION_BLOW ? 'hole-blow' : 'hole-draw');
    }
  }, [currentIndex, currentNote]);

  if (!currentNote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[280px] text-slate-500">
        <Wind className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg">Enter notes to begin</p>
        <p className="text-sm mt-2 opacity-60">Paste a note sequence in the input area</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Current Note Display */}
      <div className="text-center mb-6">
        <div className="text-7xl font-black tracking-tighter drop-shadow-lg mb-2">
          {currentNote.error ? (
            <span className="text-red-500">?</span>
          ) : (
            <span className={currentNote.action === ACTION_BLOW ? 'text-cyan-400' : 'text-rose-400'}>
              {currentNote.display || currentNote.raw}
              {currentNote.octave && (
                <span className="text-3xl text-slate-400 ml-1">{currentNote.octave}</span>
              )}
            </span>
          )}
        </div>
        {!currentNote.error && (
          <div className="text-slate-400 text-sm font-mono">
            Note {currentIndex + 1} of {sequence.length}
          </div>
        )}
      </div>

      {/* Action Cards */}
      {!currentNote.error && (
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-xl mb-8">
          {/* Action Card */}
          <div className={`flex-1 min-w-[140px] rounded-xl p-5 flex flex-col items-center justify-center transition-all duration-200 border-2 ${
            currentNote.action === 'blow' 
              ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
              : 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-widest mb-3 ${
              currentNote.action === 'blow' ? 'text-cyan-400' : 'text-rose-400'
            }`}>
              Action
            </span>
            <div className={`text-2xl font-bold flex items-center gap-3 ${
              currentNote.action === 'blow' ? 'text-cyan-200' : 'text-rose-200'
            }`}>
              {currentNote.action === 'blow' ? 'BLOW' : 'DRAW'}
              <Wind className={`w-7 h-7 ${currentNote.action === 'blow' ? 'rotate-180' : ''} ${
                currentNote.action === 'blow' ? 'airflow-blow' : 'airflow-draw'
              }`} />
            </div>
            <div className={`text-xs mt-2 ${
              currentNote.action === 'blow' ? 'text-cyan-400/60' : 'text-rose-400/60'
            }`}>
              {currentNote.action === 'blow' ? 'Exhale into harmonica' : 'Inhale from harmonica'}
            </div>
          </div>

          {/* Hole Card */}
          <div className="flex-1 min-w-[140px] bg-slate-800 rounded-xl p-5 flex flex-col items-center justify-center border-2 border-slate-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">Hole</span>
            <span className="text-6xl font-mono font-bold text-white">{currentNote.hole}</span>
            <div className="text-xs text-slate-500 mt-2">
              {currentNote.hole <= 4 ? 'Low Octave' : currentNote.hole <= 8 ? 'Mid Octave' : 'High Octave'}
            </div>
          </div>

          {/* Slide Card */}
          <div className={`flex-1 min-w-[140px] rounded-xl p-5 flex flex-col items-center justify-center border-2 transition-all duration-200 ${
            currentNote.slide 
              ? 'bg-amber-900/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
              : 'bg-slate-800 border-slate-700 opacity-60'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-widest mb-3 ${
              currentNote.slide ? 'text-amber-400' : 'text-slate-500'
            }`}>
              Slide Button
            </span>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full transition-all ${
                currentNote.slide 
                  ? 'bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                  : 'bg-slate-600'
              }`} />
              <span className={`text-2xl font-bold ${
                currentNote.slide ? 'text-amber-200' : 'text-slate-500'
              }`}>
                {currentNote.slide ? 'PUSH IN' : 'OUT'}
              </span>
            </div>
            <div className="text-xs mt-2 text-slate-500">
              {currentNote.slide ? 'Raises pitch by ½ step' : 'Normal position'}
            </div>
          </div>
        </div>
      )}

      {/* 12-Hole Harmonica Visualization */}
      <div className="relative w-full max-w-3xl">
        {/* Octave Labels */}
        <div className="flex justify-between px-2 mb-2">
          <span className="text-[11px] text-slate-500 font-mono">Low (C4)</span>
          <span className="text-[11px] text-slate-500 font-mono">Mid (C5)</span>
          <span className="text-[11px] text-slate-500 font-mono">High (C6)</span>
          <span className="text-[11px] text-slate-500 font-mono">High (C7)</span>
        </div>

        {/* Harmonica Body */}
        <div className="relative">
          {/* Cover Plates */}
          <div className="absolute -top-2 left-0 right-0 h-3 bg-gradient-to-b from-slate-500 to-slate-400 rounded-t-lg shadow-lg" />
          <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-t from-slate-600 to-slate-500 rounded-b-lg shadow-lg" />
          
          {/* Comb (Main Body) */}
          <div className="h-24 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-lg shadow-xl flex items-center justify-between px-4 border-t-4 border-t-slate-100 border-b-4 border-b-slate-500 relative overflow-hidden">
            
            {/* Slide Mechanism */}
            <div className={`absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-slate-400 to-slate-300 border-l-2 border-slate-500 transition-transform duration-100 z-0 ${
              currentNote && currentNote.slide ? '-translate-x-2 slide-active' : 'translate-x-0'
            }`}>
              <div className="absolute top-1/2 -translate-y-1/2 right-[-12px] w-5 h-16 bg-gradient-to-r from-slate-300 to-slate-200 rounded-r-md border border-slate-400 shadow-md flex items-center justify-center">
                <div className="w-1 h-8 bg-slate-400 rounded-full" />
              </div>
            </div>

            {/* Holes */}
            {[...Array(12)].map((_, i) => {
              const holeNum = i + 1;
              const isActive = currentNote && !currentNote.error && currentNote.hole === holeNum;
              
              return (
                <div
                  key={i}
                  ref={el => holeRefs.current[i] = el}
                  className={`relative flex-1 h-16 mx-[2px] z-10 transition-all duration-150 ${
                    isActive ? 'scale-110' : ''
                  }`}
                >
                  {/* Hole Number */}
                  <span className={`absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold font-mono transition-colors ${
                    isActive ? 'text-amber-400' : 'text-slate-600'
                  }`}>
                    {holeNum}
                  </span>

                  {/* Hole Opening */}
                  <div className={`w-full h-full rounded-sm border-2 shadow-inner transition-all duration-150 ${
                    isActive
                      ? currentNote.action === 'blow'
                        ? 'bg-cyan-500 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.8)]'
                        : 'bg-rose-500 border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.8)]'
                      : 'bg-slate-800 border-slate-700'
                  }`}>
                    {/* Airflow indicator */}
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        {currentNote.action === 'blow' ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-2 h-2 bg-white/60 rounded-full airflow-blow" />
                            <div className="w-2 h-2 bg-white/40 rounded-full airflow-blow" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-white/20 rounded-full airflow-blow" style={{ animationDelay: '0.2s' }} />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-2 h-2 bg-white/20 rounded-full airflow-draw" />
                            <div className="w-2 h-2 bg-white/40 rounded-full airflow-draw" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-white/60 rounded-full airflow-draw" style={{ animationDelay: '0.2s' }} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reed Type Indicator (below hole) */}
                  <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono ${
                    isActive ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {i < 4 ? 'L' : i < 8 ? 'M' : 'H'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded" />
            <span>Blow (exhale)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-500 rounded" />
            <span>Draw (inhale)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span>Slide pressed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarmonicaVisualizer;
