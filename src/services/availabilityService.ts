
import type { InterviewSlot } from "../types/booking.types";
import { mockSlots } from "../data/mockSlots";
import { isSlotBooked } from "./bookingService";

const STORAGE_KEY = "grit_interview_slots";

export const getSlots = (): InterviewSlot[] => {
  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) as InterviewSlot[] : mockSlots;
};

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const addAvailableSlot = (
  date: string,
  startTime: string,
  interviewerId: string,
  interviewerName: string
): InterviewSlot => {
  if (!date) {
    throw new Error("Please choose a date.");
  }

  if (!/^\d{2}:\d{2}$/.test(startTime)) {
    throw new Error("Please choose a valid start time.");
  }

  const startMinutes = toMinutes(startTime);
  const endMinutes = startMinutes + 30;

  if (endMinutes >= 24 * 60) {
    throw new Error("The slot must end before midnight.");
  }

  const slots = getSlots();

  const hasConflict = slots.some((slot) => {
    if (
      slot.date !== date ||
      slot.interviewerId !== interviewerId
    ) {
      return false;
    }

    const existingStart = toMinutes(
      convertTo24Hour(slot.startTime)
    );
    const existingEnd = toMinutes(
      convertTo24Hour(slot.endTime)
    );

    return startMinutes < existingEnd && endMinutes > existingStart;
  });

  if (hasConflict) {
    throw new Error("This time overlaps with an existing slot.");
  }

  const newSlot: InterviewSlot = {
    id: `SLOT-${Date.now()}`,
    interviewerId,
    interviewerName,
    date,
    startTime: formatTime(startMinutes),
    endTime: formatTime(endMinutes),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...slots, newSlot])
  );

  return newSlot;
};

const convertTo24Hour = (time: string): string => {
  const [timeValue, period] = time.split(" ");
  const [parsedHours, minutes] = timeValue.split(":").map(Number);
  let hours = parsedHours;

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const removeAvailableSlot = (slotId: string): void => {
  if (isSlotBooked(slotId)) {
    throw new Error("A booked interview slot cannot be removed.");
  }

  const updatedSlots = getSlots().filter(
    (slot) => slot.id !== slotId
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedSlots)
  );
};
