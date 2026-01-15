import { PomodoroSession } from '../types';

interface PomodoroStatsProps {
  pomodoroHistory: PomodoroSession[];
}

const PomodoroStats = ({ pomodoroHistory }: PomodoroStatsProps) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(now.setDate(diff)).setHours(0, 0, 0, 0);
  };

  // Process data
  const data: { [key: string]: { work: number; break: number } } = {};
  weekDays.forEach(day => data[day] = { work: 0, break: 0 });

  const startOfWeek = getStartOfWeek();

  pomodoroHistory.forEach(session => {
    const date = new Date(session.timestamp);
    if (date.getTime() >= startOfWeek) {
      let dayIndex = date.getDay() - 1;
      if (dayIndex === -1) dayIndex = 6;
      
      const dayName = weekDays[dayIndex];
      if (data[dayName]) {
        // Simple heuristic: if label contains 'break' (case insensitive) or duration is 5/10, treat as break
        const isBreak = session.label.toLowerCase().includes('break') || 
                        session.duration === 5 || 
                        session.duration === 10;
        
        if (isBreak) {
          data[dayName].break += session.duration;
        } else {
          data[dayName].work += session.duration;
        }
      }
    }
  });

  // Calculate max for scale (max of either work or break max to keep proportion)
  let maxVal = 60;
  Object.values(data).forEach(day => {
    maxVal = Math.max(maxVal, day.work, day.break);
  });

  return (
    <div className="pomodoro-stats">
      <h3>Focus History (This Week)</h3>
      <div className="chart-container" style={{ alignItems: 'stretch', position: 'relative', paddingTop: '20px', paddingBottom: '40px' }}> 
        {weekDays.map((day) => {
          const { work, break: breakMins } = data[day];
          
          // Calculate percentages relative to maxVal
          // We'll give 50% height to Work (top) and 50% to Break (bottom) effectively,
          // but visually we want them to grow from the center.
          // Let's use flex-column.
          
          const workHeight = Math.max((work / maxVal) * 100, work > 0 ? 5 : 0);
          const breakHeight = Math.max((breakMins / maxVal) * 100, breakMins > 0 ? 5 : 0);

          return (
            <div key={day} className="chart-bar-wrapper" style={{ flexDirection: 'column', justifyContent: 'center', gap: '2px', position: 'relative', height: '100%' }}>
              {/* Work Bar (Growing Up) */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
                <div 
                  className="chart-bar work" 
                  style={{ 
                    height: `${workHeight}%`, 
                    background: 'var(--primary-color)',
                    width: '100%',
                    borderRadius: '4px 4px 0 0',
                    opacity: work > 0 ? 1 : 0
                  }}
                  title={`${work}m Work`}
                ></div>
              </div>

              {/* Center Line handled by border or gap */}
              <div style={{ height: '3px', background: 'rgba(255, 255, 255, 0.3)', width: '100%', borderRadius: '2px' }}></div>

              {/* Break Bar (Growing Down) */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
                 <div 
                  className="chart-bar break" 
                  style={{ 
                    height: `${breakHeight}%`, 
                    background: 'var(--danger-color)', // Red for break
                    width: '100%',
                    borderRadius: '0 0 4px 4px',
                    opacity: breakMins > 0 ? 1 : 0
                  }}
                  title={`${breakMins}m Break`}
                ></div>
              </div>

              <span className="chart-label" style={{ position: 'absolute', bottom: '-30px', width: '100%', textAlign: 'center' }}>{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PomodoroStats;
