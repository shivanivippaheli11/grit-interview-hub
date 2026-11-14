
import { useState } from "react";
import {
    Users,
    UserCheck,
    Clock,
    CalendarCheck,
    Award,
    AlertTriangle,
} from "lucide-react";

import { mockStudents } from "../../../data/mockStudents";
import { getBookings } from "../../../services/bookingService";
import { getStudentBadgeRecord } from "../../../services/badgeService";
import type { InterviewBooking } from "../../../types/booking.types";

import "./AdminDashboard.scss";

export default function AdminDashboard() {
    const [bookings] = useState<InterviewBooking[]>(getBookings);

    const totalStudents = mockStudents.length;

    const eligibleStudents = mockStudents.filter(
        (student) => student.interviewStatus === "eligible"
    ).length;

    const inProgressStudents = mockStudents.filter(
        (student) => student.interviewStatus === "in-progress"
    ).length;

    const completedInterviews = bookings.filter(
        (booking) => booking.status === "completed"
    ).length;

    const nullifiedBadges = mockStudents.filter((student) => {
        const record = getStudentBadgeRecord(student.id);
        return record?.nullified === true;
    }).length;

    const recentInterviews = [...bookings]
        .sort(
            (a, b) =>
                new Date(b.bookedAt).getTime() -
                new Date(a.bookedAt).getTime()
        )
        .slice(0, 5);

    const stats = [
        {
            title: "Total Students",
            value: totalStudents,
            icon: Users,
            className: "purple",
        },
        {
            title: "Eligible Students",
            value: eligibleStudents,
            icon: UserCheck,
            className: "green",
        },
        {
            title: "In Progress",
            value: inProgressStudents,
            icon: Clock,
            className: "orange",
        },
        {
            title: "Total Interviews",
            value: bookings.length,
            icon: CalendarCheck,
            className: "blue",
        },
        {
            title: "Completed Interviews",
            value: completedInterviews,
            icon: Award,
            className: "green",
        },
        {
            title: "Nullified Badges",
            value: nullifiedBadges,
            icon: AlertTriangle,
            className: "red",
        },
    ];

    const getStudentName = (studentId: string) => {
        return (
            mockStudents.find((student) => student.id === studentId)?.name ||
            studentId
        );
    };

    return (
        <section className="admin-dashboard">
            <div className="admin-dashboard-heading">
                <div>
                    <h2>Admin Dashboard</h2>
                    <p>Overview of students, interviews and badge activity.</p>
                </div>
            </div>

            <div className="admin-stats-grid">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div className="admin-stat-card" key={stat.title}>
                            <div className={`admin-stat-icon ${stat.className}`}>
                                <Icon size={21} />
                            </div>

                            <div>
                                <p>{stat.title}</p>
                                <h3>{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="recent-interviews-card">
                <div className="recent-interviews-heading">
                    <h3>Recent Interviews</h3>
                    <span>{bookings.length} total</span>
                </div>

                {recentInterviews.length === 0 ? (
                    <p className="admin-empty-state">
                        No interviews have been booked yet.
                    </p>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-interviews-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Interviewer</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Outcome</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentInterviews.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>{getStudentName(booking.studentId)}</td>
                                        <td>{booking.slot.interviewerName}</td>
                                        <td>{booking.slot.date}</td>
                                        <td>
                                            {booking.slot.startTime} – {booking.slot.endTime}
                                        </td>
                                        <td>
                                            <span
                                                className={`admin-booking-status ${booking.status}`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>
                                            {booking.outcome || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
