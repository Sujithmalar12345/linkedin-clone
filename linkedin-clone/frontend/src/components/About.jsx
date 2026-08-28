import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { demoProfile } from "../data/demoProfile";
export default function About({ onEdit }) { const [expanded, setExpanded] = useState(false); return <section className="profile-card section-card"><div className="section-heading"><h2>About</h2><button className="icon-button" onClick={onEdit} aria-label="Edit about"><FiEdit3 /></button></div><p className={!expanded ? "clamped" : ""}>{demoProfile.about}</p><button className="text-action" onClick={() => setExpanded(!expanded)}>{expanded ? "Show less" : "Show more"}</button></section>; }
