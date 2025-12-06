import { X, ToggleLeft, ToggleRight, Volume2, Music2, ScrollText } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const SettingsPanel = () => {
  const {
    settings,
    toggleSettings,
    updateSettings,
    setBpm,
    bpm,
    setVolume,
    volume
  } = useAppStore();

  const toggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Settings</h2>
            <p className="text-sm text-slate-400">Control playback, visuals, and scrolling</p>
          </div>
          <button
            onClick={toggleSettings}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Playback */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Tempo</p>
                <p className="text-xs text-slate-500">Adjust BPM for timing and scrolling</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={40}
                  max={200}
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                  className="accent-amber-500"
                />
                <span className="text-sm font-mono text-amber-400 w-12 text-right">{bpm} BPM</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Master Volume</p>
                  <p className="text-xs text-slate-500">Affects playback and piano</p>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setVolume(value);
                }}
                className="w-40 accent-amber-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music2 className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-white">SoundFont</p>
                  <p className="text-xs text-slate-500">Choose between basic or full</p>
                </div>
              </div>
              <select
                value={settings.soundFont}
                onChange={(e) => updateSettings({ soundFont: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="basic">Basic</option>
                <option value="full">Full</option>
                <option value="synth">Synth (Fallback)</option>
              </select>
            </div>
          </div>

          {/* Visuals */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Auto-scroll tablature</p>
                  <p className="text-xs text-slate-500">Keep the active note centered</p>
                </div>
              </div>
              <button
                onClick={() => toggle('autoScroll')}
                className="flex items-center gap-2 text-sm text-white"
              >
                {settings.autoScroll ? <ToggleRight className="text-amber-400" /> : <ToggleLeft className="text-slate-500" />}
                <span className="w-12 text-right text-xs uppercase tracking-wide">
                  {settings.autoScroll ? 'On' : 'Off'}
                </span>
              </button>
            </div>

            {[{ key: 'showNoteNames', label: 'Show note names' }, { key: 'showOctave', label: 'Show octave numbers' }, { key: 'highlightSlide', label: 'Highlight slide usage' }, { key: 'countIn', label: 'Enable count-in' }].map(({ key, label }) => (
              <div className="flex items-center justify-between" key={key}>
                <span className="text-sm text-white">{label}</span>
                <button
                  onClick={() => toggle(key as keyof typeof settings)}
                  className="flex items-center gap-2 text-sm text-white"
                >
                  {settings[key as keyof typeof settings] ? <ToggleRight className="text-amber-400" /> : <ToggleLeft className="text-slate-500" />}
                  <span className="w-12 text-right text-xs uppercase tracking-wide">
                    {settings[key as keyof typeof settings] ? 'On' : 'Off'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="text-xs text-slate-500">
            Changes are saved locally and apply immediately.
          </div>
          <button
            onClick={toggleSettings}
            className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold text-sm hover:bg-amber-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
