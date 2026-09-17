export type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'stopwatch';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface StudySession {
  id: string;
  startTime: string;       // ISO string
  endTime: string;         // ISO string
  durationSeconds: number; // duration in seconds
  mode: 'focus' | 'stopwatch';
  subjectTag: string;
  notes?: string;
  completed: boolean;
}

export interface TimerSettings {
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  volume: number; // 0.0 to 1.0
  confettiEnabled: boolean;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  focusDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  volume: 0.6,
  confettiEnabled: true,
};

export const COMMON_TAGS = [
  'General Study',
  'Mathematics',
  'Computer Science',
  'Reading',
  'Writing & Essays',
  'Languages',
  'Exam Prep'
];

