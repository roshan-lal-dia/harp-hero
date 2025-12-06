import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, X, Volume2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { audioEngine } from '../utils/audioEngine';

const Metronome = ({ onClose }) => {
  const { bpm, setBpm, isPlaying } = useAppStore();
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [volume, setVolume] = useState(50);
  const [accentFirst, setAccentFirst] = useState(true);
  
  const intervalRef = useRef(null);
  const beatRef = useRef(0);

  const playClick = useCallback(async (isDownbeat) => {
    await audioEngine.initialize();
    await audioEngine.playMetronomeClick(isDownbeat && accentFirst);
  }, [accentFirst]);

  useEffect(() => {
    if (isMetronomeOn) {
      const msPerBeat = 60000 / bpm;
      beatRef.current = 0;
      
      intervalRef.current = setInterval(() => {
        const isDownbeat = beatRef.current % beatsPerMeasure === 0;
        playClick(isDownbeat);
        setBeatCount(beatRef.current % beatsPerMeasure);
        beatRef.current++;
      }, msPerBeat);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setBeatCount(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMetronomeOn, bpm, beatsPerMeasure, playClick]);

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Timer className="w-5 h-5 text-amber-500" />
            Metronome
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tempo Display */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-white mb-2">{bpm}</div>
            <div className="text-slate-400 text-sm">Beats Per Minute</div>
          </div>

          {/* Tempo Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="40"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>40</span>
              <span>120</span>
              <span>200</span>
            </div>
          </div>

          {/* Beat Indicator */}
          <div className="flex justify-center gap-3">
            {[...Array(beatsPerMeasure)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full transition-all duration-100 ${
                  i === beatCount && isMetronomeOn
                    ? i === 0
                      ? 'bg-amber-500 scale-125 shadow-lg shadow-amber-500/50'
                      : 'bg-cyan-500 scale-110 shadow-lg shadow-cyan-500/50'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Time Signature */}
          <div className="flex justify-center gap-4">
            <label className="text-sm text-slate-400">Beats per measure:</label>
            <select
              value={beatsPerMeasure}
              onChange={(e) => setBeatsPerMeasure(Number(e.target.value))}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
            </select>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={accentFirst}
                onChange={(e) => setAccentFirst(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-800"
              />
              Accent first beat
            </label>

            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Start/Stop Button */}
          <button
            onClick={() => setIsMetronomeOn(!isMetronomeOn)}
            className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${
              isMetronomeOn
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-900'
            }`}
          >
            {isMetronomeOn ? 'Stop' : 'Start'}
          </button>

          {/* Tempo Presets */}
          <div className="flex flex-wrap justify-center gap-2">
            {[60, 80, 100, 120, 140, 160].map((preset) => (
              <button
                key={preset}
                onClick={() => setBpm(preset)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  bpm === preset
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metronome;
