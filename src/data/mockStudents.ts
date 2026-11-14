
export interface MockStudent {
  id: string;
  name: string;
  track: string;
  badge: string;
  completedSkills: number;
  totalSkills: number;
  skills: {
    id: string;
    name: string;
    status: string;
  }[];
  interviewStatus: "eligible" | "in-progress";
}

export const mockStudents: MockStudent[] = [
  {
    id: "STU001",
    name: "Shivani",
    track: "AI Product Engineering",
    badge: "Novice",
    completedSkills: 4,
    totalSkills: 4,
    skills: [
      { id: "SK001", name: "HTML & CSS", status: "completed" },
      { id: "SK002", name: "JavaScript", status: "completed" },
      { id: "SK003", name: "TypeScript", status: "completed" },
      { id: "SK004", name: "React", status: "completed" },
    ],
    interviewStatus: "eligible",
  },
  {
    id: "STU002",
    name: "Rahul",
    track: "AI Product Engineering",
    badge: "Novice",
    completedSkills: 4,
    totalSkills: 4,
    skills: [
      { id: "SK001", name: "HTML & CSS", status: "completed" },
      { id: "SK002", name: "JavaScript", status: "completed" },
      { id: "SK003", name: "TypeScript", status: "completed" },
      { id: "SK004", name: "React", status: "completed" },
    ],
    interviewStatus: "eligible",
  },
  {
    id: "STU003",
    name: "Karthik",
    track: "AI Product Engineering",
    badge: "Novice",
    completedSkills: 4,
    totalSkills: 4,
    skills: [
      { id: "SK001", name: "HTML & CSS", status: "completed" },
      { id: "SK002", name: "JavaScript", status: "completed" },
      { id: "SK003", name: "TypeScript", status: "completed" },
      { id: "SK004", name: "React", status: "completed" },
    ],
    interviewStatus: "eligible",
  },
  {
    id: "STU004",
    name: "Priya",
    track: "AI Product Engineering",
    badge: "Novice",
    completedSkills: 2,
    totalSkills: 4,
    skills: [
      { id: "SK001", name: "HTML & CSS", status: "completed" },
      { id: "SK002", name: "JavaScript", status: "completed" },
      { id: "SK003", name: "TypeScript", status: "in-progress" },
      { id: "SK004", name: "React", status: "in-progress" },
    ],
    interviewStatus: "in-progress",
  },
  {
    id: "STU005",
    name: "Demo Student",
    track: "AI Product Engineering",
    badge: "Novice",
    completedSkills: 4,
    totalSkills: 4,
    skills: [
      { id: "SK001", name: "HTML & CSS", status: "completed" },
      { id: "SK002", name: "JavaScript", status: "completed" },
      { id: "SK003", name: "TypeScript", status: "completed" },
      { id: "SK004", name: "React", status: "completed" },
    ],
    interviewStatus: "eligible",
  },
];

export const mockStudent = mockStudents[0];
