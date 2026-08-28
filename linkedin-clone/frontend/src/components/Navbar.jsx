import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiBriefcase, FiChevronDown, FiHome, FiMessageCircle, FiSearch, FiSmartphone, FiUsers } from "react-icons/fi";
import { useAuth } from "../AuthContext.jsx";

export default function Navbar({ onOpenDeveloperMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-mark">n</span>
        nexora
      </Link>
      <label className="nav-search"><FiSearch /><input placeholder="Search" aria-label="Search" /></label>
      <button className="icon-button dev-mode-button" onClick={onOpenDeveloperMode} aria-label="Open mobile developer mode" title="Mobile developer mode"><FiSmartphone /></button>
      <div className="navbar-links">
          <>
            <Link to="/"><FiHome /> <span>Home</span></Link>
            <Link to="/network"><FiUsers /> <span>My Network</span></Link>
            <Link to="/jobs"><FiBriefcase /> <span>Jobs</span></Link>
            <Link to="/messaging"><FiMessageCircle /> <span>Messaging</span></Link>
            <Link to="/notifications"><FiBell /> <span>Notifications</span></Link>
              <Link to={`/profile/${user?.id || "demo"}`}><span className="nav-avatar">AM</span> <span>Me</span><FiChevronDown /></Link>
            <span className="nav-divider" /><button className="business-link">For Business</button><button className="business-link">Learning</button>
              {user ? <button onClick={handleLogout}>Log out</button> : <><Link to="/login">Log in</Link><Link to="/register">Sign up</Link></>}
          </>
      </div>
    </nav>
  );
}
