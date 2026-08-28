import { useEffect, useState } from "react";
import { FiCheckCircle, FiCode, FiCopy, FiExternalLink, FiRefreshCw, FiSmartphone, FiX } from "react-icons/fi";

function getLanUrl() {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? `http://${window.location.hostname}:${window.location.port || "5173"}`
    : window.location.origin;
}

export default function MobileDeveloperMode({ onClose }) {
  const [apiStatus, setApiStatus] = useState("checking");
  const [copied, setCopied] = useState(false);
  const appUrl = getLanUrl();
  const apiUrl = `${window.location.protocol}//${window.location.hostname}:4000`;

  async function checkApi() {
    setApiStatus("checking");
    try {
      const response = await fetch(`${apiUrl}/api/health`);
      setApiStatus(response.ok ? "online" : "offline");
    } catch {
      setApiStatus("offline");
    }
  }

  useEffect(() => { checkApi(); }, []);

  async function copyUrl() {
    await navigator.clipboard?.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return <div className="mobile-mode-backdrop" onMouseDown={onClose}>
    <section className="mobile-mode-panel" onMouseDown={(event) => event.stopPropagation()}>
      <div className="mobile-mode-header"><div><span className="eyebrow"><FiCode /> Developer mode</span><h2>Connect a phone</h2></div><button className="icon-button" onClick={onClose} aria-label="Close developer mode"><FiX /></button></div>
      <div className="phone-preview"><FiSmartphone /><div><strong>Mobile preview ready</strong><span>Open this address on a phone connected to the same Wi-Fi.</span></div></div>
      <label className="connection-label">Frontend address<div className="connection-field"><code>{appUrl}</code><button className="icon-button" onClick={copyUrl} aria-label="Copy frontend address">{copied ? <FiCheckCircle /> : <FiCopy />}</button></div></label>
      <div className="connection-row"><span>Backend API</span><strong className={apiStatus === "online" ? "status-online" : apiStatus === "offline" ? "status-offline" : "status-checking"}>{apiStatus === "online" ? "Connected" : apiStatus === "offline" ? "Unavailable" : "Checking..."}</strong><button className="icon-button" onClick={checkApi} aria-label="Check backend connection"><FiRefreshCw /></button></div>
      <p className="mobile-mode-note">For a physical phone, replace <code>localhost</code> with this computer's LAN IP, keep both devices on the same network, and allow ports 5174 and 4000 through the firewall.</p>
      <div className="mobile-mode-actions"><button className="secondary-button" onClick={copyUrl}><FiCopy /> {copied ? "Copied" : "Copy address"}</button><a className="primary-button" href={appUrl} target="_blank" rel="noreferrer"><FiExternalLink /> Open preview</a></div>
    </section>
  </div>;
}
