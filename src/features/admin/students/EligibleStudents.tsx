
import { mockStudents } from "../../../data/mockStudents";
import { getBookings } from "../../../services/bookingService";
import "./EligibleStudents.scss";

const EligibleStudents = () => {
    const bookings = getBookings();

    const students = mockStudents.map((student) => {
        const booking = bookings.find(
            (item) =>
                item.studentId === student.id &&
                item.status !== "cancelled"
        );

        return { ...student, booking };
    });

    return (
        <section className="eligible-students">
            <div className="page-heading">
                <div>
                    <h2>Eligible Students</h2>
                    <p>Track student eligibility and interview booking status.</p>
                </div>
            </div>

            <div className="student-summary">
                <div>
                    <span>Total Students</span>
                    <h3>{students.length}</h3>
                </div>
                <div>
                    <span>Eligible</span>
                    <h3>
                        {students.filter(
                            (student) => student.interviewStatus === "eligible"
                        ).length}
                    </h3>
                </div>
                <div>
                    <span>Not Booked</span>
                    <h3>
                        {students.filter(
                            (student) =>
                                student.interviewStatus === "eligible" &&
                                !student.booking
                        ).length}
                    </h3>
                </div>
            </div>

            <div className="student-table-container">
                <h3>Student Overview</h3>

                <div className="table-responsive">
                    <table className="table student-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Track / Badge</th>
                                <th>Skills</th>
                                <th>Eligibility</th>
                                <th>Interview Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student) => {
                                const isEligible =
                                    student.interviewStatus === "eligible";

                                const booking = student.booking;

                                return (
                                    <tr key={student.id}>
                                        <td>
                                            <strong>{student.name}</strong>
                                            <small>{student.id}</small>
                                        </td>

                                        <td>
                                            {student.track}
                                            <small>{student.badge}</small>
                                        </td>

                                        <td>
                                            {student.completedSkills}/{student.totalSkills}
                                        </td>

                                        <td>
                                            <span
                                                className={`student-status ${isEligible ? "eligible" : "in-progress"
                                                    }`}
                                            >
                                                {isEligible ? "Eligible" : "In Progress"}
                                            </span>
                                        </td>

                                        <td>
                                            {!isEligible ? (
                                                <span className="student-status in-progress">
                                                    Not Eligible
                                                </span>
                                            ) : booking?.status === "completed" ? (
                                                <span
                                                    className={`student-status ${booking.outcome || "completed"}`}
                                                >
                                                    {booking.outcome
                                                        ? booking.outcome.toUpperCase()
                                                        : "Completed"}
                                                </span>
                                            ) : booking ? (
                                                <span className="student-status booked">
                                                    Booked
                                                </span>
                                            ) : (
                                                <span className="student-status not-booked">
                                                    Not Booked
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default EligibleStudents;
