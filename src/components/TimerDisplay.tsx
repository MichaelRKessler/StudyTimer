import React from 'react';
import { TimerMode, TimerStatus } from '../types/timer';
import { formatTime } from '../utils/formatters';

interface TimerDisplayProps {
  mode: TimerMode;
  status: TimerStatus;
  currentTime: number;
  progress: number; // 0 to 1
  focusCount: number;
  longBreakInterval: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  mode,
  status,
  currentTime,
  progress,
  focusCount,
  longBreakInterval,
}) => {
  // Mode-based color palettes
  const colorMap = {
    focus: {
      ring: 'stroke-emerald-500',
      glow: 'shadow-emerald-500/20',
      bgGlow: 'bg-emerald-500/10 dark:bg-emerald-500/5',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      label: 'Deep Focus',
      subtext: status === 'running' ? 'Keep distractions away' : status === 'paused' ? 'Timer paused' : 'Ready to study?',
    },
    shortBreak: {
      ring: 'stroke-blue-500',
      glow: 'shadow-blue-500/20',
      bgGlow: 'bg-blue-500/10 dark:bg-blue-500/5',
      badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      label: 'Short Break',
      subtext: status === 'running' ? 'Stretch, hydrate, and rest your eyes' : 'Take a breath',
    },
    longBreak: {
      ring: 'stroke-purple-500',
      glow: 'shadow-purple-500/20',
      bgGlow: 'bg-purple-500/10 dark:bg-purple-500/5',
      badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      label: 'Long Break',
      subtext: 'Great milestone achieved! Rest and recharge.',
    },
    stopwatch: {
      ring: 'stroke-amber-500',
      glow: 'shadow-amber-500/20',
      bgGlow: 'bg-amber-500/10 dark:bg-amber-500/5',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      label: 'Open Study Session',
      subtext: status === 'running' ? 'Tracking open focus time...' : 'Study without time limits',
    },
  };

  const currentTheme = colorMap[mode];

  // SVG Circular progress math
  const size = 300;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // clamp progress between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <div className="relative flex flex-col items-center justify-center my-6">
      {/* Ambient background glow */}
      <div
        className={`absolute w-72 h-72 rounded-full blur-3xl -z-10 transition-all duration-700 ${
          status === 'running' ? currentTheme.bgGlow : 'bg-transparent'
        }`}
      />

      {/* Circular Progress Display */}
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 drop-shadow-xl"
        >
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800/80"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated active progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${currentTheme.ring} transition-all duration-300 ease-linear`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <span
            className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border font-semibold mb-2 ${currentTheme.badgeBg}`}
          >
            {currentTheme.label}
          </span>

          {/* Time digits */}
          <div className="font-mono-numbers text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white select-none">
            {formatTime(currentTime)}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-[200px]">
            {currentTheme.subtext}
          </p>

          {/* Cycle Indicators for Focus mode */}
          {mode === 'focus' && (
            <div className="flex items-center gap-1.5 mt-3">
              {Array.from({ length: longBreakInterval }).map((_, index) => {
                const isCompleted = index < (focusCount % longBreakInterval);
                return (
                  <div
                    key={index}
                    title={`Session ${index + 1} of ${longBreakInterval}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-500 dark:bg-emerald-400 ring-2 ring-emerald-500/30 scale-110'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
