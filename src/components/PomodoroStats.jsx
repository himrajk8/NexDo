import React from 'react';

const PomodoroStats = ({ pomodoroHistory }) => {
  // Helper to get last 7 days
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString(undefined, { weekday: 'short' })); // e.g., "Mon"
    }
    return days;
  };

  // Process data
  const data = {};
  const last7Days = getLast7Days();
  
  // Initialize with 0
  last7Days.forEach(day => data[day] = 0);

  pomodoroHistory.forEach(session => {
    const date = new Date(session.timestamp);
    const dayStr = date.toLocaleDateString(undefined, { weekday: 'short' });
    
    // Only count if it's within the last 7 days (roughly check)
    if (data[dayStr] !== undefined) {
      data[dayStr] += session.duration;
    }
  });

  const maxMinutes = Math.max(...Object.values(data), 60); // Min scale 60m

  return (
    <div className="pomodoro-stats">
      <h3>Focus History (Last 7 Days)</h3>
      <div className="chart-container">
        {Object.entries(data).map(([day, minutes]) => {
          const height = Math.max((minutes / maxMinutes) * 100, 5); // Min height 5%
          return (
            <div key={day} className="chart-bar-wrapper">
              <div 
                className="chart-bar" 
                style={{ height: `${height}%` }}
                title={`${minutes} minutes`}
              ></div>
              <span className="chart-label">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PomodoroStats;
