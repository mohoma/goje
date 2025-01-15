import React from 'react';
import { TimerSettings, TimerSession } from '../types/timer';
import { Plus, Minus } from 'lucide-react';

interface SettingsProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
  const addSession = () => {
    const newSessions = [...settings.sessions, {
      duration: 25,
      type: 'pomodoro' as const,
    }];
    onSettingsChange({ ...settings, sessions: newSessions });
  };

  const removeSession = (index: number) => {
    if (settings.sessions.length > 1) {
      const newSessions = settings.sessions.filter((_, i) => i !== index);
      onSettingsChange({ 
        ...settings, 
        sessions: newSessions,
        currentSessionIndex: Math.min(settings.currentSessionIndex, newSessions.length - 1)
      });
    }
  };

  const updateSession = (index: number, updates: Partial<TimerSession>) => {
    const newSessions = settings.sessions.map((session, i) => 
      i === index ? { ...session, ...updates } : session
    );
    onSettingsChange({ ...settings, sessions: newSessions });
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-200">Session Settings</h2>
        <button
          onClick={addSession}
          className="p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-all transform hover:scale-105"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 space-y-4">
          <h3 className="font-medium text-gray-300">Auto-start Options</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  autoStartBreaks: e.target.checked
                })}
                className="rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-gray-300">Auto-start breaks</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.autoStartPomodoros}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  autoStartPomodoros: e.target.checked
                })}
                className="rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-gray-300">Auto-start focus sessions</span>
            </label>
          </div>
        </div>

        {settings.sessions.map((session, index) => (
          <div key={index} className="backdrop-blur-sm bg-white/5 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-300">Session {index + 1}</span>
              {settings.sessions.length > 1 && (
                <button
                  onClick={() => removeSession(index)}
                  className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <Minus size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={session.duration}
                  onChange={(e) => updateSession(index, { duration: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Type
                </label>
                <select
                  value={session.type}
                  onChange={(e) => updateSession(index, { type: e.target.value as TimerSession['type'] })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="pomodoro">Focus</option>
                  <option value="shortBreak">Short Break</option>
                  <option value="longBreak">Long Break</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};