import React, { useState } from 'react';
import { TimerSettings, DEFAULT_SETTINGS } from '../types/timer';
import { playCompletionSound } from '../utils/audio';
import { X, Volume2, RotateCcw, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: TimerSettings;
  onSave: (newSettings: TimerSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onSave,
  onClose,
}) => {
  const [draft, setDraft] = useState<TimerSettings>(settings);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
    onClose();
  };

  const handleResetDefaults = () => {
    setDraft(DEFAULT_SETTINGS);
  };

  const testAudio = () => {
    playCompletionSound(draft.volume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-800 dark:text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Timer Settings</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Customize your study intervals and alerts.</p>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Durations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Durations (Minutes)
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">Study Focus</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={draft.focusDurationMinutes}
                  onChange={(e) =>
                    setDraft({ ...draft, focusDurationMinutes: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={draft.shortBreakDurationMinutes}
                  onChange={(e) =>
                    setDraft({ ...draft, shortBreakDurationMinutes: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={draft.longBreakDurationMinutes}
                  onChange={(e) =>
                    setDraft({ ...draft, longBreakDurationMinutes: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
                Long Break Interval (every X sessions)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={draft.longBreakInterval}
                onChange={(e) =>
                  setDraft({ ...draft, longBreakInterval: Math.max(1, parseInt(e.target.value) || 4) })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Sound & Notifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sound & Alerts
            </h4>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Sound chime on completion</span>
              <input
                type="checkbox"
                checked={draft.soundEnabled}
                onChange={(e) => setDraft({ ...draft, soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {draft.soundEnabled && (
              <div className="flex items-center gap-3 pt-1">
                <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={draft.volume}
                  onChange={(e) => setDraft({ ...draft, volume: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={testAudio}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap"
                >
                  Test
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                Celebration confetti on focus complete
              </span>
              <input
                type="checkbox"
                checked={draft.confettiEnabled}
                onChange={(e) => setDraft({ ...draft, confettiEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Automation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Automation
            </h4>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Auto-start break when study finishes</span>
              <input
                type="checkbox"
                checked={draft.autoStartBreaks}
                onChange={(e) => setDraft({ ...draft, autoStartBreaks: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Auto-start study when break finishes</span>
              <input
                type="checkbox"
                checked={draft.autoStartFocus}
                onChange={(e) => setDraft({ ...draft, autoStartFocus: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow-lg shadow-emerald-500/20 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
