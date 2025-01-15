import React, { useState, useEffect } from 'react';
import { Timer, Pause, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '../utils/timeFormat';
import { TimerState } from '../types/timer';
import useSound from 'use-sound';

const FOCUS_COMPLETE_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
const BREAK_COMPLETE_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

interface TimerDisplayProps {
  state: TimerState;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  state,
  onToggle,
  onReset,
  onSkip,
}) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const [playFocusComplete] = useSound(FOCUS_COMPLETE_SOUND, { 
    volume: isSoundEnabled ? 1 : 0 
  });
  const [playBreakComplete] = useSound(BREAK_COMPLETE_SOUND, { 
    volume: isSoundEnabled ? 1 : 0 
  });

  useEffect(() => {
    if (state.timeLeft === 0 && isSoundEnabled) {
      if (state.currentSession.type === 'pomodoro') {
        playFocusComplete();
      } else {
        playBreakComplete();
      }
    }
  }, [state.timeLeft, state.currentSession.type, isSoundEnabled, playFocusComplete, playBreakComplete]);

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-2xl font-medium text-gray-200">
        {state.currentSession.type === 'pomodoro' ? 'Focus Time' : 
         state.currentSession.type === 'shortBreak' ? 'Short Break' : 'Long Break'}
      </div>
      
      <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-300">
        <div className="absolute inset-0 bg-gradient-to-br  from-primary to-[#85A947] opacity-75 rounded-2xl transform -rotate-2" />
        <div className="relative bg-black/50 backdrop-blur-lg rounded-2xl p-12 border border-white/10">
          <div className="text-8xl font-bold text-white tabular-nums font-mono">
            {formatTime(state.timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={onToggle}
          className="p-4 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 transition-all transform hover:scale-110"
        >
          {state.isRunning ? 
            <Pause size={28} className="text-primary" /> :
            <Timer size={28} className="text-primary" />
          }
        </button>
        <button
          onClick={onReset}
          className="p-4 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 transition-all transform hover:scale-110"
        >
          <RotateCcw size={28} className="text-primary" />
        </button>
        <button
          onClick={onSkip}
          className="p-4 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 transition-all transform hover:scale-110"
        >
          <SkipForward size={28} className="text-primary" />
        </button>
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className="p-4 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 transition-all transform hover:scale-110"
        >
          {isSoundEnabled ? 
            <Volume2 size={28} className="text-primary" /> :
            <VolumeX size={28} className="text-primary" />
          }
        </button>
      </div>

      <div className="text-sm text-gray-400">
        Sessions completed: {state.sessionsCompleted}
      </div>
    </div>
  );
};