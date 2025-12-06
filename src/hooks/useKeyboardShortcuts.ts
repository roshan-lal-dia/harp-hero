import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import audioEngine from '../utils/audioEngine';

/**
 * Keyboard shortcuts hook for HarpHero
 * 
 * Shortcuts:
 * - Space: Play/Pause
 * - Left Arrow: Previous note
 * - Right Arrow: Next note
 * - R: Reset to beginning
 * - L: Toggle loop mode
 * - M: Toggle metronome
 * - S: Toggle settings
 * - +/-: Adjust BPM
 * - A: Show achievements
 * - Escape: Close modals
 */
export function useKeyboardShortcuts() {
  const {
    isPlaying,
    togglePlay,
    stop,
    nextNote,
    prevNote,
    sequence,
    currentIndex,
    bpm,
    setBpm,
    toggleMetronome,
    toggleSettings,
    toggleAchievements,
    showSettings,
    showAchievements,
    settings,
    updateSettings
  } = useAppStore();

  const handleKeyDown = useCallback(async (event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        await audioEngine.initialize();
        togglePlay();
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          const prevNoteData = sequence[currentIndex - 1];
          if (prevNoteData && !prevNoteData.error && prevNoteData.pitch) {
            audioEngine.playHarmonicaNote(prevNoteData, 0.3);
          }
          prevNote();
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < sequence.length - 1) {
          const nextNoteData = sequence[currentIndex + 1];
          if (nextNoteData && !nextNoteData.error && nextNoteData.pitch) {
            audioEngine.playHarmonicaNote(nextNoteData, 0.3);
          }
          nextNote();
        }
        break;

      case 'KeyR':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          stop();
        }
        break;

      case 'KeyL':
        event.preventDefault();
        if (settings.loopEnabled) {
          updateSettings({ loopEnabled: false, loopStart: 0, loopEnd: 0 });
        } else {
          // Set loop to current section (current position to end)
          updateSettings({ 
            loopEnabled: true, 
            loopStart: currentIndex, 
            loopEnd: Math.min(currentIndex + 16, sequence.length - 1) 
          });
        }
        break;

      case 'KeyM':
        event.preventDefault();
        toggleMetronome();
        break;

      case 'KeyS':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          toggleSettings();
        }
        break;

      case 'KeyA':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          toggleAchievements();
        }
        break;

      case 'Equal':
      case 'NumpadAdd':
        event.preventDefault();
        setBpm(Math.min(bpm + 5, 200));
        break;

      case 'Minus':
      case 'NumpadSubtract':
        event.preventDefault();
        setBpm(Math.max(bpm - 5, 40));
        break;

      case 'Escape':
        if (showSettings) {
          toggleSettings();
        } else if (showAchievements) {
          toggleAchievements();
        } else if (isPlaying) {
          stop();
        }
        break;

      case 'Home':
        event.preventDefault();
        stop();
        break;

      case 'End':
        event.preventDefault();
        useAppStore.getState().setCurrentIndex(sequence.length - 1);
        break;

      default:
        break;
    }
  }, [
    togglePlay, prevNote, nextNote, stop, currentIndex, sequence,
    bpm, setBpm, toggleMetronome, toggleSettings, toggleAchievements,
    showSettings, showAchievements, isPlaying, settings, updateSettings
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Keyboard shortcuts help panel content
 */
export const KEYBOARD_SHORTCUTS = [
  { key: 'Space', action: 'Play / Pause' },
  { key: '←', action: 'Previous note' },
  { key: '→', action: 'Next note' },
  { key: 'R', action: 'Reset to beginning' },
  { key: 'L', action: 'Toggle loop mode' },
  { key: 'M', action: 'Toggle metronome' },
  { key: 'S', action: 'Open settings' },
  { key: 'A', action: 'View achievements' },
  { key: '+/-', action: 'Adjust BPM' },
  { key: 'Esc', action: 'Close modal / Stop' },
  { key: 'Home', action: 'Go to start' },
  { key: 'End', action: 'Go to end' },
];

export default useKeyboardShortcuts;
