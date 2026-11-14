
import { CheckCircle, Award } from "lucide-react";

interface ProgressCardProps {
  completed: number;
  total: number;
}

const ProgressCard = ({ completed, total }: ProgressCardProps) => {
  const percentage = (completed / total) * 100;

  return (
    <div className="progress-card">
      <div className="progress-card-header">
        <div>
          <p>Skills Completed</p>
          <h2>{completed}/{total}</h2>
        </div>

        <div className="progress-icon">
          <Award size={25} />
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="progress-footer">
        <CheckCircle size={16} />
        <span>{percentage}% completed</span>
      </div>
    </div>
  );
};

export default ProgressCard;
