import { Info, ListMusic, Sparkles, FileMusic } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { SONGS } from '../utils/songLibrary';
import { useState } from 'react';

const NoteInput = () => {
  const { inputText, setInputText, parseAndLoadSequence, loadSong, loadMusicXml, loadMusicXmlBuffer } = useAppStore();
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleParse = () => {
    parseAndLoadSequence(inputText);
  };

  const handleLoadPreset = (songKey: string) => {
    const song = SONGS[songKey];
    if (song) {
      loadSong(song);
    }
  };

  const handleMusicXmlUpload = async (file: File | null) => {
    if (!file) return;
    setUploadStatus('Loading...');
    const isMxl = file.name.toLowerCase().endsWith('.mxl');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        if (isMxl && reader.result instanceof ArrayBuffer) {
          const parsed = await loadMusicXmlBuffer(reader.result);
          setUploadStatus(parsed.length ? `Loaded ${parsed.length} notes from MXL` : 'No notes found in file');
          setInputText('');
        } else {
          const text = reader.result?.toString() || '';
          const parsed = loadMusicXml(text);
          setUploadStatus(parsed.length ? `Loaded ${parsed.length} notes from MusicXML` : 'No notes found in file');
          setInputText('');
        }
      } catch (err) {
        console.error(err);
        setUploadStatus('Failed to parse file');
      }
    };
    reader.onerror = () => setUploadStatus('Failed to read MusicXML file');
    if (isMxl) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-md">
      {/* Header with Quick Load Buttons */}
      <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
        <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Input Notes
        </label>

        <div className="flex flex-wrap gap-2">
          {/* Scale Presets */}
          <button
            onClick={() => handleLoadPreset('C_MAJOR_SCALE')}
            className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-200 transition-colors"
          >
            C Major
          </button>
          <button
            onClick={() => handleLoadPreset('D_MAJOR_SCALE')}
            className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-200 transition-colors"
          >
            D Major
          </button>
          <button
            onClick={() => handleLoadPreset('CHROMATIC_EXERCISE')}
            className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-200 transition-colors"
          >
            Chromatic
          </button>
          <label className="flex items-center gap-1 text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-200 transition-colors cursor-pointer">
            <FileMusic className="w-3 h-3" />
            <span>MusicXML</span>
            <input
              type="file"
              accept=".xml,.musicxml,.mxl"
              className="hidden"
              onChange={(e) => handleMusicXmlUpload(e.target.files?.[0] || null)}
            />
          </label>
          
          {/* Main Song */}
          <button
            onClick={() => handleLoadPreset('GOAL_SONG')}
            className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-2 py-1 rounded border border-amber-500/30 flex items-center gap-1 transition-colors"
          >
            <ListMusic className="w-3 h-3" />
            Goal Song
          </button>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full h-48 bg-slate-900 border border-slate-600 rounded-lg p-4 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none resize-none leading-relaxed placeholder:text-slate-600"
        placeholder="Enter notes separated by spaces...

Examples:
• C4 D4 E4 F4 G4 A4 B4 C5
• D D D D C# | F G A
• C4:4 D4:8 E4:8 (with durations)

Use | for measure breaks
Use # for sharps, b for flats"
      />

      {/* Actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs text-slate-500 flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
          <Info className="w-3.5 h-3.5 text-amber-500" />
          <span>Supports: C4, D#5, Bb4, F#, etc. | for measures</span>
        </div>
        
        <button
          onClick={handleParse}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-amber-900/20 hover:shadow-amber-900/30 active:scale-95"
        >
          Parse & Load
        </button>
      </div>

      {uploadStatus && (
        <div className="mt-2 text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700/40 rounded-lg px-3 py-2">
          {uploadStatus}
        </div>
      )}

      {/* Quick Songs Dropdown */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <details className="group">
          <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300 flex items-center gap-2">
            <ListMusic className="w-3 h-3" />
            Browse Song Library
            <span className="text-slate-600 group-open:rotate-90 transition-transform">▶</span>
          </summary>
          
          <div className="mt-3 grid gap-2 max-h-48 overflow-y-auto custom-scrollbar">
            {Object.entries(SONGS).map(([key, song]) => (
              <button
                key={key}
                onClick={() => handleLoadPreset(key)}
                className="text-left p-2 rounded bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm text-slate-200">{song.name}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                    {song.category}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {song.bpm} BPM • Level {song.difficulty}/5
                </div>
              </button>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default NoteInput;
