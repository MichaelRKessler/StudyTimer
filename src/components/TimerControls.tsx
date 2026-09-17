import React, { useState } from 'react';
import { TimerMode, TimerStatus, COMMON_TAGS } from '../types/timer';
import { Play, Pause, RotateCcw, CheckCircle2, Tag, FileText, ChevronDown } from 'lucide-react';

interface TimerControlsProps {
  mode: TimerMode;
  status: TimerStatus;
  currentTag: string;
  notes: string;
  onTagChange: (tag: string) => void;
  onNotesChange: (notes: string) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFinishEarly: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  mode,
  status,
  currentTag,
  notes,
  onTagChange,
  onNotesChange,
  onStart,
  onPause,
  onReset,
  onFinishEarly,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  const isStudyMode = mode === 'focus' || mode === 'stopwatch';

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTagInput.trim()) {
      onTagChange(customTagInput.trim());
      setCustomTagInput('');
      setShowCustomTagInput(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-5">
      {/* Primary Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        {/* Reset Button */}
        <button
          onClick={onReset}
          title="Reset timer"
          className="p-3.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60 shadow-lg hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Main Start / Pause Button */}
        {status === 'running' ? (
          <button
            onClick={onPause}
            className="flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-lg transition-all shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95"
          >
            <Pause className="w-6 h-6 fill-current" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={onStart}
            className="flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-lg transition-all shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>{status === 'paused' ? 'Resume' : 'Start Focus'}</span>
          </button>
        )}

        {/* Finish & Record Early (or Skip Break) */}
        <button
          onClick={onFinishEarly}
          title={isStudyMode ? 'Record session & finish early' : 'Skip break'}
          className="p-3.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-all border border-slate-700/60 shadow-lg hover:scale-105 active:scale-95"
        >
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>

      {/* Study Tag & Notes Bar (Only shown for Study/Focus modes) */}
      {isStudyMode && (
        <div className="w-full bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Tag Selection */}
            <div className="flex items-center gap-2 flex-1 min-w-[220px]">
              <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
              {showCustomTagInput ? (
                <form onSubmit={handleAddCustomTag} className="flex items-center gap-1.5 flex-1">
                  <input
                    type="text"
                    placeholder="Enter custom topic..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    autoFocus
                    className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-900/90 border border-emerald-500/50 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-xs font-semibold"
                  >
                    Set
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomTagInput(false)}
                    className="px-2 py-1 bg-slate-700 text-slate-300 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="relative flex items-center flex-1">
                  <select
                    value={COMMON_TAGS.includes(currentTag) ? currentTag : 'custom'}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomTagInput(true);
                      } else {
                        onTagChange(e.target.value);
                      }
                    }}
                    className="w-full appearance-none bg-slate-900/80 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-8 cursor-pointer"
                  >
                    {COMMON_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    {!COMMON_TAGS.includes(currentTag) && currentTag && (
                      <option value="custom">📌 {currentTag}</option>
                    )}
                    <option value="custom">+ Create custom topic...</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Toggle Notes input */}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                showNotes || notes
                  ? 'bg-slate-700 text-white border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{notes ? 'Edit Notes' : '+ Add Note'}</span>
            </button>
          </div>

          {/* Notes expandable textarea */}
          {showNotes && (
            <div className="pt-2 border-t border-slate-700/50">
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="What are you focusing on during this session? (Optional goals, chapter, problem set...)"
                rows={2}
                className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

