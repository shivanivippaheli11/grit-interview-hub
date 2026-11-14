
import { mockStudents } from "../../../data/mockStudents";
import { useNavigate } from "react-router-dom";
import { getStudentBadgeRecord } from "../../../services/badgeService";
import ProgressCard from "./ProgressCard";
import SkillsList from "./SkillsList";
import InterviewStatusCard from "./InterviewStatusCard";
import "./StudentDashboard.scss";

interface StudentDashboardProps {
  studentId: string;
}

const StudentDashboard = ({ studentId }: StudentDashboardProps) => {
  const student =
    mockStudents.find((item) => item.id === studentId) ?? mockStudents[0];

  const navigate = useNavigate();

  const badgeRecord = getStudentBadgeRecord(student.id);
  const isNullified = badgeRecord?.nullified ?? false;

  return (
    <div className="student-dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>My Dashboard</h2>
          <p>
            Track your learning journey and interview progress.
          </p>
        </div>
      </div>

      <div className="welcome-banner">
        <div>
          <h3>Hello, {student.name}! 👋</h3>
          <p>
            Keep progressing towards your
            {` ${student.track}`} badge.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <ProgressCard
          completed={student.completedSkills}
          total={student.totalSkills}
        />

        <div className="badge-card">
          <p>Current Track</p>
          <h3>{student.track}</h3>
          <span>
            {isNullified ? "Badge Nullified" : `${student.badge} Badge`}
          </span>
        </div>
      </div>

      {isNullified && (
        <div className="badge-nullified-message">
          Your badge has been nullified following a malpractice flag.
        </div>
      )}

      <div className="dashboard-bottom">
        <SkillsList skills={student.skills} />

        <InterviewStatusCard
          status={student.interviewStatus}
          isNullified={isNullified}
          onBook={() => navigate("/student/book-interview")}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
