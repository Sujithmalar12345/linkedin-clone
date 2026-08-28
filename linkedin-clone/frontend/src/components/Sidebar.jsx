import { FiGlobe, FiLink, FiChevronRight } from "react-icons/fi";
import Analytics from "./Analytics.jsx";
import PeopleYouMayKnow from "./PeopleYouMayKnow.jsx";
export default function Sidebar() { return <aside className="sidebar"><section className="profile-card sidebar-card"><div className="section-heading"><h2>Profile language</h2><FiGlobe className="muted-icon" /></div><strong>English</strong></section><section className="profile-card sidebar-card"><div className="section-heading"><h2>Public profile & URL</h2><FiLink className="muted-icon" /></div><p className="url-text">network.example.com/in/alex-morgan</p><button className="text-action">Edit public profile <FiChevronRight /></button></section><Analytics /><PeopleYouMayKnow /></aside>; }
