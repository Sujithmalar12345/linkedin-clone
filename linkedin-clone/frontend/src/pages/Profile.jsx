import { useState } from "react";
import { FiX } from "react-icons/fi";
import ProfileHeader from "../components/ProfileHeader.jsx";
import OpenToWork from "../components/OpenToWork.jsx";
import About from "../components/About.jsx";
import Experience from "../components/Experience.jsx";
import Education from "../components/Education.jsx";
import Skills from "../components/Skills.jsx";
import Projects from "../components/Projects.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function Profile() {
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");
  function openModal(title) { setModal(title); }
  function submit(e) { e.preventDefault(); setModal(null); setNotice(`${modal} updated for this demo session.`); setTimeout(() => setNotice(""), 3000); }
  return <main className="profile-page"><div className="profile-layout"><div className="profile-main"><ProfileHeader onEdit={() => openModal("Edit profile")} /><OpenToWork /><About onEdit={() => openModal("Edit About")} /><Experience onAdd={() => openModal("Add experience")} /><Education onAdd={() => openModal("Add education")} /><Skills onAdd={() => openModal("Add skill")} /><Projects onAdd={() => openModal("Add project")} /></div><Sidebar /></div>{notice && <div className="toast">{notice}</div>}{modal && <div className="modal-backdrop" onMouseDown={() => setModal(null)}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="section-heading"><h2>{modal}</h2><button className="icon-button" onClick={() => setModal(null)} aria-label="Close"><FiX /></button></div><form onSubmit={submit}><label>Title<input placeholder="Add a fictional detail" required /></label><label>Description<textarea placeholder="Tell your story" rows="4" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancel</button><button className="primary-button">Save changes</button></div></form></div></div>}</main>;
}
