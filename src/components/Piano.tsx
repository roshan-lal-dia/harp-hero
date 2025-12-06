import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import audioEngine from '../utils/audioEngine';
import { NOTE_MAPPINGS, getMidiNote } from '../utils/noteMappings';
import type { Note } from '../utils/noteParser';

const PIANO_NOTES = ['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5'];

function buildNote(pitch: string): Note | null {
  const mapping = NOTE_MAPPINGS[pitch];
  if (!mapping) return null;
  return {
    id: -1,
    raw: pitch,
    pitch,
    ...mapping,
    duration: { beats: 1, dotted: false, triplet: false },
    measure: 0,
    beat: 0,
    midi: getMidiNote(pitch)
  };
}

const Piano = () => {
  const { setTransientNote } = useAppStore();

  const keys = useMemo(() => PIANO_NOTES.map((pitch) => {
    const mapping = NOTE_MAPPINGS[pitch];
    return { pitch, mapping };
  }), []);

  const handleDown = async (pitch: string) => {
    const note = buildNote(pitch);
    if (!note) return;
    setTransientNote(note);
    await audioEngine.playHarmonicaNote(note, 0.5);
  };

  const handleUp = () => {
    setTransientNote(null);
  };

  return (
    <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Interactive Piano</h3>
          <p className="text-xs text-slate-500">Click or tap to audition notes; slide notes glow amber.</p>
        </div>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">Realtime preview</span>
      </div>

      <div className="relative overflow-x-auto custom-scrollbar pb-3">
        <div className="absolute inset-y-6 left-0 right-0 pointer-events-none" aria-hidden>
          <div className="h-3 bg-gradient-to-r from-amber-900/10 via-amber-500/20 to-amber-900/10 blur-2xl" />
        </div>
        <div className="relative flex gap-1">
          {keys.map(({ pitch, mapping }) => (
            <button
              key={pitch}
              onMouseDown={() => handleDown(pitch)}
              onMouseUp={handleUp}
              onMouseLeave={handleUp}
              onTouchStart={() => handleDown(pitch)}
              onTouchEnd={handleUp}
              className={`relative flex-1 min-w-[64px] h-36 rounded-lg border transition-all duration-150 text-center text-sm font-semibold group focus:outline-none focus:ring-2 focus:ring-amber-500/60 ${
                mapping?.action === 'blow'
                  ? 'bg-gradient-to-b from-cyan-800/70 to-slate-900 border-cyan-600/60 hover:from-cyan-700'
                  : 'bg-gradient-to-b from-rose-800/70 to-slate-900 border-rose-600/60 hover:from-rose-700'
              }`}
            >
              <div className="mt-3 text-white text-lg tracking-tight">{pitch}</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wide">{mapping?.action}</div>
              <div className="text-[10px] text-amber-300 font-mono">Hole {mapping?.hole}</div>

              {mapping?.slide && (
                <div className="absolute inset-x-3 bottom-3 h-2 rounded-full bg-amber-500/20 border border-amber-500/60 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 animate-pulse" style={{ opacity: 0.8 }} />
                  <span className="absolute inset-0 text-[10px] text-slate-900 font-semibold flex items-center justify-center">Slide In</span>
                </div>
              )}

              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity bg-white" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Piano;
