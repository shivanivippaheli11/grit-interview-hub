
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  UserRound,
  CheckCircle,
} from "lucide-react";

import {
  BLOCKED_BOOKING_MESSAGES,
  createBooking,
  getInterviewJourney,
  isSlotBooked,
} from "../../../services/bookingService";
import { getSlots } from "../../../services/availabilityService";
import { mockStudents } from "../../../data/mockStudents";

import type {
  InterviewSlot,
  InterviewBooking,
} from "../../../types/booking.types";

import "./BookingPage.scss";

interface BookingPageProps {
  studentId: string;
}

const BookingPage = ({ studentId }: BookingPageProps) => {
  const navigate = useNavigate();

  const [slots] = useState<InterviewSlot[]>(getSlots);
  const [selectedDate, setSelectedDate] = useState(
    () => [...getSlots()].sort((a, b) => a.date.localeCompare(b.date))[0]?.date ?? ""
  );
  const [selectedSlot, setSelectedSlot] =
    useState<InterviewSlot | null>(null);
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] =
    useState<InterviewBooking | null>(null);

  const student =
    mockStudents.find((item) => item.id === studentId) ?? mockStudents[0];
  const journey = getInterviewJourney(studentId);
  const existingBooking = journey.activeBooking;

  const dates = [...new Set(slots.map((slot) => slot.date))].sort();

  const availableSlots = slots.filter(
    (slot) =>
      slot.date === selectedDate &&
      !isSlotBooked(slot.id)
  );

  const formatLongDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleBooking = () => {
    if (!selectedSlot) {
      setError("Please select an interview slot.");
      return;
    }

    try {
      const booking: InterviewBooking = {
        id: `BOOK-${Date.now()}`,
        studentId,
        badge: student.badge,
        track: student.track,
        slot: selectedSlot,
        status: "confirmed",
        bookedAt: new Date().toISOString(),
      };

      createBooking(booking);
      setError("");
      setConfirmedBooking(booking);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete booking."
      );
    }
  };

  if (confirmedBooking) {
    return (
      <div className="booking-success">
        <CheckCircle size={60} color="#16a36a" />
        <h2>Interview booked!</h2>
        <p>
          Your {student.track} – {student.badge} interview is on{" "}
          <strong>
            {formatLongDate(confirmedBooking.slot.date)} at{" "}
            {confirmedBooking.slot.startTime}
          </strong>{" "}
          with {confirmedBooking.slot.interviewerName}. Join 5 minutes early
          from My Interviews. Need to change it? You can cancel from My
          Interviews and pick a new slot.
        </p>

        <button onClick={() => navigate("/student/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!existingBooking && !journey.canBook) {
    return (
      <div className="booking-page">
        <div className="booking-heading">
          <h2>Book Your Interview</h2>
        </div>

        <div className="existing-booking">
          <div className="existing-booking-header">
            <CalendarDays size={28} />
            <h3>Booking unavailable</h3>
          </div>

          <p>{BLOCKED_BOOKING_MESSAGES[journey.state]}</p>

          <button
            className="confirm-booking"
            onClick={() => navigate("/student/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-heading">
        <h2>Book Your Interview</h2>
        <p>Select an available date and time for your interview.</p>
      </div>

      {existingBooking ? (
        <div className="existing-booking">
          <div className="existing-booking-header">
            <CheckCircle size={28} />
            <h3>Interview Already Scheduled</h3>
          </div>

          <p>
            You already have an active interview booking.
          </p>

          <div className="selected-summary">
            <h3>Booking Summary</h3>

            <p>
              <UserRound size={17} />
              {existingBooking.slot.interviewerName}
            </p>

            <p>
              <CalendarDays size={17} />
              {formatLongDate(existingBooking.slot.date)}
            </p>

            <p>
              <Clock size={17} />
              {existingBooking.slot.startTime} –{" "}
              {existingBooking.slot.endTime}
            </p>

            <p>
              <strong>Status:</strong> Confirmed
            </p>
          </div>

          <button
            className="confirm-booking"
            onClick={() => navigate("/student/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className="booking-details">
            <h3>Interview Details</h3>
            <p>{student.track} – {student.badge} Badge</p>
            <span>Duration: 30 minutes</span>
          </div>

          <div className="booking-section">
            <h3>
              <CalendarDays size={20} />
              Select Interview Date
            </h3>

            <div className="date-list">
              {dates.map((date) => (
                <button
                  key={date}
                  className={selectedDate === date ? "selected" : ""}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                    setError("");
                  }}
                >
                  {new Date(`${date}T00:00:00`).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short" }
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="booking-section">
            <h3>
              <Clock size={20} />
              Available Time Slots
            </h3>

            {availableSlots.length === 0 ? (
              <p>No slots available for this date.</p>
            ) : (
              <div className="slot-list">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    className={
                      selectedSlot?.id === slot.id ? "selected" : ""
                    }
                    onClick={() => {
                      setSelectedSlot(slot);
                      setError("");
                    }}
                  >
                    <span>{slot.startTime}</span>
                    <small>{slot.interviewerName}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedSlot && (
            <div className="selected-summary">
              <h3>Booking Summary</h3>

              <p>
                <UserRound size={17} />
                {selectedSlot.interviewerName}
              </p>

              <p>
                <CalendarDays size={17} />
                {formatLongDate(selectedSlot.date)}
              </p>

              <p>
                <Clock size={17} />
                {selectedSlot.startTime} – {selectedSlot.endTime}
              </p>
            </div>
          )}

          {error && <p className="booking-error">{error}</p>}

          <button
            className="confirm-booking"
            disabled={!selectedSlot}
            onClick={handleBooking}
          >
            Confirm Booking
          </button>
        </>
      )}
    </div>
  );
};

export default BookingPage;
