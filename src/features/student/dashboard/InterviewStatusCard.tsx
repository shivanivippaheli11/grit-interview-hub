
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CalendarCheck,
  CalendarDays,
  Lock,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import type { ReactNode } from "react";

import type { InterviewJourney } from "../../../services/bookingService";

interface InterviewStatusCardProps {
  journey: InterviewJourney;
  badgeName: string;
  onBook: () => void;
  onViewInterviews: () => void;
}

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const InterviewStatusCard = ({
  journey,
  badgeName,
  onBook,
  onViewInterviews,
}: InterviewStatusCardProps) => {
  const { state, activeBooking, latestResult } = journey;
  const feedback = latestResult?.feedback;

  let icon: ReactNode = <CalendarDays size={25} />;
  let label = "Interview Status";
  let title = "";
  let message: ReactNode = "";
  let action: ReactNode = null;

  const bookButton = (text: string) => (
    <button className="book-button" onClick={onBook}>
      {text}
      <ArrowRight size={17} />
    </button>
  );

  const viewButton = (
    <button className="book-button secondary" onClick={onViewInterviews}>
      View My Interviews
      <ArrowRight size={17} />
    </button>
  );

  switch (state) {
    case "not-eligible":
      icon = <Lock size={25} />;
      title = "Interview not available yet";
      message = "Complete all required skills to unlock your interview booking.";
      break;

    case "ready-to-book":
      label = "Interview Eligibility";
      title = "You're ready for your interview!";
      message = `You've cleared every skill for the ${badgeName} badge. Book a 30-minute interview slot to earn it.`;
      action = bookButton("Book Interview");
      break;

    case "booked":
      icon = <CalendarCheck size={25} />;
      label = "Interview Booked";
      title = "Your interview is confirmed";
      message = activeBooking ? (
        <>
          <strong>
            {formatDate(activeBooking.slot.date)}, {activeBooking.slot.startTime}
          </strong>{" "}
          with {activeBooking.slot.interviewerName}. Join 5 minutes early.
          Your result will appear here after the interview.
        </>
      ) : null;
      action = viewButton;
      break;

    case "passed":
      icon = <Award size={25} />;
      label = "Interview Result · Passed";
      title = `${badgeName} badge earned! 🎉`;
      message = "Congratulations! You cleared your interview and the badge is now on your profile.";
      action = viewButton;
      break;

    case "retake":
      icon = <RotateCcw size={25} />;
      label = "Interview Result · Retake";
      title = "Your interviewer has asked for a retake";
      message = (
        <>
          {feedback && <>Feedback: “{feedback}” </>}
          Review the feedback and book a new slot when you're ready.
        </>
      );
      action = bookButton("Book Retake");
      break;

    case "failed":
      icon = <AlertTriangle size={25} />;
      label = "Interview Result · Not Cleared";
      title = "You didn't clear this interview";
      message = (
        <>
          {feedback && <>Feedback: “{feedback}” </>}
          Work on the areas in your feedback, then book another attempt.
        </>
      );
      action = bookButton("Book Another Attempt");
      break;

    case "under-review":
      icon = <ShieldAlert size={25} />;
      label = "Badge Status · Under Review";
      title = "Your badge is under review";
      message = "Your badge has been flagged for a malpractice review. The GRIT team will contact you with the outcome.";
      break;

    case "nullified":
      icon = <ShieldAlert size={25} />;
      label = "Badge Status · Nullified";
      title = "Your badge has been nullified";
      message = "Your badge was nullified following a malpractice flag. Please contact the GRIT team for further assistance.";
      break;
  }

  return (
    <div className={`interview-card journey-${state}`}>
      <div className="interview-card-icon">{icon}</div>

      <span className="status-label">{label}</span>
      <h3>{title}</h3>
      <p>{message}</p>

      {action}
    </div>
  );
};

export default InterviewStatusCard;
