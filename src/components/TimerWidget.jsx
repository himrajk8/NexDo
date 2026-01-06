import React, { useState, useEffect, useRef } from 'react';

const TimerWidget = ({ onPomodoroComplete }) => {
  const [mode, setMode] = useState('clock'); // clock, pomodoro, stopwatch
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroDuration, setPomodoroDuration] = useState(25);
  const [stopwatchLabel, setStopwatchLabel] = useState('');
  const [pomodoroLabel, setPomodoroLabel] = useState('');
  
  const intervalRef = useRef(null);

  useEffect(() => {
    if (mode === 'clock') {
      const updateClock = () => setTime(Date.now()); // Use timestamp for clock
      updateClock();
      intervalRef.current = setInterval(updateClock, 1000);
    } else {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      if (mode === 'pomodoro') setTime(pomodoroDuration * 60);
      else setTime(0);
    }

    return () => clearInterval(intervalRef.current);
  }, [mode, pomodoroDuration]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'pomodoro') {
          setTime(prev => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setIsRunning(false);
              
              // Complete current session
              onPomodoroComplete(pomodoroDuration, pomodoroLabel);
              alert('Pomodoro Finished! Time for a break.');
              
              // Auto-transition logic
              if (pomodoroDuration === 25) {
                setPomodoroDuration(5); // Switch to break
                setPomodoroLabel('Break'); // Optional auto-label
              } else {
                setPomodoroDuration(25); // Switch back to work
                setPomodoroLabel('');
              }
              
              return 0;
            }
            return prev - 1;
          });
        } else if (mode === 'stopwatch') {
          setTime(prev => prev + 1);
        }
      }, 1000);
    } else if (mode !== 'clock') {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, pomodoroDuration, onPomodoroComplete, pomodoroLabel]);

  const formatTime = (seconds) => {
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
    if (mode === 'pomodoro') setTime(pomodoroDuration * 60);
    else {
      setTime(0);
      setStopwatchLabel('');
    }
  };

  return (
    <div className="timer-widget">
      <div className="timer-modes">
        {['clock', 'pomodoro', 'stopwatch'].map(m => (
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
          {[25, 5].map(d => (
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

      {mode === 'stopwatch' && (
        <input 
          type="text" 
          className="stopwatch-label" 
          placeholder="Label your session"
          value={stopwatchLabel}
          onChange={(e) => setStopwatchLabel(e.target.value)}
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
