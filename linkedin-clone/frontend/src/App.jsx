import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Feed from "./pages/Feed.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Network from "./pages/Network.jsx";
import Jobs from "./pages/Jobs.jsx";
import Messaging from "./pages/Messaging.jsx";
import Notifications from "./pages/Notifications.jsx";
import CompanyPage from "./pages/CompanyPage.jsx";
import Landing from "./pages/Landing.jsx";
import MobileDeveloperMode from "./components/MobileDeveloperMode.jsx";
import { useAuth } from "./AuthContext.jsx";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page loading-state">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page loading-state">Loading...</div>;
  return user ? <Feed /> : <Landing />;
}

export default function App() {
  const [devModeOpen, setDevModeOpen] = useState(
    () => new URLSearchParams(window.location.search).get("dev") === "1"
  );

  return (
    <div className="app-shell">
      <Navbar onOpenDeveloperMode={() => setDevModeOpen(true)} />
      <Routes>
        <Route
          path="/"
          element={
            <HomeRoute />
          }
        />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/network" element={<RequireAuth><Network /></RequireAuth>} />
        <Route path="/jobs" element={<RequireAuth><Jobs /></RequireAuth>} />
        <Route path="/messaging" element={<RequireAuth><Messaging /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
        <Route path="/company" element={<RequireAuth><CompanyPage /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {devModeOpen && <MobileDeveloperMode onClose={() => setDevModeOpen(false)} />}
    </div>
  );
}
