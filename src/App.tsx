import { useState } from 'react';
import { Settings } from './components/Settings';
import { TimerDisplay } from './components/TimerDisplay';
import { useTimer } from './hooks/useTimer';
import { TimerSettings } from './types/timer';
import { Settings as SettingsIcon } from 'lucide-react';

const initialSettings: TimerSettings = {
  sessions: [
    { duration: 25, type: 'pomodoro' },
    { duration: 5, type: 'shortBreak' },
    { duration: 45, type: 'pomodoro' },
    { duration: 15, type: 'longBreak' },
  ],
  currentSessionIndex: 0,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

function App() {
  const { state, settings, setSettings, resetTimer, toggleTimer, skipTimer } = useTimer(initialSettings);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div
                className="text-4xl font-bold text-center ">
              <span className="bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">
                Goje
              </span>
              <span className="pl-1">🍅</span>
            </div>


            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <SettingsIcon className="w-6 h-6 text-[#FFEB3B]" />
            </button>
          </div>
          
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 space-y-8">
            {!showSettings && (
              <TimerDisplay
                state={state}
                onToggle={toggleTimer}
                onReset={resetTimer}
                onSkip={skipTimer}
              />
            )}
            
            {showSettings && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                <Settings
                  settings={settings}
                  onSettingsChange={setSettings}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;