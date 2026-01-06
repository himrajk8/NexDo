import React from 'react';

const ActivityList = ({ activities, onToggle, onDelete }) => {
  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const pending = activities.filter(a => !a.completed);
  const completed = activities.filter(a => a.completed);

  const renderItem = (activity, isCompletedList = false) => {
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
        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(activity.id); }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </li>
    );
  };

  return (
    <div className="activity-list-container">
      {pending.length > 0 && (
        <div className="list-section">
          <h3 className="section-title">Pending Tasks</h3>
          <ul className="activity-list">
            {pending.map(a => renderItem(a))}
          </ul>
        </div>
      )}

      {completed.length > 0 && (
        <div className="list-section">
          <h3 className="section-title">Completed</h3>
          <ul className="activity-list">
            {completed.map(a => renderItem(a, true))}
          </ul>
        </div>
      )}
      
      {activities.length === 0 && (
        <div className="empty-state">
          No tasks yet. Add one above!
        </div>
      )}
    </div>
  );
};

export default ActivityList;
