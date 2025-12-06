import React, { useState } from 'react';
import { Music, Star, Clock, ChevronRight, Search, Filter } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { SONGS, getCategories, getSongsByCategory, DIFFICULTY } from '../utils/songLibrary';

const SongBrowser = ({ isOpen, onClose }) => {
  const { loadSong, currentSong } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);

  const categories = ['all', ...getCategories()];

  const filteredSongs = Object.values(SONGS).filter(song => {
    const matchesSearch = song.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || song.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 0 || song.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleSelectSong = (song) => {
    loadSong(song);
    onClose?.();
  };

  const getDifficultyLabel = (level) => {
    const labels = ['', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level] || '';
  };

  const getDifficultyColor = (level) => {
    const colors = ['', 'text-green-400', 'text-cyan-400', 'text-amber-400', 'text-orange-400', 'text-rose-400'];
    return colors[level] || 'text-slate-400';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-500" />
              Song Library
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {cat === 'all' ? 'All Songs' : cat}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2 mt-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Difficulty:</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    selectedDifficulty === level
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {level === 0 ? 'Any' : level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Song List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {filteredSongs.length === 0 ? (
            <div className="text-center text-slate-500 py-12">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No songs found</p>
            </div>
          ) : (
            filteredSongs.map(song => {
              const isSelected = currentSong?.id === song.id;
              return (
                <button
                  key={song.id}
                  onClick={() => handleSelectSong(song)}
                  className={`w-full text-left p-4 rounded-xl border transition-all group ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                          {song.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded-full">
                            Now Playing
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                          {song.category}
                        </span>
                        <span className={getDifficultyColor(song.difficulty)}>
                          {getDifficultyLabel(song.difficulty)}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {song.bpm} BPM
                        </span>
                      </div>

                      {song.description && (
                        <p className="text-sm text-slate-400 mt-2">{song.description}</p>
                      )}
                    </div>

                    <ChevronRight className={`w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors ${
                      isSelected ? 'text-amber-500' : ''
                    }`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50 text-center text-xs text-slate-500">
          {filteredSongs.length} songs available
        </div>
      </div>
    </div>
  );
};

export default SongBrowser;
