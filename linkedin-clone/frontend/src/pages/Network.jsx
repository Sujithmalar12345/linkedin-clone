import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Avatar from "../components/Avatar.jsx";
import { useAuth } from "../AuthContext.jsx";

const demoPeople = [
  { id: "demo-person-1", name: "Maya Chen", headline: "Product designer at Northstar Labs", avatarUrl: "" },
  { id: "demo-person-2", name: "Jon Bell", headline: "Engineering lead building calm products", avatarUrl: "" },
  { id: "demo-person-3", name: "Amina Yusuf", headline: "Founder at Common Ground", avatarUrl: "" },
  { id: "demo-person-4", name: "Ravi Shah", headline: "Data storyteller and researcher", avatarUrl: "" },
  { id: "demo-person-5", name: "Elena Torres", headline: "Brand strategist for growing teams", avatarUrl: "" },
  { id: "demo-person-6", name: "Theo Martin", headline: "Developer advocate and writer", avatarUrl: "" },
  { id: "demo-person-7", name: "Priya Nair", headline: "People operations partner", avatarUrl: "" },
  { id: "demo-person-8", name: "Sam Okafor", headline: "Independent creative director", avatarUrl: "" },
];

export default function Network() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(new Set());

  useEffect(() => {
    Promise.all([api.get("/users"), api.get("/connections")])
      .then(([peopleRes, connectionsRes]) => {
        setPeople(peopleRes.data.length ? peopleRes.data : demoPeople);
        setPending(new Set(connectionsRes.data.map((connection) => connection.addressee_id)));
      })
      .catch(() => setPeople(demoPeople))
      .finally(() => setLoading(false));
  }, []);

  async function searchPeople(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/users", { params: { q: query } });
      setPeople(res.data.length ? res.data : demoPeople.filter((person) => person.name.toLowerCase().includes(query.toLowerCase())));
    } catch {
      setPeople(demoPeople.filter((person) => person.name.toLowerCase().includes(query.toLowerCase())));
    } finally {
      setLoading(false);
    }
  }

  async function connect(id) {
    if (!String(id).startsWith("demo-")) await api.post(`/connections/${id}`);
    setPending((current) => new Set(current).add(id));
  }

  const visiblePeople = people.filter((person) => person.id !== user?.id);

  return (
    <div className="page page-wide">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Your professional circle</p>
          <h1 className="page-title">Grow your network</h1>
          <p className="page-lede">Find people to learn from, collaborate with, and keep in touch.</p>
        </div>
        <div className="stat-block"><strong>{visiblePeople.length}</strong><span>people to discover</span></div>
      </div>
      <form className="search-bar" onSubmit={searchPeople}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people by name" aria-label="Search people by name" />
        <button className="btn-primary search-button">Search</button>
      </form>
      <div className="section-heading-row"><h2 className="section-title">People you may know</h2><span className="result-count">{visiblePeople.length} results</span></div>
      {loading && <div className="loading-state">Finding people...</div>}
      {!loading && visiblePeople.length === 0 && <div className="empty-state">No people matched that search.</div>}
      <div className="people-grid">
        {visiblePeople.map((person) => (
          <article className="person-card" key={person.id}>
            <Avatar name={person.name} avatarUrl={person.avatarUrl} size="lg" />
            <Link className="person-name" to={`/profile/${person.id}`}>{person.name}</Link>
            <p className="person-headline">{person.headline || "Member of the Ripple community"}</p>
            <div className="person-actions"><Link className="btn-secondary" to={`/profile/${person.id}`}>View profile</Link><button className="btn-connect" onClick={() => connect(person.id)} disabled={pending.has(person.id)}>{pending.has(person.id) ? "Pending" : "Connect"}</button></div>
          </article>
        ))}
      </div>
    </div>
  );
}
