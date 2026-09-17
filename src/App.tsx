import { useState, useEffect, useMemo, useCallback } from 'react';
import { StudySession, TimerSettings } from './types/timer';
import { loadSessions, saveSessions, loadSettings, saveSettings } from './utils/storage';
import { useTimer } from './hooks/useTimer';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { SessionHistory } from './components/SessionHistory';
import { SettingsModal } from './components/SettingsModal';
import { Coffee, Brain, ShieldCheck } from 'lucide-react';

export function App() {
  const [sessions, setSessions] = useState<StudySession[]>(() => loadSessions());
  const [settings, setSettings] = useState<TimerSettings>(() => loadSettings());
  const [currentTag, setCurrentTag] = useState<string>('General Study');
  const [notes, setNotes] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync sessions to storage
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Sync settings to storage
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Add recorded session
  const handleSessionRecord = useCallback((newSession: StudySession) => {
    setSessions((prev) => [newSession, ...prev]);
    setNotes(''); // clear notes for next session
  }, []);

  // Delete session
  const handleDeleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Clear all sessions
  const handleClearAllSessions = useCallback(() => {
    setSessions([]);
  }, []);

  // Timer hook
  const {
    mode,
    status,
    currentTime,
    progress,
    focusCount,
    start,
    pause,
    reset,
    switchMode,
    finishEarly,
  } = useTimer({
    settings,
    currentTag,
    notes,
    onSessionRecord: handleSessionRecord,
  });

  // Calculate today's stats for header
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(
      (s) => new Date(s.endTime).toDateString() === today
    );
    const totalSeconds = todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    return {
      todaySeconds: totalSeconds,
      todaySessionsCount: todaySessions.length,
    };
  }, [sessions]);

  const handleToggleSound = () => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleScrollToHistory = () => {
    const el = document.getElementById('session-history');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        todayTotalSeconds={todayStats.todaySeconds}
        todaySessionsCount={todayStats.todaySessionsCount}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToHistory={handleScrollToHistory}
      />

      {/* Main Focus Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full">
        {/* Mode Selector Tabs */}
        <ModeSelector
          currentMode={mode}
          onSelectMode={switchMode}
          disabled={status === 'running'}
        />

        {/* Circular Timer Display */}
        <TimerDisplay
          mode={mode}
          status={status}
          currentTime={currentTime}
          progress={progress}
          focusCount={focusCount}
          longBreakInterval={settings.longBreakInterval}
        />

        {/* Timer Action Controls & Topic/Notes */}
        <TimerControls
          mode={mode}
          status={status}
          currentTag={currentTag}
          notes={notes}
          onTagChange={setCurrentTag}
          onNotesChange={setNotes}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onFinishEarly={finishEarly}
        />

        {/* Quick Tips Banner */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl text-xs text-slate-400">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
            <Brain className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">Deep Work:</span> 25-50 min focused blocks optimize retention without fatigue.
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
            <Coffee className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">Active Rest:</span> Step away from screens during breaks to reset cognitive load.
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">Offline Safe:</span> All sessions are recorded locally in your browser automatically.
            </div>
          </div>
        </div>

        {/* History & Analytics Section */}
        <SessionHistory
          sessions={sessions}
          onDeleteSession={handleDeleteSession}
          onClearAll={handleClearAllSessions}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onSave={setSettings}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>StudyTimer • Crafted for deep work and balanced breaks</p>
      </footer>
    </div>
  );
}

export default App;

