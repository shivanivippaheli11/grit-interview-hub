
import { useState } from "react";
import { mockStudents } from "../../../data/mockStudents";
import { getBookings } from "../../../services/bookingService";
import "./BadgeManagement.scss";

interface BadgeRecord {
    studentId: string;
    malpracticeFlagged: boolean;
    nullified: boolean;
}

const STORAGE_KEY = "grit_badge_records";

const getBadgeRecords = (): BadgeRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) as BadgeRecord[] : [];
};

const BadgeManagement = () => {
    const [records, setRecords] = useState<BadgeRecord[]>(getBadgeRecords);

    const passedStudents = mockStudents
        .map((student) => {
            const booking = getBookings().find(
                (item) =>
                    item.studentId === student.id &&
                    item.status === "completed" &&
                    item.outcome === "pass"
            );

            return booking ? { ...student, booking } : null;
        })
        .filter((student) => student !== null);

    const updateRecord = (
        studentId: string,
        updates: Partial<BadgeRecord>
    ) => {
        const existing = records.find(
            (record) => record.studentId === studentId
        );

        const updatedRecords = existing
            ? records.map((record) =>
                record.studentId === studentId
                    ? { ...record, ...updates }
                    : record
            )
            : [
                ...records,
                {
                    studentId,
                    malpracticeFlagged: false,
                    nullified: false,
                    ...updates,
                },
            ];

        setRecords(updatedRecords);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    };

    return (
        <section className="badge-management">
            <div className="page-heading">
                <h2>Badge Management</h2>
                <p>Manage earned badges and malpractice-related nullifications.</p>
            </div>

            <div className="badge-table-container">
                <h3>Earned Badges</h3>

                <div className="table-responsive">
                    <table className="table badge-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Track</th>
                                <th>Badge</th>
                                <th>Status</th>
                                <th>Malpractice</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {passedStudents.map((student) => {
                                const record = records.find(
                                    (item) => item.studentId === student.id
                                );

                                const isFlagged = record?.malpracticeFlagged ?? false;
                                const isNullified = record?.nullified ?? false;

                                return (
                                    <tr key={student.id}>
                                        <td>
                                            <strong>{student.name}</strong>
                                            <small>{student.id}</small>
                                        </td>

                                        <td>{student.track}</td>
                                        <td>{student.badge}</td>

                                        <td>
                                            <span className={`badge-status ${isNullified ? "nullified" : "active"}`}>
                                                {isNullified ? "Nullified" : "Active"}
                                            </span>
                                        </td>

                                        <td>
                                            {isFlagged ? "Flagged" : "Not flagged"}
                                        </td>

                                        <td>
                                            {!isFlagged && !isNullified && (
                                                <button
                                                    className="badge-action"
                                                    onClick={() =>
                                                        updateRecord(student.id, {
                                                            malpracticeFlagged: true,
                                                        })
                                                    }
                                                >
                                                    Flag malpractice
                                                </button>
                                            )}

                                            {isFlagged && !isNullified && (
                                                <button
                                                    className="badge-action nullify"
                                                    onClick={() =>
                                                        updateRecord(student.id, {
                                                            nullified: true,
                                                        })
                                                    }
                                                >
                                                    Nullify badge
                                                </button>
                                            )}

                                            {isNullified && <span>Action completed</span>}
                                        </td>
                                    </tr>
                                );
                            })}

                            {passedStudents.length === 0 && (
                                <tr>
                                    <td colSpan={6}>No students have earned a badge yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default BadgeManagement;
