
import {
    CalendarDays,
    Clock,
    UserRound,
    Video,
    Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
    getBookings,
    cancelBooking,
    getInterviewJourney,
} from "../../../services/bookingService";
import { mockStudents } from "../../../data/mockStudents";

import "./MyInterviews.scss";

interface MyInterviewsProps {
    studentId: string;
}

const MyInterviews = ({ studentId }: MyInterviewsProps) => {
    const navigate = useNavigate();

    const [selectedBookingId, setSelectedBookingId] =
        useState<string | null>(null);

    // Get all non-cancelled interviews for this student
    const interviews = getBookings().filter(
        (booking) =>
            booking.studentId === studentId &&
            booking.status !== "cancelled"
    );

    // Separate upcoming and completed interviews
    const upcomingBookings = interviews
        .filter((booking) => booking.status === "confirmed")
        .sort((a, b) =>
            `${a.slot.date} ${a.slot.startTime}`.localeCompare(
                `${b.slot.date} ${b.slot.startTime}`
            )
        );

    const completedBookings = interviews
        .filter((booking) => booking.status === "completed")
        .sort((a, b) =>
            `${b.slot.date} ${b.slot.startTime}`.localeCompare(
                `${a.slot.date} ${a.slot.startTime}`
            )
        );

    const latestBooking = upcomingBookings[0] ?? completedBookings[0];

    const formattedDate = (date: string) =>
        new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    // Cancel a confirmed booking
    const handleCancelBooking = () => {
        if (!selectedBookingId) return;

        try {
            cancelBooking(selectedBookingId);
            setSelectedBookingId(null);
        } catch (error) {
            console.error("Unable to cancel booking:", error);
            window.alert(
                error instanceof Error
                    ? error.message
                    : "Unable to cancel the interview."
            );
        }
    };

    const student =
        mockStudents.find((item) => item.id === studentId) ?? mockStudents[0];
    const badgeName = `${student.track} – ${student.badge}`;
    const journey = getInterviewJourney(studentId);

    const notification =
        latestBooking?.status === "confirmed"
            ? {
                type: "confirmation",
                title: "Interview Booking Confirmed!",
                message: `Your ${badgeName} interview is on ${formattedDate(latestBooking.slot.date)} at ${latestBooking.slot.startTime} with ${latestBooking.slot.interviewerName}. Please join 5 minutes early and keep your project and preparation materials ready.`,
            }
            : latestBooking?.outcome === "pass"
                ? {
                    type: "success",
                    title: "Congratulations! You've cleared your interview!",
                    message: `You've passed your ${badgeName} interview and earned the badge. It is now visible on your dashboard and in My Badges.`,
                }
                : latestBooking?.outcome === "retake"
                    ? {
                        type: "warning",
                        title: "Your interviewer has asked for a retake",
                        message: "Review the feedback below, then book a new slot when you're ready.",
                    }
                    : latestBooking?.outcome === "fail"
                        ? {
                            type: "warning",
                            title: "You didn't clear this interview",
                            message: "Work on the areas in your interviewer's feedback, then book another attempt.",
                        }
                        : null;

    const canRebook =
        upcomingBookings.length === 0 &&
        (journey.state === "retake" || journey.state === "failed");

    const renderInterviewCard = (
        booking: (typeof interviews)[number]
    ) => {
        const isCompleted = booking.status === "completed";

        return (
            <div className="interview-card" key={booking.id}>
                <div className="interview-card-header">
                    <div>
                        <span className="interview-label">
                            {isCompleted
                                ? "COMPLETED INTERVIEW"
                                : "UPCOMING INTERVIEW"}
                        </span>
                        <h3>{booking.track}</h3>
                    </div>

                    <span className="booking-status">
                        {isCompleted ? "Completed" : "Confirmed"}
                    </span>
                </div>

                <div className="interview-details">
                    <div className="interview-detail">
                        <CalendarDays size={20} />
                        <div>
                            <small>Interview Date</small>
                            <p>{formattedDate(booking.slot.date)}</p>
                        </div>
                    </div>

                    <div className="interview-detail">
                        <Clock size={20} />
                        <div>
                            <small>Interview Time</small>
                            <p>
                                {booking.slot.startTime} – {booking.slot.endTime}
                            </p>
                        </div>
                    </div>

                    <div className="interview-detail">
                        <UserRound size={20} />
                        <div>
                            <small>Interviewer</small>
                            <p>{booking.slot.interviewerName}</p>
                        </div>
                    </div>

                    <div className="interview-detail">
                        <Award size={20} />
                        <div>
                            <small>Badge</small>
                            <p>{booking.badge} Badge</p>
                        </div>
                    </div>
                </div>

                <div className="interview-outcome">
                    <div>
                        <Video size={22} />
                        <div>
                            <strong>Interview Outcome</strong>
                            <p>
                                {isCompleted
                                    ? `Your interview result: ${booking.outcome?.toUpperCase()}`
                                    : "Awaiting interview evaluation"}
                            </p>
                        </div>
                    </div>

                    <span
                        className={
                            isCompleted
                                ? "outcome-completed"
                                : "outcome-pending"
                        }
                    >
                        {isCompleted ? booking.outcome : "Pending"}
                    </span>
                </div>

                {isCompleted && (
                    <div className="interview-feedback">
                        <strong>Interviewer Feedback</strong>
                        <p>{booking.feedback || "No feedback provided."}</p>
                    </div>
                )}

                {isCompleted &&
                    (booking.outcome === "fail" ||
                        booking.outcome === "retake") && (
                        <div className="interview-feedback">
                            <strong>
                                {booking.outcome === "fail"
                                    ? "Next Steps"
                                    : "Retake Required"}
                            </strong>
                            <p>
                                {booking.outcome === "fail"
                                    ? "Please review your interviewer feedback and work on the areas identified."
                                    : "Please review your feedback and prepare for another interview attempt."}
                            </p>
                        </div>
                    )}

                {!isCompleted && (
                    <button
                        className="cancel-interview-btn"
                        onClick={() => setSelectedBookingId(booking.id)}
                    >
                        Cancel Interview
                    </button>
                )}
            </div>
        );
    };

    if (interviews.length === 0) {
        return (
            <div className="my-interviews-page">
                <div className="interviews-heading">
                    <h2>My Interviews</h2>
                    <p>View and manage your interview journey.</p>
                </div>

                <div className="no-interview-card">
                    <CalendarDays size={48} />
                    {journey.canBook ? (
                        <>
                            <h3>No Interview Scheduled Yet</h3>
                            <p>
                                You've completed all the required skills for
                                your {badgeName} badge. Book your interview
                                slot to take the final step towards earning it.
                            </p>
                            <button onClick={() => navigate("/student/book-interview")}>
                                Book Interview
                            </button>
                        </>
                    ) : (
                        <>
                            <h3>Interview not available yet</h3>
                            <p>
                                Complete all required skills to unlock your
                                interview booking.
                            </p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="my-interviews-page">
            <div className="interviews-heading">
                <h2>My Interviews</h2>
                <p>View and manage your interview journey.</p>
            </div>

            {notification && (
                <div className={`student-notification ${notification.type}`}>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    {canRebook && (
                        <button
                            className="rebook-button"
                            onClick={() => navigate("/student/book-interview")}
                        >
                            {journey.state === "retake"
                                ? "Book Retake"
                                : "Book Another Attempt"}
                        </button>
                    )}
                </div>
            )}

            {upcomingBookings.length > 0 && (
                <section>
                    <h3>Upcoming Interviews</h3>
                    {upcomingBookings.map(renderInterviewCard)}
                </section>
            )}

            {completedBookings.length > 0 && (
                <section>
                    <h3>Interview History</h3>
                    {completedBookings.map(renderInterviewCard)}
                </section>
            )}

            {/* Cancellation confirmation modal */}
            {selectedBookingId && (
                <div
                    className="cancel-modal-overlay"
                    onClick={() => setSelectedBookingId(null)}
                >
                    <div
                        className="cancel-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cancel-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 id="cancel-modal-title">
                            Cancel Interview?
                        </h3>

                        <p>
                            Are you sure you want to cancel this interview?
                            Your selected time slot will become available
                            for other students.
                        </p>

                        <div className="cancel-modal-actions">
                            <button
                                className="keep-booking-btn"
                                onClick={() => setSelectedBookingId(null)}
                            >
                                Keep Booking
                            </button>

                            <button
                                className="confirm-cancel-btn"
                                onClick={handleCancelBooking}
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyInterviews;
