
import type {
  InterviewBooking,
  InterviewOutcome,
} from "../types/booking.types";

const STORAGE_KEY = "grit_interview_bookings";

export const getBookings = (): InterviewBooking[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) as InterviewBooking[] : [];
};

export const getStudentBooking = (
  studentId: string
): InterviewBooking | undefined => {
  return getBookings().find(
    (booking) =>
      booking.studentId === studentId &&
      booking.status === "confirmed"
  );
};

export const getStudentInterview = (
  studentId: string
): InterviewBooking | undefined => {
  const studentBookings = getBookings().filter(
    (booking) =>
      booking.studentId === studentId &&
      booking.status !== "cancelled"
  );

  // Prioritize an active confirmed booking.
  const confirmedBooking = studentBookings
    .filter((booking) => booking.status === "confirmed")
    .sort(
      (a, b) =>
        new Date(b.bookedAt).getTime() -
        new Date(a.bookedAt).getTime()
    )[0];

  if (confirmedBooking) {
    return confirmedBooking;
  }

  // If no active booking exists, show the latest completed interview.
  return studentBookings
    .filter((booking) => booking.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.bookedAt).getTime() -
        new Date(a.bookedAt).getTime()
    )[0];
};

export const isSlotBooked = (slotId: string): boolean => {
  return getBookings().some(
    (booking) =>
      booking.slot.id === slotId &&
      (booking.status === "confirmed" ||
        booking.status === "completed")
  );
};

export const createBooking = (booking: InterviewBooking): void => {
  if (isSlotBooked(booking.slot.id)) {
    throw new Error("This slot is no longer available.");
  }

  if (getStudentBooking(booking.studentId)) {
    throw new Error("You already have an active booking.");
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...getBookings(), booking])
  );
};

export const updateInterviewOutcome = (
  bookingId: string,
  outcome: InterviewOutcome,
  feedback: string
): void => {
  const bookings = getBookings();

  const updatedBookings = bookings.map((booking) =>
    booking.id === bookingId
      ? {
          ...booking,
          status: "completed" as const,
          outcome,
          feedback,
        }
      : booking
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedBookings)
  );
};

export const cancelBooking = (bookingId: string): void => {
  const bookings = getBookings();

  const booking = bookings.find(
    (item) => item.id === bookingId
  );

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (booking.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be cancelled.");
  }

  const updatedBookings = bookings.map((item) =>
    item.id === bookingId
      ? { ...item, status: "cancelled" as const }
      : item
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedBookings)
  );
};


