import { Activity } from '../types';

interface ActivityListProps {
  activities: Activity[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isCompletedList?: boolean;
}

const ActivityList = ({ activities, onToggle, onDelete, isCompletedList = false }: ActivityListProps) => {
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  if (activities.length === 0) {
    return (
      <div className="empty-state">
        {isCompletedList ? "No completed tasks yet." : "No tasks yet. Add one above!"}
      </div>
    );
  }

  return (
    <ul className="activity-list">
      {activities.map(activity => {
        const createdDate = new Date(activity.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        let metaText = `Added at ${createdDate}`;

        if (activity.completed && activity.completedAt) {
          const duration = activity.completedAt - activity.createdAt;
          metaText = `Completed in ${formatDuration(duration)}`;
        }

        return (
          <li key={activity.id} className={`activity-item ${activity.completed ? 'completed' : ''}`}>
            <div 
              className={`checkbox ${isCompletedList ? 'disabled' : ''}`} 
              role="button" 
              onClick={() => !isCompletedList && onToggle(activity.id)}
              style={{ cursor: isCompletedList ? 'default' : 'pointer' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="activity-text">
              <span>{activity.text}</span>
              <span className="activity-meta">{metaText}</span>
            </div>
            <button className="delete-btn" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDelete(activity.id); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ActivityList;
