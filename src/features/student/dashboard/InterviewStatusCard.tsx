
import { CalendarDays, ArrowRight } from "lucide-react";

interface InterviewStatusCardProps {
  status: string;
  isNullified: boolean;
  onBook: () => void;
}

const InterviewStatusCard = ({
  status,
  isNullified,
  onBook,
}: InterviewStatusCardProps) => {
  return (
    <div className="interview-card">
      <div className="interview-card-icon">
        <CalendarDays size={25} />
      </div>

      {isNullified ? (
        <>
          <span className="status-label">
            Badge Status
          </span>

          <h3>Your badge has been nullified</h3>

          <p>
            Your badge was nullified following a malpractice flag.
            Please contact the GRIT team for further assistance.
          </p>
        </>
      ) : status === "eligible" ? (
        <>
          <span className="status-label">
            Interview Eligibility
          </span>

          <h3>You're ready for your interview!</h3>

          <p>
            Congratulations! You've completed all the
            required skills. Book your interview slot
            to take the next step towards earning your badge.
          </p>

          <button className="book-button" onClick={onBook}>
            Book Interview
            <ArrowRight size={17} />
          </button>
        </>
      ) : (
        <>
          <span className="status-label">
            Interview Status
          </span>

          <h3>Interview not available yet</h3>

          <p>
            Complete all required skills to unlock
            your interview booking.
          </p>
        </>
      )}
    </div>
  );
};

export default InterviewStatusCard;
