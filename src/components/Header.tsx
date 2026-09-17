import React from 'react';
import { Clock, Flame, Settings, History, Volume2, VolumeX } from 'lucide-react';
import { formatDurationHuman } from '../utils/formatters';

interface HeaderProps {
  todayTotalSeconds: number;
  todaySessionsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onScrollToHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  todayTotalSeconds,
  todaySessionsCount,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onScrollToHistory,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-6 flex items-center justify-between border-b border-slate-800/80">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            StudyTimer
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-slate-400">Focus & Break Tracker</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Today's Stats Badge */}
        <div className="hidden sm:flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{todaySessionsCount} {todaySessionsCount === 1 ? 'session' : 'sessions'}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-300">
            <span className="text-slate-400">Today:</span>{' '}
            <span className="font-semibold text-white">{formatDurationHuman(todayTotalSeconds)}</span>
          </div>
        </div>

        {/* Quick Sound Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* View History Button */}
        <button
          onClick={onScrollToHistory}
          title="View Session History"
          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50 flex items-center space-x-1.5 text-xs font-medium"
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">History</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Timer Settings"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

