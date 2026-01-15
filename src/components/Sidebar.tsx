import { TaskHistory, PomodoroSession } from '../types';

interface SidebarProps {
  taskHistory: TaskHistory;
  pomodoroHistory: PomodoroSession[];
  onQuickAdd: (taskName: string) => void;
  onResetHistory: () => void;
  onDeleteHistoryItem: (taskName: string) => void;
}

const Sidebar = ({ taskHistory, pomodoroHistory, onQuickAdd, onResetHistory, onDeleteHistoryItem }: SidebarProps) => {
  const sortedHistory = Object.entries(taskHistory).sort((a, b) => b[1].count - a[1].count);

  const handleReset = () => {
    onResetHistory();
  };



  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ margin: 0 }}>Repeated Tasks</h2>
        {sortedHistory.length > 0 && (
          <button 
            onClick={handleReset}
            style={{
              background: 'transparent',
              border: '1px solid var(--danger-color)',
              color: 'var(--danger-color)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '0.7rem',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = 'var(--danger-color)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--danger-color)';
              e.currentTarget.style.opacity = '0.8';
            }}
          >
            Reset
          </button>
        )}
      </div>
      <ul className="history-list">
        {sortedHistory.map(([name, data]) => (
          <li 
            key={name} 
            className="history-item" 
            title="Click to add to list"
            onClick={() => onQuickAdd(name)}
          >
            <div className="history-header">
              <span className="history-name">{name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="history-count">{data.count}</span>
                <button 
                  className="delete-btn"
                  style={{ width: '20px', height: '20px', opacity: 0.6 }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onDeleteHistoryItem(name);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
            <div className="history-dates">
              {data.timestamps.map((ts, index) => (
                <div key={index}>
                  {new Date(ts).toLocaleDateString()} {new Date(ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      
      <h2 style={{ marginTop: '2rem' }}>Pomodoro Log</h2>
      <ul className="history-list">
        {pomodoroHistory.map((session, index) => (
          <li key={index} className="history-item" style={{ cursor: 'default' }}>
            <div className="history-header">
              <span className="history-name">
                {session.label 
                  ? `${session.duration}m - ${session.label}` 
                  : (session.duration === 25 || session.duration === 50) 
                    ? 'Work' 
                    : session.duration === 5 
                      ? '5m Break' 
                    : session.duration === 10
                      ? '10m Break'
                      : `${session.duration}m Session`}
              </span>
            </div>
            <div className="history-dates">
              {new Date(session.timestamp).toLocaleDateString()} {new Date(session.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
