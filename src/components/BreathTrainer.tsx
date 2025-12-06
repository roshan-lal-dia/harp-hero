import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Wind, Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface BreathTrainerProps {
  onClose: () => void;
}

type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out' | 'idle';

interface BreathPattern {
  name: string;
  description: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
}

const BREATH_PATTERNS: BreathPattern[] = [
  {
    name: 'Basic Breathing',
    description: 'Simple 4-4 pattern for beginners',
    inhale: 4,
    holdIn: 0,
    exhale: 4,
    holdOut: 0
  },
  {
    name: 'Box Breathing',
    description: '4-4-4-4 pattern for focus and calm',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4
  },
  {
    name: 'Harmonica Draw',
    description: 'Long inhale for draw note practice',
    inhale: 6,
    holdIn: 2,
    exhale: 2,
    holdOut: 0
  },
  {
    name: 'Harmonica Blow',
    description: 'Long exhale for blow note practice',
    inhale: 2,
    holdIn: 0,
    exhale: 6,
    holdOut: 2
  },
  {
    name: 'Relaxing 4-7-8',
    description: 'Calming pattern before practice',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0
  },
  {
    name: 'Energizing',
    description: 'Quick pattern to wake up',
    inhale: 2,
    holdIn: 1,
    exhale: 2,
    holdOut: 1
  }
];

const BreathTrainer = ({ onClose }: BreathTrainerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIndexRef = useRef(0);

  const pattern = BREATH_PATTERNS[selectedPattern];

  const getPhaseOrder = useCallback((): { phase: BreathPhase; duration: number }[] => {
    const phases: { phase: BreathPhase; duration: number }[] = [];
    if (pattern.inhale > 0) phases.push({ phase: 'inhale', duration: pattern.inhale });
    if (pattern.holdIn > 0) phases.push({ phase: 'hold-in', duration: pattern.holdIn });
    if (pattern.exhale > 0) phases.push({ phase: 'exhale', duration: pattern.exhale });
    if (pattern.holdOut > 0) phases.push({ phase: 'hold-out', duration: pattern.holdOut });
    return phases;
  }, [pattern]);

  const startExercise = useCallback(() => {
    const phases = getPhaseOrder();
    if (phases.length === 0) return;
    
    phaseIndexRef.current = 0;
    setCurrentPhase(phases[0].phase);
    setTimeLeft(phases[0].duration);
    setIsRunning(true);
  }, [getPhaseOrder]);

  const stopExercise = useCallback(() => {
    setIsRunning(false);
    setCurrentPhase('idle');
    setTimeLeft(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resetExercise = useCallback(() => {
    stopExercise();
    setCyclesCompleted(0);
  }, [stopExercise]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          const phases = getPhaseOrder();
          phaseIndexRef.current = (phaseIndexRef.current + 1) % phases.length;
          
          // Check if we completed a cycle
          if (phaseIndexRef.current === 0) {
            setCyclesCompleted((c) => c + 1);
          }
          
          const nextPhase = phases[phaseIndexRef.current];
          setCurrentPhase(nextPhase.phase);
          return nextPhase.duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, getPhaseOrder]);

  const getPhaseLabel = (phase: BreathPhase): string => {
    switch (phase) {
      case 'inhale': return 'BREATHE IN';
      case 'hold-in': return 'HOLD';
      case 'exhale': return 'BREATHE OUT';
      case 'hold-out': return 'HOLD';
      default: return 'READY';
    }
  };

  const getPhaseColor = (phase: BreathPhase): string => {
    switch (phase) {
      case 'inhale': return 'from-cyan-500 to-blue-500';
      case 'hold-in': return 'from-purple-500 to-indigo-500';
      case 'exhale': return 'from-rose-500 to-orange-500';
      case 'hold-out': return 'from-amber-500 to-yellow-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getBreathInstruction = (phase: BreathPhase): string => {
    switch (phase) {
      case 'inhale': return 'Draw air in through your harmonica (or nose)';
      case 'hold-in': return 'Hold your breath with lungs full';
      case 'exhale': return 'Blow air out through your harmonica (or mouth)';
      case 'hold-out': return 'Hold with lungs empty';
      default: return 'Press play to begin the breathing exercise';
    }
  };

  // Calculate circle animation
  const totalPhaseTime = getPhaseOrder().find(p => p.phase === currentPhase)?.duration || 1;
  const progress = currentPhase === 'idle' ? 0 : ((totalPhaseTime - timeLeft) / totalPhaseTime) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Wind className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Breath Trainer</h2>
              <p className="text-sm text-slate-400">Improve your harmonica breathing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pattern Selector (shown when settings open) */}
        {showSettings && (
          <div className="p-4 border-b border-slate-700 bg-slate-800/50">
            <h3 className="text-sm font-bold text-slate-300 mb-3">Breathing Pattern</h3>
            <div className="grid grid-cols-2 gap-2">
              {BREATH_PATTERNS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedPattern(i);
                    stopExercise();
                  }}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedPattern === i
                      ? 'bg-cyan-500/20 border-2 border-cyan-500'
                      : 'bg-slate-700/50 border-2 border-transparent hover:border-slate-600'
                  }`}
                >
                  <p className={`font-medium text-sm ${selectedPattern === i ? 'text-cyan-300' : 'text-white'}`}>
                    {p.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    {p.inhale}-{p.holdIn}-{p.exhale}-{p.holdOut}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-8 flex flex-col items-center">
          {/* Breathing Circle */}
          <div className="relative w-64 h-64 mb-6">
            {/* Background ring */}
            <div className="absolute inset-0 rounded-full border-8 border-slate-700" />
            
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="url(#breathGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 7.54} 754`}
                className="transition-all duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={currentPhase === 'inhale' ? '#06b6d4' : currentPhase === 'exhale' ? '#f43f5e' : '#a855f7'} />
                  <stop offset="100%" stopColor={currentPhase === 'inhale' ? '#3b82f6' : currentPhase === 'exhale' ? '#f97316' : '#6366f1'} />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${getPhaseColor(currentPhase)} flex flex-col items-center justify-center transition-all duration-500 ${
              currentPhase === 'inhale' ? 'scale-110' : currentPhase === 'exhale' ? 'scale-90' : 'scale-100'
            }`}>
              <span className="text-5xl font-black text-white mb-2">
                {currentPhase === 'idle' ? '●' : timeLeft}
              </span>
              <span className="text-sm font-bold text-white/80 uppercase tracking-wider">
                {getPhaseLabel(currentPhase)}
              </span>
            </div>
          </div>

          {/* Instruction */}
          <p className="text-center text-slate-400 mb-6 h-10">
            {getBreathInstruction(currentPhase)}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mb-6 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{cyclesCompleted}</p>
              <p className="text-xs text-slate-500">Cycles</p>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div>
              <p className="text-2xl font-bold text-white">{pattern.name}</p>
              <p className="text-xs text-slate-500">Pattern</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={resetExercise}
              className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            
            <button
              onClick={isRunning ? stopExercise : startExercise}
              className={`p-5 rounded-full text-white transition-all shadow-lg ${
                isRunning
                  ? 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/30'
              }`}
            >
              {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
            
            <div className="w-12" /> {/* Spacer for visual balance */}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-700 bg-slate-800/50">
          <p className="text-xs text-slate-500 text-center">
            Proper breathing technique is essential for harmonica playing. Practice daily for best results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreathTrainer;
