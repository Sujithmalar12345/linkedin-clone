import { useState } from "react";
import { FiEdit3, FiPlus, FiX } from "react-icons/fi";
import { demoProfile } from "../data/demoProfile";
export default function Skills({ onAdd }) { const [skills, setSkills] = useState(demoProfile.skills); return <section className="profile-card section-card"><div className="section-heading"><h2>Skills</h2><div><button className="icon-button" onClick={onAdd} aria-label="Add skill"><FiPlus /></button><button className="icon-button" aria-label="Edit skills"><FiEdit3 /></button></div></div><div className="skill-grid">{skills.map((skill) => <span className="skill-chip" key={skill}>{skill}<button onClick={() => setSkills(skills.filter((item) => item !== skill))} aria-label={`Remove ${skill}`}><FiX /></button></span>)}</div></section>; }
