
import type {
  InterviewBooking,
  InterviewOutcome,
} from "../types/booking.types";
import { mockStudents } from "../data/mockStudents";
import { getStudentBadgeRecord } from "./badgeService";

const STORAGE_KEY = "grit_interview_bookings";

export type JourneyState =
  | "not-eligible"
  | "ready-to-book"
  | "booked"
  | "retake"
  | "failed"
  | "passed"
  | "under-review"
  | "nullified";

export interface InterviewJourney {
  state: JourneyState;
  canBook: boolean;
  activeBooking?: InterviewBooking;
  latestResult?: InterviewBooking;
}

const BOOKABLE_STATES: JourneyState[] = ["ready-to-book", "retake", "failed"];

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

const byLatestBooking = (a: InterviewBooking, b: InterviewBooking) =>
  new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime();

export const getLatestResult = (
  studentId: string
): InterviewBooking | undefined =>
  getBookings()
    .filter(
      (booking) =>
        booking.studentId === studentId && booking.status === "completed"
    )
    .sort(byLatestBooking)[0];

export const getInterviewJourney = (studentId: string): InterviewJourney => {
  const student = mockStudents.find((item) => item.id === studentId);
  const badgeRecord = getStudentBadgeRecord(studentId);
  const activeBooking = getStudentBooking(studentId);
  const latestResult = getLatestResult(studentId);
  const hasPassed = getBookings().some(
    (booking) =>
      booking.studentId === studentId &&
      booking.status === "completed" &&
      booking.outcome === "pass"
  );

  let state: JourneyState;

  if (badgeRecord?.nullified) state = "nullified";
  else if (badgeRecord?.malpracticeFlagged) state = "under-review";
  else if (!student || student.interviewStatus !== "eligible") state = "not-eligible";
  else if (hasPassed) state = "passed";
  else if (activeBooking) state = "booked";
  else if (latestResult?.outcome === "retake") state = "retake";
  else if (latestResult?.outcome === "fail") state = "failed";
  else state = "ready-to-book";

  return {
    state,
    canBook: BOOKABLE_STATES.includes(state),
    activeBooking,
    latestResult,
  };
};

export const BLOCKED_BOOKING_MESSAGES: Partial<Record<JourneyState, string>> = {
  "not-eligible": "Complete all required skills to unlock interview booking.",
  booked: "You already have an active booking.",
  passed: "You have already passed this interview.",
  "under-review": "Booking is on hold while your badge is under review.",
  nullified: "Booking is unavailable because your badge was nullified.",
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
  const journey = getInterviewJourney(booking.studentId);

  if (!journey.canBook) {
    throw new Error(
      BLOCKED_BOOKING_MESSAGES[journey.state] ?? "Booking is not available."
    );
  }

  if (isSlotBooked(booking.slot.id)) {
    throw new Error("This slot is no longer available.");
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
  const target = bookings.find((booking) => booking.id === bookingId);

  if (!target || target.status !== "confirmed") {
    throw new Error("Outcomes can only be recorded for confirmed interviews.");
  }

  if (outcome !== "pass" && !feedback.trim()) {
    throw new Error("Please add feedback so the student knows what to improve.");
  }

  const updatedBookings = bookings.map((booking) =>
    booking.id === bookingId
      ? {
          ...booking,
          status: "completed" as const,
          outcome,
          feedback: feedback.trim(),
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


