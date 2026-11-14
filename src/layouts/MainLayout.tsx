
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

import StudentDashboard from "../features/student/dashboard/StudentDashboard";
import MyBadges from "../features/student/badges/MyBadges";
import BookingPage from "../features/student/booking/BookingPage";
import MyInterviews from "../features/student/interviews/MyInterviews";

import InterviewerDashboard from "../features/interviewer/dashboard/InterviewerDashboard";
import InterviewerAvailability from "../features/interviewer/availability/InterviewerAvailability";
import InterviewerSchedule from "../features/interviewer/schedule/InterviewerSchedule";

import AdminDashboard from "../features/admin/dashboard/AdminDashboard";
import EligibleStudents from "../features/admin/students/EligibleStudents";
import AdminInterviews from "../features/admin/interviews/AdminInterviews";
import BadgeManagement from "../features/admin/badges/BadgeManagement";

import type { UserRole } from "../types/role.types";

const MainLayout = () => {
    const [role, setRole] = useState<UserRole>("student");
    const [selectedStudentId, setSelectedStudentId] = useState("STU005");

    const navigate = useNavigate();

    const handleRoleChange = (newRole: UserRole) => {
        setRole(newRole);
        navigate(`/${newRole}/dashboard`);
    };

    const handleStudentChange = (studentId: string) => {
        setSelectedStudentId(studentId);
    };

    return (
        <div className="app-layout">
            <Sidebar role={role} />

            <div className="main-section">
                <Header
                    role={role}
                    onRoleChange={handleRoleChange}
                    selectedStudentId={selectedStudentId}
                    onStudentChange={handleStudentChange}
                />

                <main className="dashboard-content">
                    <Routes>
                        {/* Student Routes */}
                        <Route
                            path="/student/dashboard"
                            element={
                                <StudentDashboard studentId={selectedStudentId} />
                            }
                        />

                        <Route
                            path="/student/badges"
                            element={
                                <MyBadges studentId={selectedStudentId} />
                            }
                        />

                        <Route
                            path="/student/book-interview"
                            element={
                                <BookingPage studentId={selectedStudentId} />
                            }
                        />

                        <Route
                            path="/student/interviews"
                            element={
                                <MyInterviews studentId={selectedStudentId} />
                            }
                        />

                        <Route
                            path="/student/*"
                            element={<h2>Student page coming soon</h2>}
                        />

                        {/* Interviewer Routes */}
                        <Route
                            path="/interviewer/dashboard"
                            element={<InterviewerDashboard />}
                        />

                        <Route
                            path="/interviewer/availability"
                            element={<InterviewerAvailability />}
                        />

                        <Route
                            path="/interviewer/schedule"
                            element={<InterviewerSchedule />}
                        />

                        <Route
                            path="/interviewer/*"
                            element={<h2>Interviewer workspace coming soon</h2>}
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="/admin/students"
                            element={<EligibleStudents />}
                        />

                        <Route
                            path="/admin/interviews"
                            element={<AdminInterviews />}
                        />

                        <Route
                            path="/admin/badges"
                            element={<BadgeManagement />}
                        />

                        <Route
                            path="/admin/*"
                            element={<h2>Admin workspace coming soon</h2>}
                        />

                        {/* Default Route */}
                        <Route
                            path="*"
                            element={<Navigate to="/student/dashboard" replace />}
                        />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
