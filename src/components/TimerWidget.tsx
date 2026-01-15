import { useState, useEffect, useRef } from 'react';

interface TimerWidgetProps {
  onPomodoroComplete: (duration: number, label: string) => void;
  onAlert: (message: string) => void;
}

const TimerWidget = ({ onPomodoroComplete, onAlert }: TimerWidgetProps) => {
  const [mode, setMode] = useState('clock'); // clock, pomodoro
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroDuration, setPomodoroDuration] = useState(25);
  const [pomodoroLabel, setPomodoroLabel] = useState('');
  
  const intervalRef = useRef<number | null>(null);
  const isCompletingRef = useRef(false);

  useEffect(() => {
    if (mode === 'clock') {
      const updateClock = () => setTime(Date.now()); // Use timestamp for clock
      updateClock();
      intervalRef.current = window.setInterval(updateClock, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
      isCompletingRef.current = false;
      if (mode === 'pomodoro') setTime(pomodoroDuration * 60);
      else setTime(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mode, pomodoroDuration]);

  useEffect(() => {
    if (isRunning) {
      // Calculate the target end time based on current remaining seconds
      const endTime = Date.now() + time * 1000;

      intervalRef.current = window.setInterval(() => {
        if (mode === 'pomodoro') {
          const now = Date.now();
          const remaining = Math.ceil((endTime - now) / 1000);

          if (remaining <= 0) {
            if (isCompletingRef.current) return;
            isCompletingRef.current = true;

            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsRunning(false);
            setTime(0);
            
            // Complete current session
            onPomodoroComplete(pomodoroDuration, pomodoroLabel);
            
            if (pomodoroDuration === 5 || pomodoroDuration === 10) {
              onAlert('Break is over! Time to focus.');
            } else if (pomodoroDuration === 25 || pomodoroDuration === 50) {
              onAlert('Great work! Time for a break.');
            } else {
              onAlert('Timer Finished!');
            }
            
            // Auto-transition logic
            if (pomodoroDuration === 25) {
              setPomodoroDuration(5); // Switch to short break
              setPomodoroLabel('Break');
            } else if (pomodoroDuration === 50) {
              setPomodoroDuration(10); // Switch to long break
              setPomodoroLabel('Break');
            } else if (pomodoroDuration === 5) {
              setPomodoroDuration(25); // Switch back to normal work
              setPomodoroLabel('');
            } else if (pomodoroDuration === 10) {
              setPomodoroDuration(50); // Switch back to long work
              setPomodoroLabel('');
            }
          } else {
             setTime(remaining);
          }
        }
      }, 100); // Run faster check (100ms) for responsiveness
    } else if (mode !== 'clock') {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode, pomodoroDuration, onPomodoroComplete, pomodoroLabel, onAlert]); // Exclude 'time' to capture it only on start

  const formatTime = (seconds: number) => {
    if (mode === 'clock') {
      return new Date(seconds).toLocaleTimeString();
    }
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const mStr = m.toString().padStart(2, '0');
    const sStr = s.toString().padStart(2, '0');
    
    if (h > 0) return `${h.toString().padStart(2, '0')}:${mStr}:${sStr}`;
    return `${mStr}:${sStr}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    isCompletingRef.current = false;
    if (mode === 'pomodoro') setTime(pomodoroDuration * 60);
    else {
      setTime(0);
    }
  };

  return (
    <div className="timer-widget">
      <div className="timer-modes">
        {['clock', 'pomodoro'].map(m => (
          <button 
            key={m}
            className={`mode-btn ${mode === m ? 'active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {mode === 'pomodoro' && (
        <div className="pomodoro-controls">
          {[25, 5, 50, 10].map(d => (
            <button 
              key={d}
              className={`pomo-btn ${pomodoroDuration === d ? 'active' : ''}`}
              onClick={() => setPomodoroDuration(d)}
            >
              {d}m
            </button>
          ))}
        </div>
      )}

      <div className="timer-display">{formatTime(time)}</div>

      {mode === 'pomodoro' && (
        <input 
          type="text" 
          className="stopwatch-label" 
          placeholder="Label your session"
          value={pomodoroLabel}
          onChange={(e) => setPomodoroLabel(e.target.value)}
        />
      )}



      {mode !== 'clock' && (
        <div className="timer-controls">
          {!isRunning ? (
            <button className="control-btn" onClick={handleStart}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </button>
          ) : (
            <button className="control-btn" onClick={handlePause}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            </button>
          )}
          <button className="control-btn" onClick={handleReset}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"></path><path d="M3 3v9h9"></path></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default TimerWidget;
