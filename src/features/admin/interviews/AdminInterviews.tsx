
import { mockStudents } from "../../../data/mockStudents";
import { getBookings } from "../../../services/bookingService";
import type { InterviewBooking } from "../../../types/booking.types";
import "./AdminInterviews.scss";

type InterviewRow = {
    student: (typeof mockStudents)[number];
    booking?: InterviewBooking;
};

const AdminInterviews = () => {
    const bookings = getBookings();

    const activeBookings = bookings
        .filter((booking) => booking.status !== "cancelled")
        .sort((a, b) =>
            `${a.slot.date} ${a.slot.startTime}`.localeCompare(
                `${b.slot.date} ${b.slot.startTime}`
            )
        );

    const studentsWithBookings = mockStudents.map((student) => {
        const studentBookings = activeBookings.filter(
            (booking) => booking.studentId === student.id
        );

        return { ...student, studentBookings };
    });

    const bookedStudents = studentsWithBookings.filter(
        (student) => student.studentBookings.length > 0
    );

    const completedStudents = studentsWithBookings.filter(
        (student) =>
            student.studentBookings.some(
                (booking) => booking.status === "completed"
            )
    );

    const notBookedStudents = studentsWithBookings.filter(
        (student) =>
            student.interviewStatus === "eligible" &&
            student.studentBookings.length === 0
    );

    const interviewRows: InterviewRow[] =
        studentsWithBookings.flatMap<InterviewRow>((student) => {
            if (student.studentBookings.length > 0) {
                return student.studentBookings.map((booking) => ({
                    student,
                    booking,
                }));
            }

            return [{ student }];
        });

    return (
        <section className="admin-interviews">
            <div className="page-heading">
                <div>
                    <h2>Interview Overview</h2>
                    <p>Monitor student bookings and interview outcomes.</p>
                </div>
            </div>

            <div className="interview-summary">
                <div>
                    <span>Total Students</span>
                    <h3>{mockStudents.length}</h3>
                </div>

                <div>
                    <span>Booked Students</span>
                    <h3>{bookedStudents.length}</h3>
                </div>

                <div>
                    <span>Completed Students</span>
                    <h3>{completedStudents.length}</h3>
                </div>

                <div>
                    <span>Not Booked</span>
                    <h3>{notBookedStudents.length}</h3>
                </div>
            </div>

            <div className="interview-table-container">
                <h3>Student Interview Details</h3>

                <div className="table-responsive">
                    <table className="table interview-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Track / Badge</th>
                                <th>Interviewer</th>
                                <th>Date & Time</th>
                                <th>Booking Status</th>
                                <th>Outcome</th>
                            </tr>
                        </thead>

                        <tbody>
                            {interviewRows.map(({ student, booking }, index) => (
                                <tr
                                    key={booking?.id ?? `${student.id}-${index}`}
                                >
                                    <td>
                                        <strong>{student.name}</strong>
                                        <small>{student.id}</small>
                                    </td>

                                    <td>
                                        {student.track}
                                        <small>{student.badge}</small>
                                    </td>

                                    <td>
                                        {booking?.slot.interviewerName || "—"}
                                    </td>

                                    <td>
                                        {booking ? (
                                            <>
                                                {booking.slot.date}
                                                <small>
                                                    {booking.slot.startTime} –{" "}
                                                    {booking.slot.endTime}
                                                </small>
                                            </>
                                        ) : (
                                            "—"
                                        )}
                                    </td>

                                    <td>
                                        <span
                                            className={`interview-status ${booking
                                                    ? booking.status
                                                    : student.interviewStatus === "eligible"
                                                        ? "not-booked"
                                                        : "not-eligible"
                                                }`}
                                        >
                                            {booking
                                                ? booking.status === "completed"
                                                    ? "Completed"
                                                    : "Booked"
                                                : student.interviewStatus === "eligible"
                                                    ? "Not Booked"
                                                    : "Not Eligible"}
                                        </span>
                                    </td>

                                    <td>
                                        {booking?.outcome ? (
                                            <span
                                                className={`interview-status ${booking.outcome}`}
                                            >
                                                {booking.outcome.toUpperCase()}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default AdminInterviews;
