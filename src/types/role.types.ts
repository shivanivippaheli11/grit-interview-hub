
export type UserRole = "student" | "interviewer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
