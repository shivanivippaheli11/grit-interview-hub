
import { useState } from "react";
import {
    CalendarDays,
    Clock,
    CheckCircle2,
    CalendarCheck,
} from "lucide-react";
import { getBookings } from "../../../services/bookingService"
import { getSlots } from "../../../services/availabilityService";
import type { InterviewBooking } from "../../../types/booking.types";
import "./InterviewerDashboard.scss";

const INTERVIEWER_ID = "INT001";

const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

export default function InterviewerDashboard() {
    const [bookings] = useState<InterviewBooking[]>(getBookings);
    const [slots] = useState(getSlots);

    const today = getToday();

    const interviewerBookings = bookings.filter(
        (booking) =>
            booking.slot.interviewerId === INTERVIEWER_ID &&
            booking.status !== "cancelled"
    );

    const todayInterviews = interviewerBookings.filter(
        (booking) => booking.slot.date === today
    );

    const upcomingInterviews = interviewerBookings
        .filter(
            (booking) =>
                booking.status === "confirmed" &&
                booking.slot.date >= today
        )
        .sort((a, b) =>
            `${a.slot.date} ${a.slot.startTime}`.localeCompare(
                `${b.slot.date} ${b.slot.startTime}`
            )
        );

    const completedInterviews = interviewerBookings.filter(
        (booking) => booking.status === "completed"
    );

    const availableSlots = slots.filter(
        (slot) =>
            slot.interviewerId === INTERVIEWER_ID &&
            !bookings.some(
                (booking) =>
                    booking.slot.id === slot.id &&
                    booking.status !== "cancelled"
            )
    );

    const summaryCards = [
        {
            label: "Today's Interviews",
            value: todayInterviews.length,
            icon: CalendarDays,
        },
        {
            label: "Upcoming Interviews",
            value: upcomingInterviews.length,
            icon: Clock,
        },
        {
            label: "Completed Interviews",
            value: completedInterviews.length,
            icon: CheckCircle2,
        },
        {
            label: "Available Slots",
            value: availableSlots.length,
            icon: CalendarCheck,
        },
    ];

    return (
        <section className="interviewer-dashboard">
            <div className="interviewer-dashboard-heading">
                <div>
                    <h2>Welcome, Ananya!</h2>
                    <p>Here's an overview of your interview activity.</p>
                </div>
                <span>{formatDate(today)}</span>
            </div>

            <div className="interviewer-summary-grid">
                {summaryCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div className="interviewer-summary-card" key={card.label}>
                            <div className="summary-card-icon">
                                <Icon size={20} />
                            </div>
                            <p>{card.label}</p>
                            <h3>{card.value}</h3>
                        </div>
                    );
                })}
            </div>

            <div className="upcoming-interviews-section">
                <div className="section-heading">
                    <h3>Upcoming Interviews</h3>
                    <span>{upcomingInterviews.length} scheduled</span>
                </div>

                {upcomingInterviews.length === 0 ? (
                    <p className="dashboard-empty-state">
                        No upcoming interviews scheduled.
                    </p>
                ) : (
                    upcomingInterviews.map((booking) => (
                        <div className="upcoming-interview-item" key={booking.id}>
                            <div>
                                <h4>{booking.studentId}</h4>
                                <p>{booking.track} · {booking.badge}</p>
                            </div>

                            <div className="upcoming-interview-date">
                                <span>{formatDate(booking.slot.date)}</span>
                                <span>
                                    {booking.slot.startTime} – {booking.slot.endTime}
                                </span>
                            </div>

                            <span className="dashboard-booking-status">
                                Confirmed
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
