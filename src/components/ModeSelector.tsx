import React from 'react';
import { TimerMode } from '../types/timer';
import { BookOpen, Coffee, Sparkles, Timer } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  disabled = false,
}) => {
  const modes: { mode: TimerMode; label: string; icon: React.ReactNode; activeClass: string }[] = [
    {
      mode: 'focus',
      label: 'Study Focus',
      icon: <BookOpen className="w-4 h-4" />,
      activeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40 dark:shadow-emerald-900/30',
    },
    {
      mode: 'shortBreak',
      label: 'Short Break',
      icon: <Coffee className="w-4 h-4" />,
      activeClass: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/40 dark:shadow-blue-900/30',
    },
    {
      mode: 'longBreak',
      label: 'Long Break',
      icon: <Sparkles className="w-4 h-4" />,
      activeClass: 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/40 dark:shadow-purple-900/30',
    },
    {
      mode: 'stopwatch',
      label: 'Open Study',
      icon: <Timer className="w-4 h-4" />,
      activeClass: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/40 dark:shadow-amber-900/30',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-inner max-w-xl mx-auto">
      {modes.map((item) => {
        const isActive = currentMode === item.mode;
        return (
          <button
            key={item.mode}
            onClick={() => onSelectMode(item.mode)}
            disabled={disabled}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
              isActive
                ? `${item.activeClass} shadow-sm`
                : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
