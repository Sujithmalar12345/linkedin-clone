import { useEffect, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import api from "../api";
import { useAuth } from "../AuthContext.jsx";

const demoThreads = [
  { id: "demo-thread-1", userId: "demo-person-1", name: "Maya Chen", headline: "Product designer at Northstar Labs", avatarUrl: "", message: "The launch notes are looking great. Want to review them together?", time: "9:42 AM" },
  { id: "demo-thread-2", userId: "demo-person-2", name: "Jon Bell", headline: "Engineering lead building calm products", avatarUrl: "", message: "Thanks for sharing that post.", time: "Yesterday" },
  { id: "demo-thread-3", userId: "demo-person-3", name: "Amina Yusuf", headline: "Founder at Common Ground", avatarUrl: "", message: "I would love to hear more about your work.", time: "Monday" },
  { id: "demo-thread-4", userId: "demo-person-5", name: "Elena Torres", headline: "Brand strategist for growing teams", avatarUrl: "", message: "Your perspective on community really resonated.", time: "Friday" },
];

const demoMessages = {
  "demo-thread-1": [
    { id: "demo-message-1", senderId: "demo-person-1", content: "The launch notes are looking great. Want to review them together?" },
    { id: "demo-message-2", senderId: "demo-person-1", content: "I highlighted the two decisions we still need to make." },
  ],
  "demo-thread-2": [{ id: "demo-message-3", senderId: "demo-person-2", content: "Thanks for sharing that post." }],
  "demo-thread-3": [{ id: "demo-message-4", senderId: "demo-person-3", content: "I would love to hear more about your work." }],
  "demo-thread-4": [{ id: "demo-message-5", senderId: "demo-person-5", content: "Your perspective on community really resonated." }],
};

function displayTime(value) {
  if (!value) return "New";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export default function Messaging() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const selected = threads.find((thread) => thread.id === selectedId);

  useEffect(() => {
    api.get("/messages/threads").then((res) => {
      const nextThreads = res.data.length ? res.data : demoThreads;
      setThreads(nextThreads);
      if (nextThreads[0]) setSelectedId(nextThreads[0].id);
    }).catch(() => {
      setThreads(demoThreads);
      setSelectedId(demoThreads[0].id);
    });
  }, []);

  useEffect(() => {
    if (selected) {
      if (String(selected.id).startsWith("demo-")) {
        setMessages(demoMessages[selected.id] || []);
      } else {
        api.get(`/messages/${selected.userId}`).then((res) => setMessages(res.data)).catch(() => setMessages([]));
      }
    }
  }, [selectedId, selected]);

  async function sendMessage(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    if (String(selected.id).startsWith("demo-")) {
      const nextMessage = { id: `demo-message-${Date.now()}`, senderId: user?.id, content: draft.trim() };
      setMessages((current) => [...current, nextMessage]);
      setThreads((current) => current.map((thread) => thread.id === selectedId ? { ...thread, message: nextMessage.content, time: "Now" } : thread));
      setDraft("");
      return;
    }
    const res = await api.post(`/messages/${selected.userId}`, { content: draft });
    setMessages((current) => [...current, res.data]);
    setThreads((current) => current.map((thread) => thread.id === selectedId ? { ...thread, message: res.data.content, time: "Now" } : thread));
    setDraft("");
  }

  if (!selected) return <div className="page page-wide"><div className="page-intro compact-intro"><div><p className="eyebrow">Private conversations</p><h1 className="page-title">Messages</h1><p className="page-lede">Start a conversation from someone&apos;s profile.</p></div></div><div className="empty-state">No conversations yet.</div></div>;

  return <div className="page page-wide"><div className="page-intro compact-intro"><div><p className="eyebrow">Private conversations</p><h1 className="page-title">Messages</h1><p className="page-lede">Keep the important work moving.</p></div></div><div className="messages-shell"><aside className="thread-list"><div className="thread-list-title">Inbox <span>{threads.length}</span></div>{threads.map((thread) => <button className={`thread ${thread.id === selectedId ? "active" : ""}`} key={thread.id} onClick={() => setSelectedId(thread.id)}><Avatar name={thread.name} avatarUrl={thread.avatarUrl} /><span className="thread-copy"><strong>{thread.name}</strong><small>{thread.message}</small></span><time>{displayTime(thread.time)}</time></button>)}</aside><section className="conversation"><header><Avatar name={selected.name} avatarUrl={selected.avatarUrl} /><div><h2>{selected.name}</h2><p>{selected.headline}</p></div></header><div className="conversation-body">{messages.map((message) => <div className={`message-bubble ${message.senderId === user?.id ? "sent" : "received"}`} key={message.id}>{message.content}</div>)}{messages.length === 0 && <div className="empty-state">No messages yet. Say hello.</div>}</div><form className="message-form" onSubmit={sendMessage}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${selected.name.split(" ")[0]}`} aria-label="Message" /><button className="btn-primary" disabled={!draft.trim()}>Send</button></form></section></div></div>;
}
