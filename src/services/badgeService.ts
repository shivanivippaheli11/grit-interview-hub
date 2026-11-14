
export interface BadgeRecord {
  studentId: string;
  malpracticeFlagged: boolean;
  nullified: boolean;
}

const STORAGE_KEY = "grit_badge_records";

export const getStudentBadgeRecord = (
  studentId: string
): BadgeRecord | undefined => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return undefined;

  const records = JSON.parse(data) as BadgeRecord[];

  return records.find((record) => record.studentId === studentId);
};
