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
      activeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-900/30',
    },
    {
      mode: 'shortBreak',
      label: 'Short Break',
      icon: <Coffee className="w-4 h-4" />,
      activeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-blue-900/30',
    },
    {
      mode: 'longBreak',
      label: 'Long Break',
      icon: <Sparkles className="w-4 h-4" />,
      activeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-purple-900/30',
    },
    {
      mode: 'stopwatch',
      label: 'Open Study',
      icon: <Timer className="w-4 h-4" />,
      activeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-900/30',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-inner max-w-xl mx-auto">
      {modes.map((item) => {
        const isActive = currentMode === item.mode;
        return (
          <button
            key={item.mode}
            onClick={() => onSelectMode(item.mode)}
            disabled={disabled}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
              isActive
                ? `${item.activeClass} shadow-md`
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-700/50'
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

