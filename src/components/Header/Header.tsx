
import type { UserRole } from "../../types/role.types";
import { mockStudents } from "../../data/mockStudents";

interface HeaderProps {
    role: UserRole;
    onRoleChange: (role: UserRole) => void;
    selectedStudentId: string;
    onStudentChange: (studentId: string) => void;
}

const roleProfiles: Record<Exclude<UserRole, "student">, string> = {
    interviewer: "Ananya",
    admin: "Admin",
};

const Header = ({
    role,
    onRoleChange,
    selectedStudentId,
    onStudentChange,
}: HeaderProps) => {
    const selectedStudent = mockStudents.find(
        (student) => student.id === selectedStudentId
    );

    const profileName =
        role === "student"
            ? selectedStudent?.name ?? "Student"
            : roleProfiles[role];

    return (
        <header className="top-header">
            <div>
                <h2>Welcome to GRIT Hub</h2>
                <p>Manage your interview journey</p>
            </div>

            <div className="header-actions">
                <select
                    className="header-role-select"
                    value={role}
                    onChange={(e) =>
                        onRoleChange(e.target.value as UserRole)
                    }
                    aria-label="Select role"
                >
                    <option value="student">Student</option>
                    <option value="interviewer">Interviewer</option>
                    <option value="admin">Admin</option>
                </select>

                {role === "student" && (
                    <select
                        className="header-student-select"
                        value={selectedStudentId}
                        onChange={(e) => onStudentChange(e.target.value)}
                        aria-label="Select student account"
                    >
                        {mockStudents.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.id} - {student.name}
                            </option>
                        ))}
                    </select>
                )}

                <div className="profile">
                    <div className="avatar">
                        {profileName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <strong>{profileName}</strong>
                        <small>{role}</small>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
