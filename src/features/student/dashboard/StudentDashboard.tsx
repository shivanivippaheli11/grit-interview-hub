
import { mockStudents } from "../../../data/mockStudents";
import { useNavigate } from "react-router-dom";
import { getInterviewJourney } from "../../../services/bookingService";
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

  const journey = getInterviewJourney(student.id);
  const isNullified = journey.state === "nullified";
  const badgeName = `${student.track} – ${student.badge}`;

  const badgeChip =
    journey.state === "passed"
      ? { className: "earned", text: `${student.badge} Badge · Earned` }
      : journey.state === "nullified"
        ? { className: "nullified", text: "Badge Nullified" }
        : journey.state === "under-review"
          ? { className: "under-review", text: "Badge Under Review" }
          : { className: "", text: `${student.badge} Badge · Not earned yet` };

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
            {journey.state === "passed"
              ? `You've earned your ${badgeName} badge. Great work!`
              : `Keep progressing towards your ${badgeName} badge.`}
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
          <span className={badgeChip.className}>{badgeChip.text}</span>
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
          journey={journey}
          badgeName={badgeName}
          onBook={() => navigate("/student/book-interview")}
          onViewInterviews={() => navigate("/student/interviews")}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
