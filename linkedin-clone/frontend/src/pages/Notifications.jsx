import { useEffect, useState } from "react";
import api from "../api";

const demoNotifications = [
  { id: "demo-notification-1", title: "Amina Yusuf viewed your profile", detail: "Founder at Common Ground", time: new Date().toISOString(), read: false },
  { id: "demo-notification-2", title: "Jon Bell liked your post", detail: "Your perspective on building calm products", time: new Date().toISOString(), read: false },
  { id: "demo-notification-3", title: "Maya Chen sent you a message", detail: "Open Messages to reply", time: new Date().toISOString(), read: false },
  { id: "demo-notification-4", title: "Welcome to your professional community", detail: "Complete your profile to make better connections", time: new Date().toISOString(), read: true },
  { id: "demo-notification-5", title: "Elena Torres shared a new post", detail: "Brand work is better when it starts with real people", time: new Date().toISOString(), read: true },
  { id: "demo-notification-6", title: "You have new roles to explore", detail: "Six opportunities match your interests", time: new Date().toISOString(), read: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    api.get("/notifications")
      .then((res) => setNotifications(res.data.length ? res.data : demoNotifications))
      .catch(() => setNotifications(demoNotifications));
  }, []);
  async function markAllRead() {
    try { await api.put("/notifications/read"); } catch { /* Demo notifications are local until the API is available. */ }
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }
  return <div className="page page-wide"><div className="page-intro compact-intro"><div><p className="eyebrow">Stay in the loop</p><h1 className="page-title">Notifications</h1><p className="page-lede">The latest activity from your professional circle.</p></div><button className="btn-secondary" onClick={markAllRead}>Mark all as read</button></div><section className="notifications-card"><div className="notification-heading"><h2 className="section-title">Recent</h2><span className="unread-count">{notifications.filter((notification) => !notification.read).length} new</span></div>{notifications.map((notification) => <article className={`notification ${!notification.read ? "unread" : ""}`} key={notification.id}><div className="notification-icon">{notification.title.charAt(0)}</div><div className="notification-copy"><strong>{notification.title}</strong><p>{notification.detail}</p></div><time>{new Date(notification.time).toLocaleDateString()}</time></article>)}{notifications.length === 0 && <div className="empty-state">You&apos;re all caught up.</div>}</section></div>;
}
