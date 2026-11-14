
import { useState } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import {
    getSlots,
    addAvailableSlot,
    removeAvailableSlot,
} from "../../../services/availabilityService";
import { isSlotBooked } from "../../../services/bookingService";
import type { InterviewSlot } from "../../../types/booking.types";
import "./InterviewerAvailability.scss";

const INTERVIEWER_ID = "INT001";
const INTERVIEWER_NAME = "Ananya Sharma";

export default function InterviewerAvailability() {
    const [date, setDate] = useState("2026-11-18");
    const [startTime, setStartTime] = useState("09:00");
    const [slots, setSlots] = useState<InterviewSlot[]>(getSlots);
    const [error, setError] = useState("");

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

    return (
        <section className="interviewer-availability">
            <div className="availability-heading">
                <div>
                    <h2>Manage Availability</h2>
                    <p>Add and manage your interview time slots.</p>
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

            <div className="availability-form-card">
                <h3>Add Availability</h3>

                <div className="availability-form">
                    <div>
                        <label htmlFor="availability-time">Start Time</label>
                        <input
                            id="availability-time"
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

                {error && (
                    <p className="availability-error">{error}</p>
                )}
            </div>

            <div className="availability-slots-card">
                <h3>Available Time Slots</h3>

                {availableSlots.length === 0 ? (
                    <p className="empty-availability">
                        No availability added for this date.
                    </p>
                ) : (
                    availableSlots.map((slot) => {
                        const isBooked = isSlotBooked(slot.id);

                        return (
                            <div className="availability-slot" key={slot.id}>
                                <div className="slot-time">
                                    <Clock size={17} />
                                    <span>
                                        {slot.startTime} – {slot.endTime}
                                    </span>

                                    {isBooked && (
                                        <span className="booked-label">
                                            Booked
                                        </span>
                                    )}
                                </div>

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
        </section>
    );
}
