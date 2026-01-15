import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TimerWidget from './components/TimerWidget';
import ActivityList from './components/ActivityList';
import ProgressBar from './components/ProgressBar';
import PomodoroStats from './components/PomodoroStats';
import Modal from './components/Modal';
import { Activity, TaskHistory, PomodoroSession } from './types';

function App() {
  // State
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [taskHistory, setTaskHistory] = useState<TaskHistory>(() => {
    const saved = localStorage.getItem('taskHistory');
    return saved ? JSON.parse(saved) : {};
  });

  const [pomodoroHistory, setPomodoroHistory] = useState<PomodoroSession[]>(() => {
    const saved = localStorage.getItem('pomodoroHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [inputValue, setInputValue] = useState<string>('');
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'dark');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    isDanger: boolean;
    confirmText?: string;
    cancelText?: string | null;
  }>({
    title: '',
    message: '',
    onConfirm: () => {},
    isDanger: false,
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });

  // Effects
  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
  }, [taskHistory]);

  useEffect(() => {
    localStorage.setItem('pomodoroHistory', JSON.stringify(pomodoroHistory));
  }, [pomodoroHistory]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  // Mouse Follower Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.body.style.setProperty('--x', `${e.clientX}px`);
      document.body.style.setProperty('--y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handlers
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addActivity = (text?: string) => {
    const taskText = text || inputValue.trim();
    if (!taskText) return;

    const newActivity: Activity = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: Date.now(),
      completedAt: null
    };

    setActivities(prev => [...prev, newActivity]);
    if (!text) setInputValue('');
  };

  const toggleActivity = (id: number) => {
    const activity = activities.find(a => a.id === id);
    if (!activity) return;

    // If already completed, do not allow unticking (as per user request)
    if (activity.completed) return;

    const isCompleted = !activity.completed;
    const completedAt = isCompleted ? Date.now() : null;

    setActivities(prev => prev.map(a => 
      a.id === id 
        ? { ...a, completed: isCompleted, completedAt } 
        : a
    ));

    if (isCompleted) {
      updateHistory(activity.text, completedAt);
    }
  };

  const updateHistory = (taskName: string, timestamp: number | null) => {
    if (!timestamp) return;
    const normalizedName = taskName.trim();
    
    setTaskHistory(prev => {
      const current = prev[normalizedName] || { count: 0, timestamps: [] };
      const newTimestamps = [timestamp, ...current.timestamps].slice(0, 2);
      
      return {
        ...prev,
        [normalizedName]: {
          count: current.count + 1,
          timestamps: newTimestamps
        }
      };
    });
  };

  const deleteActivity = (id: number) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const confirmResetHistory = () => {
    setModalConfig({
      title: 'Reset History?',
      message: 'Are you sure you want to reset the repeated tasks history? This cannot be undone.',
      onConfirm: () => {
        setTaskHistory({});
        localStorage.removeItem('taskHistory');
      },
      isDanger: true
    });
    setIsModalOpen(true);
  };

  const confirmDeleteHistoryItem = (taskName: string) => {
    setModalConfig({
      title: 'Delete Task History?',
      message: `Are you sure you want to remove "${taskName}" from your history?`,
      onConfirm: () => {
        setTaskHistory(prev => {
          const newHistory = { ...prev };
          delete newHistory[taskName];
          return newHistory;
        });
      },
      isDanger: true
    });
    setIsModalOpen(true);
  };

  const handlePomodoroComplete = (duration: number, label: string) => {
    const session: PomodoroSession = {
      duration,
      label,
      timestamp: Date.now()
    };
    setPomodoroHistory(prev => [session, ...prev].slice(0, 10));
  };

  const handleTimerAlert = (message: string) => {
    setModalConfig({
      title: 'Timer Complete',
      message: message,
      onConfirm: () => {}, // No action needed on confirm
      isDanger: false,
      confirmText: 'OK',
      cancelText: null // Hide cancel button
    });
    setIsModalOpen(true);
  };

  const pendingActivities = activities.filter(a => !a.completed);
  const completedActivities = activities.filter(a => a.completed);

  return (
    <>


      <div className="app-header">
        <div className="brand">Nexdo</div>
        
        <div className="header-title-group">
          <h1 className="header-title">Activity Tracker</h1>
          <p className="header-subtitle">Stay productive, track your progress.</p>
        </div>
        <button 
          className="theme-toggle header-toggle" 
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          ) : (
            <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          )}
        </button>
      </div>

      <div className="main-wrapper">
        <Sidebar 
          taskHistory={taskHistory} 
          pomodoroHistory={pomodoroHistory} 
          onQuickAdd={addActivity} 
          onResetHistory={confirmResetHistory}
          onDeleteHistoryItem={confirmDeleteHistoryItem}
        />

        <div className="container">

          <ProgressBar activities={activities} />

          <div className="input-group">
            <input 
              type="text" 
              id="activity-input" 
              placeholder="Add a new activity..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addActivity()}
            />
            <button id="add-btn" onClick={() => addActivity()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>

          <h3 className="section-title">Pending Tasks</h3>
          <ActivityList 
            activities={pendingActivities} 
            onToggle={toggleActivity} 
            onDelete={deleteActivity} 
          />
        </div>

        <aside className="right-sidebar">
          <div style={{ width: '100%' }}>
            <TimerWidget 
              onPomodoroComplete={handlePomodoroComplete} 
              onAlert={handleTimerAlert}
            />
          </div>
          <PomodoroStats pomodoroHistory={pomodoroHistory} />
          
          <div className="completed-tasks-box">
            <h3 className="section-title">Completed Tasks</h3>
            <ActivityList 
              activities={completedActivities} 
              onToggle={toggleActivity} 
              onDelete={deleteActivity}
              isCompletedList={true}
            />
          </div>
        </aside>
      </div>
      
      <footer>
        &copy; {new Date().getFullYear()} Nexdo. All rights reserved.
      </footer>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        isDanger={modalConfig.isDanger}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />
    </>
  );
}

export default App;
