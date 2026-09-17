import React, { useState, useMemo } from 'react';
import { StudySession } from '../types/timer';
import { formatDateTime, formatDurationHuman } from '../utils/formatters';
import { exportSessionsAsJSON } from '../utils/storage';
import { BookOpen, Calendar, Trash2, Download, CheckCircle, Clock, BarChart3, Filter } from 'lucide-react';

interface SessionHistoryProps {
  sessions: StudySession[];
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  onDeleteSession,
  onClearAll,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Compute analytics
  const stats = useMemo(() => {
    const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const totalCount = sessions.length;

    const today = new Date().toDateString();
    const todaySessions = sessions.filter(
      (s) => new Date(s.endTime).toDateString() === today
    );
    const todaySeconds = todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0);

    // Subject breakdown
    const subjectMap: Record<string, number> = {};
    sessions.forEach((s) => {
      const tag = s.subjectTag || 'General Study';
      subjectMap[tag] = (subjectMap[tag] || 0) + s.durationSeconds;
    });

    const subjects = Object.entries(subjectMap).sort((a, b) => b[1] - a[1]);

    return {
      totalSeconds,
      totalCount,
      todaySeconds,
      todayCount: todaySessions.length,
      subjects,
    };
  }, [sessions]);

  // Filtered session list
  const filteredSessions = useMemo(() => {
    if (selectedFilter === 'all') return sessions;
    if (selectedFilter === 'today') {
      const today = new Date().toDateString();
      return sessions.filter((s) => new Date(s.endTime).toDateString() === today);
    }
    return sessions.filter((s) => s.subjectTag === selectedFilter);
  }, [sessions, selectedFilter]);

  return (
    <div id="session-history" className="w-full max-w-4xl mx-auto mt-12 mb-16 px-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Study History & Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track your recorded study blocks, time investments, and consistency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sessions.length > 0 && (
            <>
              <button
                onClick={() => exportSessionsAsJSON(sessions)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs border border-slate-700 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your entire study history?')) {
                    onClearAll();
                  }
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-colors text-xs border border-red-800/40 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <p className="text-xs text-slate-400 font-medium">Today's Study Time</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {formatDurationHuman(stats.todaySeconds)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{stats.todayCount} sessions today</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <p className="text-xs text-slate-400 font-medium">All-Time Study Time</p>
          <p className="text-xl font-bold text-white mt-1">
            {formatDurationHuman(stats.totalSeconds)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{stats.totalCount} total sessions</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <p className="text-xs text-slate-400 font-medium">Top Subject</p>
          <p className="text-base font-bold text-teal-300 truncate mt-1">
            {stats.subjects[0] ? stats.subjects[0][0] : 'None yet'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {stats.subjects[0] ? formatDurationHuman(stats.subjects[0][1]) : '0m'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <p className="text-xs text-slate-400 font-medium">Avg Session</p>
          <p className="text-xl font-bold text-amber-400 mt-1">
            {stats.totalCount > 0 ? formatDurationHuman(Math.round(stats.totalSeconds / stats.totalCount)) : '0m'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Per focus block</p>
        </div>
      </div>

      {/* Filter Chips */}
      {sessions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
              selectedFilter === 'all'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
          >
            All ({sessions.length})
          </button>
          <button
            onClick={() => setSelectedFilter('today')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
              selectedFilter === 'today'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
          >
            Today ({stats.todayCount})
          </button>
          {stats.subjects.map(([tag]) => (
            <button
              key={tag}
              onClick={() => setSelectedFilter(tag)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
                selectedFilter === tag
                  ? 'bg-teal-500/20 text-teal-400 border-teal-500/40 font-semibold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-800/30 border border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">No study sessions recorded yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Hit "Start Focus" to begin your first study timer. Completed sessions will automatically record here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/50 transition-all flex items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    session.mode === 'focus'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {session.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {session.subjectTag || 'General Study'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/40">
                      {session.mode === 'focus' ? 'Pomodoro' : 'Open Study'}
                    </span>
                    {!session.completed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Partial
                      </span>
                    )}
                  </div>

                  {session.notes && (
                    <p className="text-xs text-slate-300 mt-1 italic">
                      "{session.notes}"
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {formatDateTime(session.endTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="font-mono-numbers text-sm sm:text-base font-bold text-emerald-400">
                  {formatDurationHuman(session.durationSeconds)}
                </span>

                <button
                  onClick={() => onDeleteSession(session.id)}
                  title="Delete record"
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

