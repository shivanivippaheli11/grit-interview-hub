
import { mockStudents } from "../../../data/mockStudents";
import {
    getInterviewJourney,
    type JourneyState,
} from "../../../services/bookingService";
import "./EligibleStudents.scss";

const STATE_LABELS: Record<JourneyState, { label: string; className: string }> = {
    "not-eligible": { label: "Not Eligible", className: "in-progress" },
    "ready-to-book": { label: "Not Booked", className: "not-booked" },
    booked: { label: "Booked", className: "booked" },
    retake: { label: "Retake – Not Rebooked", className: "retake" },
    failed: { label: "Fail – Not Rebooked", className: "fail" },
    passed: { label: "PASS", className: "pass" },
    "under-review": { label: "Badge Under Review", className: "retake" },
    nullified: { label: "Badge Nullified", className: "fail" },
};

const NEEDS_BOOKING: JourneyState[] = ["ready-to-book", "retake", "failed"];

const EligibleStudents = () => {
    const students = mockStudents.map((student) => ({
        ...student,
        journey: getInterviewJourney(student.id),
    }));

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
                        {students.filter((student) =>
                            NEEDS_BOOKING.includes(student.journey.state)
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

                                const stateLabel = STATE_LABELS[student.journey.state];

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
                                            <span className={`student-status ${stateLabel.className}`}>
                                                {stateLabel.label}
                                            </span>
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
