import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerMode, TimerStatus, TimerSettings, StudySession } from '../types/timer';
import { formatTime } from '../utils/formatters';
import { playCompletionSound, playBreakSound, playStartSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface UseTimerProps {
  settings: TimerSettings;
  currentTag: string;
  notes: string;
  onSessionRecord: (session: StudySession) => void;
}

export function useTimer({ settings, currentTag, notes, onSessionRecord }: UseTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [focusCount, setFocusCount] = useState<number>(0);

  // Time remaining (for countdown modes) or elapsed (for stopwatch) in seconds
  const [timeLeft, setTimeLeft] = useState<number>(settings.focusDurationMinutes * 60);
  const [stopwatchElapsed, setStopwatchElapsed] = useState<number>(0);

  // Track start timestamps for drift-free timing
  const startTimeRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<string | null>(null);
  const pausedTimeRef = useRef<number>(0); // accumulated seconds before current running slice

  // Get configured duration in seconds for a countdown mode
  const getModeDuration = useCallback((m: TimerMode): number => {
    switch (m) {
      case 'focus':
        return settings.focusDurationMinutes * 60;
      case 'shortBreak':
        return settings.shortBreakDurationMinutes * 60;
      case 'longBreak':
        return settings.longBreakDurationMinutes * 60;
      case 'stopwatch':
        return 0;
    }
  }, [settings]);

  // Update timeLeft when settings change if idle
  useEffect(() => {
    if (status === 'idle') {
      if (mode !== 'stopwatch') {
        setTimeLeft(getModeDuration(mode));
      } else {
        setStopwatchElapsed(0);
      }
    }
  }, [settings, mode, status, getModeDuration]);

  // Complete current session
  const handleComplete = useCallback(() => {
    const isFocus = mode === 'focus';
    const duration = isFocus ? getModeDuration('focus') : (mode === 'stopwatch' ? stopwatchElapsed : getModeDuration(mode));

    if (settings.soundEnabled) {
      if (isFocus) {
        playCompletionSound(settings.volume);
      } else {
        playBreakSound(settings.volume);
      }
    }

    if (isFocus && settings.confettiEnabled) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }

    // If it was a focus session or stopwatch study session, record it
    if (isFocus || (mode === 'stopwatch' && stopwatchElapsed >= 30)) {
      const newSession: StudySession = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        startTime: sessionStartTimeRef.current || new Date(Date.now() - duration * 1000).toISOString(),
        endTime: new Date().toISOString(),
        durationSeconds: duration,
        mode: isFocus ? 'focus' : 'stopwatch',
        subjectTag: currentTag || 'General Study',
        notes: notes.trim() || undefined,
        completed: true,
      };
      onSessionRecord(newSession);
    }

    // Determine next mode
    if (isFocus) {
      const nextCount = focusCount + 1;
      setFocusCount(nextCount);
      const isLongBreak = nextCount % settings.longBreakInterval === 0;
      const nextMode: TimerMode = isLongBreak ? 'longBreak' : 'shortBreak';
      
      setMode(nextMode);
      const nextDuration = getModeDuration(nextMode);
      setTimeLeft(nextDuration);
      setStatus(settings.autoStartBreaks ? 'running' : 'idle');
      
      if (settings.autoStartBreaks) {
        startTimeRef.current = Date.now();
        pausedTimeRef.current = 0;
        sessionStartTimeRef.current = new Date().toISOString();
      } else {
        startTimeRef.current = null;
        pausedTimeRef.current = 0;
        sessionStartTimeRef.current = null;
      }
    } else if (mode === 'shortBreak' || mode === 'longBreak') {
      // Break completed -> return to focus
      setMode('focus');
      setTimeLeft(getModeDuration('focus'));
      setStatus(settings.autoStartFocus ? 'running' : 'idle');

      if (settings.autoStartFocus) {
        startTimeRef.current = Date.now();
        pausedTimeRef.current = 0;
        sessionStartTimeRef.current = new Date().toISOString();
      } else {
        startTimeRef.current = null;
        pausedTimeRef.current = 0;
        sessionStartTimeRef.current = null;
      }
    } else {
      // Stopwatch stopped
      setStatus('idle');
      setStopwatchElapsed(0);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
      sessionStartTimeRef.current = null;
    }
  }, [mode, getModeDuration, stopwatchElapsed, settings, focusCount, currentTag, notes, onSessionRecord]);

  // Main timing loop
  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - (startTimeRef.current || now)) / 1000);
      const totalElapsed = pausedTimeRef.current + elapsedSinceStart;

      if (mode === 'stopwatch') {
        setStopwatchElapsed(totalElapsed);
      } else {
        const totalDuration = getModeDuration(mode);
        const remaining = totalDuration - totalElapsed;

        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          handleComplete();
        } else {
          setTimeLeft(remaining);
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [status, mode, getModeDuration, handleComplete]);

  // Update browser tab title
  useEffect(() => {
    const modeLabel = mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : mode === 'longBreak' ? 'Long Break' : 'Stopwatch';
    const display = mode === 'stopwatch' ? formatTime(stopwatchElapsed) : formatTime(timeLeft);
    const indicator = status === 'running' ? '▶' : status === 'paused' ? '⏸' : '';
    document.title = `${indicator} ${display} - ${modeLabel} | StudyTimer`;
  }, [timeLeft, stopwatchElapsed, mode, status]);

  const start = useCallback(() => {
    if (settings.soundEnabled) {
      playStartSound(settings.volume);
    }
    startTimeRef.current = Date.now();
    if (!sessionStartTimeRef.current) {
      sessionStartTimeRef.current = new Date().toISOString();
    }
    setStatus('running');
  }, [settings]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    const now = Date.now();
    const elapsedSinceStart = Math.floor((now - (startTimeRef.current || now)) / 1000);
    pausedTimeRef.current += elapsedSinceStart;
    startTimeRef.current = null;
    setStatus('paused');
  }, [status]);

  const reset = useCallback(() => {
    setStatus('idle');
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    sessionStartTimeRef.current = null;
    if (mode === 'stopwatch') {
      setStopwatchElapsed(0);
    } else {
      setTimeLeft(getModeDuration(mode));
    }
  }, [mode, getModeDuration]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setStatus('idle');
    setMode(newMode);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    sessionStartTimeRef.current = null;
    if (newMode === 'stopwatch') {
      setStopwatchElapsed(0);
    } else {
      setTimeLeft(getModeDuration(newMode));
    }
  }, [getModeDuration]);

  const finishEarly = useCallback(() => {
    if (mode === 'stopwatch' || (mode === 'focus' && (pausedTimeRef.current > 0 || status === 'running'))) {
      const now = Date.now();
      const currentRun = startTimeRef.current ? Math.floor((now - startTimeRef.current) / 1000) : 0;
      const actualDuration = pausedTimeRef.current + currentRun;

      if (actualDuration >= 10) { // save if at least 10 seconds spent
        const newSession: StudySession = {
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
          startTime: sessionStartTimeRef.current || new Date(Date.now() - actualDuration * 1000).toISOString(),
          endTime: new Date().toISOString(),
          durationSeconds: actualDuration,
          mode: mode === 'stopwatch' ? 'stopwatch' : 'focus',
          subjectTag: currentTag || 'General Study',
          notes: notes.trim() || undefined,
          completed: false,
        };
        onSessionRecord(newSession);
      }
    }
    reset();
  }, [mode, status, currentTag, notes, onSessionRecord, reset]);

  // Progress percentage (0 to 1)
  const progress = mode === 'stopwatch'
    ? (stopwatchElapsed % 60) / 60
    : 1 - timeLeft / Math.max(1, getModeDuration(mode));

  const currentTime = mode === 'stopwatch' ? stopwatchElapsed : timeLeft;

  return {
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
    handleComplete,
  };
}

