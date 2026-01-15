import { Activity } from '../types';

interface ProgressBarProps {
  activities: Activity[];
}

const ProgressBar = ({ activities }: ProgressBarProps) => {
  const total = activities.length;
  const completed = activities.filter(a => a.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="progress-section">
      <div className="progress-info">
        <span>Progress</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-track" 
          style={{ width: `${100 - percentage}%`, left: `${percentage}%` }}
        ></div>
        <div className="progress-fill" style={{ width: `${percentage}%` }}>
          <div className="progress-wave"></div>
          <div className="progress-handle"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
