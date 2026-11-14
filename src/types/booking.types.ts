export type BookingStatus =
  | "confirmed"
  | "cancelled"
  | "completed";

export type InterviewOutcome = "pass" | "fail" | "retake";

export interface InterviewSlot {
  id: string;
  interviewerId: string;
  interviewerName: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface InterviewBooking {
  id: string;
  studentId: string;
  badge: string;
  track: string;
  slot: InterviewSlot;
  status: BookingStatus;
  bookedAt: string;
  outcome?: InterviewOutcome;
  feedback?: string;
}