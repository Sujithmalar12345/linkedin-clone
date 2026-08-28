import { FiEdit3, FiExternalLink, FiMapPin, FiMoreHorizontal, FiPlus, FiSend } from "react-icons/fi";
import { demoProfile } from "../data/demoProfile";

export default function ProfileHeader({ onEdit }) {
  return <section className="profile-card profile-hero">
    <div className="cover-art"><span>BUILD WITH INTENT</span><div className="cover-grid" /></div>
    <div className="hero-body">
      <div className="avatar avatar-xl">AM</div>
      <button className="icon-button edit-profile" onClick={onEdit} aria-label="Edit profile"><FiEdit3 /></button>
      <div className="hero-copy">
        <div className="name-row"><h1>{demoProfile.name}</h1><span className="verified">✓</span></div>
        <p className="headline">{demoProfile.headline}</p>
        <p className="muted"><FiMapPin /> {demoProfile.location} <button className="link-button">Contact info</button></p>
        <p className="connection-count">{demoProfile.connections}</p>
        <div className="affiliations"><span><b className="mini-logo nova">N</b>{demoProfile.company}</span><span><b className="mini-logo school">A</b>{demoProfile.education}</span></div>
        <div className="action-row"><button className="primary-button"><FiPlus /> Open to</button><button className="secondary-button"><FiPlus /> Add section</button><button className="secondary-button"><FiExternalLink /> Visit website</button><button className="icon-button"><FiMoreHorizontal /></button></div>
      </div>
    </div>
  </section>;
}
