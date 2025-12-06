import React, { useRef, useEffect } from 'react';
import { Wind } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const TabViewer = () => {
  const { sequence, currentIndex, setCurrentIndex, isPlaying, settings } = useAppStore();
  const activeRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to active note
  useEffect(() => {
    if (settings.autoScroll && activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentIndex, settings.autoScroll]);

  const handleNoteClick = (index) => {
    setCurrentIndex(index);
  };

  if (sequence.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3 py-12">
        <Wind className="w-12 h-12 opacity-20" />
        <span className="text-sm italic">Tablature will appear here...</span>
        <span className="text-xs opacity-60">Enter notes and click "Parse & Load"</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar"
    >
      {sequence.map((note, idx) => {
        const isActive = idx === currentIndex;
        const isInLoop = settings.loopEnabled && idx >= settings.loopStart && idx <= settings.loopEnd;
        
        return (
          <button
            key={note.id || idx}
            ref={isActive ? activeRef : null}
            onClick={() => handleNoteClick(idx)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all duration-200 ${
              isActive
                ? 'bg-slate-700/80 border-amber-500/50 shadow-lg shadow-amber-500/10 translate-x-1 tab-active'
                : isInLoop
                  ? 'border-green-500/30 bg-green-900/10 hover:bg-slate-700/50'
                  : 'border-transparent hover:bg-slate-700/30'
            }`}
          >
            {/* Note Index */}
            <div className="flex items-center gap-4">
              <span className={`font-mono text-xs w-8 text-right ${
                isActive ? 'text-amber-500 font-bold' : 'text-slate-600'
              }`}>
                {idx + 1}
              </span>
              
              {/* Note Name */}
              <span className={`font-bold text-base w-12 ${
                isActive ? 'text-white' : note.error ? 'text-red-400' : 'text-slate-400'
              }`}>
                {note.pitch || note.raw}
              </span>

              {/* Rest indicator */}
              {note.isRest && (
                <span className="text-slate-500 italic text-xs">rest</span>
              )}
            </div>

            {/* Tab Info */}
            {!note.error && !note.isRest ? (
              <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-1.5 rounded-lg">
                {/* Action */}
                <span className={`text-[10px] font-bold uppercase tracking-wider min-w-[36px] ${
                  note.action === 'blow' ? 'text-cyan-400' : 'text-rose-400'
                }`}>
                  {note.action}
                </span>
                
                <span className="text-slate-700">|</span>
                
                {/* Hole Number */}
                <span className="font-mono font-bold text-white w-6 text-center text-lg">
                  {note.hole}
                </span>
                
                <span className="text-slate-700">|</span>
                
                {/* Slide Status */}
                {note.slide ? (
                  <div className="flex items-center gap-1.5 min-w-[32px]">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] text-amber-500 font-bold">IN</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-600 font-bold min-w-[32px]">OUT</span>
                )}

                {/* Duration indicator */}
                {note.duration && note.duration.beats !== 1 && (
                  <>
                    <span className="text-slate-700">|</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {note.duration.beats.toFixed(1)}b
                    </span>
                  </>
                )}
              </div>
            ) : note.error ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400/80 italic">
                  {note.errorMessage || 'Invalid Note'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">—</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabViewer;
