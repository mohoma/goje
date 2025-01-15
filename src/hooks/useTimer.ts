import { useState, useEffect, useCallback } from 'react';
import { TimerSettings, TimerState, TimerSession } from '../types/timer';

const STORAGE_KEY = 'pomodoro-settings';

export const useTimer = (initialSettings: TimerSettings) => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialSettings;
  });

  const [state, setState] = useState<TimerState>({
    timeLeft: settings.sessions[0].duration * 60,
    isRunning: false,
    sessionsCompleted: 0,
    currentSession: settings.sessions[0],
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const resetTimer = useCallback(() => {
    const currentSession = settings.sessions[settings.currentSessionIndex];
    setState(prev => ({
      ...prev,
      timeLeft: currentSession.duration * 60,
      isRunning: false,
      currentSession,
    }));
  }, [settings]);

  const toggleTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const skipTimer = useCallback(() => {
    const nextIndex = (settings.currentSessionIndex + 1) % settings.sessions.length;
    const nextSession = settings.sessions[nextIndex];
    const shouldAutoStart = nextSession.type === 'pomodoro' 
      ? settings.autoStartPomodoros 
      : settings.autoStartBreaks;
    
    setState(prev => ({
      ...prev,
      timeLeft: nextSession.duration * 60,
      isRunning: shouldAutoStart,
      sessionsCompleted: prev.sessionsCompleted + 1,
      currentSession: nextSession,
    }));
    
    setSettings(prev => ({ ...prev, currentSessionIndex: nextIndex }));
  }, [settings]);

  useEffect(() => {
    let interval: number;

    if (state.isRunning && state.timeLeft > 0) {
      interval = window.setInterval(() => {
        setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (state.timeLeft === 0) {
      skipTimer();
    }

    return () => clearInterval(interval);
  }, [state.isRunning, state.timeLeft, skipTimer]);

  return {
    state,
    settings,
    setSettings,
    resetTimer,
    toggleTimer,
    skipTimer,
  };
};