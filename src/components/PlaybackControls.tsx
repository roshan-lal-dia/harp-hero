import { useEffect, useRef, useCallback, MouseEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Volume2, VolumeX, Repeat, Turtle, Zap } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { audioEngine } from '../utils/audioEngine';
import { getFrequency } from '../utils/noteMappings';

const PlaybackControls = () => {
  const {
    isPlaying,
    bpm,
    volume,
    sequence,
    currentIndex,
    settings,
    practiceMode,
    togglePlay,
    stop,
    nextNote,
    prevNote,
    setBpm,
    setVolume,
    setCurrentIndex,
    getProgress,
    setPracticeMode,
    setLoop,
    clearLoop,
    updatePracticeStats,
    completeSong,
    currentSong
  } = useAppStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progress = getProgress();

  // Initialize audio on first interaction
  useEffect(() => {
    const initAudio = async () => {
      await audioEngine.initialize();
    };
    initAudio();
    
    return () => {
      audioEngine.stopAll();
    };
  }, []);

  // Playback loop
  useEffect(() => {
    if (isPlaying && sequence.length > 0) {
      const msPerBeat = 60000 / bpm;
      
      intervalRef.current = setInterval(() => {
        nextNote();
      }, msPerBeat);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm, sequence.length, nextNote]);

  // Play sound when note changes
  useEffect(() => {
    const currentNote = sequence[currentIndex];
    if (currentNote && !currentNote.error && !currentNote.isRest && isPlaying && currentNote.pitch) {
      const duration = (currentNote.duration?.beats || 1) * (60 / bpm);
      audioEngine.playHarmonicaNote(currentNote, duration);
      
      // Track stats - using queueMicrotask to avoid state update during render
      queueMicrotask(() => {
        updatePracticeStats({ 
          notes: 1, 
          slideNotes: currentNote.slide ? 1 : 0,
          noteName: currentNote.pitch?.replace(/\d/g, '') // Just the note name without octave
        });
        
        // Check if song completed
        if (currentIndex === sequence.length - 1 && currentSong) {
          completeSong(currentSong.id);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPlaying, bpm]);

  // Update volume
  useEffect(() => {
    const db = (volume / 100) * 12 - 12; // Convert 0-100 to -12 to 0 dB
    audioEngine.setVolume(db);
  }, [volume]);

  const handlePlayPause = useCallback(async () => {
    await audioEngine.initialize();
    togglePlay();
  }, [togglePlay]);

  const handleStop = useCallback(() => {
    audioEngine.stopAll();
    stop();
  }, [stop]);

  const handlePrev = useCallback(() => {
    const currentNote = sequence[currentIndex - 1];
    if (currentNote && !currentNote.error && currentNote.pitch) {
      const freq = getFrequency(currentNote.pitch);
      if (freq) {
        audioEngine.playHarmonicaNote(currentNote, 0.5);
      }
    }
    prevNote();
  }, [prevNote, sequence, currentIndex]);

  const handleNext = useCallback(() => {
    const nextNoteData = sequence[currentIndex + 1];
    if (nextNoteData && !nextNoteData.error) {
      audioEngine.playHarmonicaNote(nextNoteData, 0.5);
    }
    nextNote();
  }, [nextNote, sequence, currentIndex]);

  const handleSeek = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newIndex = Math.floor(percentage * sequence.length);
    setCurrentIndex(Math.max(0, Math.min(newIndex, sequence.length - 1)));
  }, [sequence.length, setCurrentIndex]);

  return (
    <div className="border-t border-slate-700 pt-6">
      {/* Progress Bar */}
      <div 
        className="relative h-2 bg-slate-700 rounded-full mb-6 cursor-pointer group"
        onClick={handleSeek}
      >
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-100 progress-glow"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
        
        {/* Note markers */}
        {settings.loopEnabled && (
          <>
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-green-500"
              style={{ left: `${(settings.loopStart / sequence.length) * 100}%` }}
            />
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-red-500"
              style={{ left: `${(settings.loopEnd / sequence.length) * 100}%` }}
            />
          </>
        )}
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Tempo Control */}
        <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tempo</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setBpm(Math.max(40, bpm - 5))}
              className="w-7 h-7 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 transition-colors"
            >
              -
            </button>
            <input
              type="range"
              min="40"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <button 
              onClick={() => setBpm(Math.min(200, bpm + 5))}
              className="w-7 h-7 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 transition-colors"
            >
              +
            </button>
          </div>
          <span className="text-lg font-mono font-bold text-amber-500 w-12 text-center">{bpm}</span>
          <span className="text-xs text-slate-500">BPM</span>
        </div>

        {/* Main Transport Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleStop}
            className="p-3 rounded-full hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
            title="Stop & Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handlePrev}
            className="p-3 rounded-full hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
            title="Previous Note"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={handlePlayPause}
            className={`p-5 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 ${
              isPlaying 
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' 
                : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" fill="white" />
            ) : (
              <Play className="w-8 h-8 text-slate-900 ml-1" fill="#0f172a" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-full hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
            title="Next Note"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
          <button
            onClick={() => setVolume(volume === 0 ? 75 : 0)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-xs font-mono text-slate-400 w-8">{volume}%</span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span>Note: <span className="text-slate-300 font-mono">{currentIndex + 1}/{sequence.length}</span></span>
          {sequence[currentIndex] && !sequence[currentIndex].error && (
            <span>
              Measure: <span className="text-slate-300 font-mono">{sequence[currentIndex].measure || 1}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Audio Ready</span>
        </div>
      </div>

      {/* Practice Mode Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">Practice Mode:</span>
        </div>
        
        <button
          onClick={() => setPracticeMode('normal')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            practiceMode === 'normal'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          Normal
        </button>

        <button
          onClick={() => {
            setPracticeMode('slow');
            setBpm(Math.floor(bpm * settings.slowPracticeRatio));
          }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            practiceMode === 'slow'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Turtle className="w-4 h-4" />
          Slow (50%)
        </button>

        <button
          onClick={() => {
            if (settings.loopEnabled) {
              clearLoop();
              setPracticeMode('normal');
            } else {
              // Set loop from current position for 8 notes
              const start = currentIndex;
              const end = Math.min(currentIndex + 7, sequence.length - 1);
              setLoop(start, end);
              setPracticeMode('loop');
            }
          }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            settings.loopEnabled
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Repeat className="w-4 h-4" />
          {settings.loopEnabled ? `Loop ${settings.loopStart + 1}-${settings.loopEnd + 1}` : 'Loop Section'}
        </button>
      </div>
    </div>
  );
};

export default PlaybackControls;