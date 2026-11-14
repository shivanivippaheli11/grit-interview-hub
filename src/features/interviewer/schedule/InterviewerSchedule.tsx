
import { useState } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import {
    getBookings,
    updateInterviewOutcome,
} from "../../../services/bookingService";
import {
    getSlots,
    addAvailableSlot,
    removeAvailableSlot,
} from "../../../services/availabilityService";
import type {
    InterviewBooking,
    InterviewOutcome,
    InterviewSlot,
} from "../../../types/booking.types";
import "./InterviewerSchedule.scss";

const INTERVIEWER_ID = "INT001";
const INTERVIEWER_NAME = "Ananya Sharma";

export default function InterviewerSchedule() {
    const [date, setDate] = useState("2026-11-18");
    const [bookings, setBookings] = useState<InterviewBooking[]>(getBookings);
    const [slots, setSlots] = useState<InterviewSlot[]>(getSlots);
    const [startTime, setStartTime] = useState("10:00");
    const [error, setError] = useState("");

    const schedule = bookings.filter(
        (booking) =>
            booking.slot.interviewerId === INTERVIEWER_ID &&
            booking.slot.date === date
    );

    const availableSlots = slots.filter(
        (slot) =>
            slot.interviewerId === INTERVIEWER_ID &&
            slot.date === date
    );

    const handleAddSlot = () => {
        try {
            addAvailableSlot(
                date,
                startTime,
                INTERVIEWER_ID,
                INTERVIEWER_NAME
            );

            setSlots(getSlots());
            setError("");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to add slot."
            );
        }
    };

    const handleRemoveSlot = (slotId: string) => {
        try {
            removeAvailableSlot(slotId);
            setSlots(getSlots());
            setError("");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to remove slot."
            );
        }
    };

    const handleOutcome = (
        id: string,
        outcome: InterviewOutcome,
        feedback: string
    ) => {
        updateInterviewOutcome(id, outcome, feedback);
        setBookings(getBookings());
    };

    return (
        <section className="interviewer-schedule">
            <div className="schedule-heading">
                <div>
                    <h2>Daily Schedule</h2>
                    <p>Manage your availability and scheduled interviews.</p>
                </div>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                        setError("");
                    }}
                />
            </div>

            <div className="availability-section">
                <h3>Manage Availability</h3>

                <div className="availability-form">
                    <div>
                        <label htmlFor="slot-start-time">Start Time</label>
                        <input
                            id="slot-start-time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>

                    <button onClick={handleAddSlot}>
                        <Plus size={16} />
                        Add 30-minute Slot
                    </button>
                </div>

                {error && <p className="availability-error">{error}</p>}

                <div className="availability-list">
                    {availableSlots.length === 0 ? (
                        <p className="empty-schedule">
                            No availability added for this date.
                        </p>
                    ) : (
                        availableSlots.map((slot) => {
                            const isBooked = bookings.some(
                                (booking) =>
                                    booking.slot.id === slot.id &&
                                    booking.status === "confirmed"
                            );

                            return (
                                <div className="availability-item" key={slot.id}>
                                    <span>
                                        <Clock size={15} />
                                        {slot.startTime} – {slot.endTime}
                                        {isBooked && <small>Booked</small>}
                                    </span>

                                    {!isBooked && (
                                        <button
                                            onClick={() => handleRemoveSlot(slot.id)}
                                            aria-label={`Remove slot ${slot.startTime}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="schedule-summary">
                <span>Total Interviews</span>
                <h3>{schedule.length}</h3>
            </div>

            <div className="schedule-list">
                <h3>Scheduled Interviews</h3>

                {schedule.length === 0 ? (
                    <p className="empty-schedule">
                        No interviews scheduled for this date.
                    </p>
                ) : (
                    schedule.map((booking) => (
                        <InterviewCard
                            key={booking.id}
                            booking={booking}
                            onSave={handleOutcome}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

function InterviewCard({
    booking,
    onSave,
}: {
    booking: InterviewBooking;
    onSave: (
        id: string,
        outcome: InterviewOutcome,
        feedback: string
    ) => void;
}) {
    const [outcome, setOutcome] = useState<InterviewOutcome>("pass");
    const [feedback, setFeedback] = useState("");

    const isCompleted = booking.status === "completed";

    return (
        <div className="schedule-card">
            <div className="schedule-card-header">
                <div>
                    <h4>{booking.studentId}</h4>
                    <p>{booking.track} · {booking.badge}</p>
                </div>

                <span className={`schedule-status ${booking.outcome || "confirmed"}`}>
                    {booking.outcome || "Confirmed"}
                </span>
            </div>

            <p className="schedule-time">
                <Clock size={15} /> {booking.slot.startTime} – {booking.slot.endTime}
            </p>

            {isCompleted ? (
                <p className="outcome-feedback">
                    Feedback: {booking.feedback || "No feedback provided."}
                </p>
            ) : (
                <div className="outcome-form">
                    <h5>Record Interview Outcome</h5>

                    <select
                        value={outcome}
                        onChange={(e) =>
                            setOutcome(e.target.value as InterviewOutcome)
                        }
                    >
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                        <option value="retake">Retake</option>
                    </select>

                    <textarea
                        placeholder="Enter interview feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />

                    <button
                        onClick={() => onSave(booking.id, outcome, feedback)}
                    >
                        Submit Outcome
                    </button>
                </div>
            )}
        </div>
    );
}
