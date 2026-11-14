
import { Award, ShieldCheck, AlertTriangle, Clock } from "lucide-react";

import { mockStudents } from "../../../data/mockStudents";
import { getStudentBadgeRecord } from "../../../services/badgeService";
import { getBookings } from "../../../services/bookingService";
import type { InterviewBooking } from "../../../types/booking.types";

import "./MyBadges.scss";

interface MyBadgesProps {
    studentId: string;
}

export default function MyBadges({ studentId }: MyBadgesProps) {
    const student =
        mockStudents.find((item) => item.id === studentId) ?? mockStudents[0];

    const badgeRecord = getStudentBadgeRecord(student.id);

    const studentInterviews: InterviewBooking[] = getBookings()
        .filter(
            (booking) =>
                booking.studentId === student.id &&
                booking.status === "completed"
        )
        .sort(
            (a, b) =>
                new Date(b.bookedAt).getTime() -
                new Date(a.bookedAt).getTime()
        );

    const hasPassed = studentInterviews.some(
        (interview) => interview.outcome === "pass"
    );

    const isNullified = badgeRecord?.nullified ?? false;
    const isFlagged = badgeRecord?.malpracticeFlagged ?? false;

    const badgeStatus = isNullified
        ? "Nullified"
        : hasPassed
            ? "Awarded"
            : "Pending";

    return (
        <section className="my-badges">
            <div className="badges-heading">
                <div>
                    <h2>My Badges</h2>
                    <p>View your achievements and badge status.</p>
                </div>
            </div>

            <div className="my-badge-card">
                <div className="my-badge-icon">
                    <Award size={34} />
                </div>

                <div className="my-badge-details">
                    <span className="badge-track">{student.track}</span>
                    <h3>{student.badge} Badge</h3>
                    <span className={`badge-status ${badgeStatus.toLowerCase()}`}>
                        {badgeStatus}
                    </span>
                </div>
            </div>

            {isNullified && (
                <div className="badge-notice nullified">
                    <AlertTriangle size={20} />
                    <div>
                        <h4>Badge Nullified</h4>
                        <p>
                            Your badge has been nullified following a
                            malpractice flag.
                        </p>
                    </div>
                </div>
            )}

            {!isNullified && isFlagged && (
                <div className="badge-notice flagged">
                    <AlertTriangle size={20} />
                    <div>
                        <h4>Malpractice Flagged</h4>
                        <p>
                            Your badge record has been flagged for review.
                        </p>
                    </div>
                </div>
            )}

            {!isNullified && hasPassed && (
                <div className="badge-notice awarded">
                    <ShieldCheck size={20} />
                    <div>
                        <h4>Congratulations!</h4>
                        <p>
                            You have successfully passed your interview
                            and earned your badge.
                        </p>
                    </div>
                </div>
            )}

            {!isNullified && !hasPassed && (
                <div className="badge-notice pending">
                    <Clock size={20} />
                    <div>
                        <h4>Badge Pending</h4>
                        <p>
                            Complete and pass your interview to earn your badge.
                        </p>
                    </div>
                </div>
            )}

            <div className="badge-interview-history">
                <h3>Interview Results</h3>

                {studentInterviews.length === 0 ? (
                    <p>No completed interviews yet.</p>
                ) : (
                    studentInterviews.map((interview) => (
                        <div className="badge-interview-item" key={interview.id}>
                            <div>
                                <h4>
                                    {interview.slot.date} · {interview.slot.startTime}
                                </h4>
                                <p>
                                    Interviewer: {interview.slot.interviewerName}
                                </p>
                                {interview.feedback && (
                                    <p>Feedback: {interview.feedback}</p>
                                )}
                            </div>

                            <span className={`interview-outcome ${interview.outcome}`}>
                                {interview.outcome || "Not available"}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
