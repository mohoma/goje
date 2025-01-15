export interface TimerSession {
  duration: number;
  type: 'pomodoro' | 'shortBreak' | 'longBreak';
}

export interface TimerSettings {
  sessions: TimerSession[];
  currentSessionIndex: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  currentSession: TimerSession;
}