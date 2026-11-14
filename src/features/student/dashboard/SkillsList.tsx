
import { CheckCircle, Circle } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  status: string;
}

interface SkillsListProps {
  skills: Skill[];
}

const SkillsList = ({ skills }: SkillsListProps) => {
  return (
    <div className="skills-card">
      <h3>Required Skills</h3>
      <p>Track your skill completion progress.</p>

      <div className="skills-list">
        {skills.map((skill) => (
          <div className="skill-item" key={skill.id}>
            <div className="skill-info">
              {skill.status === "completed" ? (
                <CheckCircle color="#16a36a" size={20} />
              ) : (
                <Circle color="#a0a6b5" size={20} />
              )}

              <span>{skill.name}</span>
            </div>

            <span
              className={`skill-status ${skill.status}`}
            >
              {skill.status === "completed"
                ? "Completed"
                : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsList;
