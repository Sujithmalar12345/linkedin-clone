import { useEffect, useState } from "react";
import api from "../api";

const demoJobs = [
  { id: "demo-job-1", title: "Senior Product Designer", company: "Northstar Labs", location: "Remote", type: "Full-time", tag: "Design", saved: false },
  { id: "demo-job-2", title: "Frontend Engineer", company: "Field Notes", location: "New York, NY", type: "Full-time", tag: "Engineering", saved: false },
  { id: "demo-job-3", title: "Community Lead", company: "Good Work Studio", location: "Austin, TX", type: "Contract", tag: "Community", saved: false },
  { id: "demo-job-4", title: "Data Analyst", company: "Signal House", location: "Remote", type: "Full-time", tag: "Data", saved: false },
  { id: "demo-job-5", title: "Customer Success Manager", company: "Brightside", location: "Chicago, IL", type: "Full-time", tag: "Customer Success", saved: false },
  { id: "demo-job-6", title: "Operations Coordinator", company: "Common Ground", location: "Remote", type: "Part-time", tag: "Operations", saved: false },
];

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs", { params: { q: search } })
      .then((res) => setJobs(res.data.length ? res.data : demoJobs.filter((job) => `${job.title} ${job.company} ${job.tag}`.toLowerCase().includes(search.toLowerCase()))))
      .catch(() => setJobs(demoJobs.filter((job) => `${job.title} ${job.company} ${job.tag}`.toLowerCase().includes(search.toLowerCase()))))
      .finally(() => setLoading(false));
  }, [search]);

  const visibleJobs = jobs;

  async function toggleSaved(job) {
    if (String(job.id).startsWith("demo-")) {
      setJobs((current) => current.map((item) => item.id === job.id ? { ...item, saved: !item.saved } : item));
      return;
    }
    const res = await api.post(`/jobs/${job.id}/save`);
    setJobs((current) => current.map((item) => item.id === job.id ? { ...item, saved: res.data.saved } : item));
  }

  return (
    <div className="page page-wide">
      <div className="page-intro"><div><p className="eyebrow">Next step</p><h1 className="page-title">Find your next role</h1><p className="page-lede">Explore opportunities from teams doing thoughtful work.</p></div><div className="stat-block"><strong>{visibleJobs.length}</strong><span>open roles</span></div></div>
      <div className="jobs-layout">
        <aside className="jobs-sidebar"><h2>Job search</h2><label htmlFor="job-search">Keywords</label><input id="job-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Role, company, skill" /><div className="filter-note">Showing roles matched to your interests</div></aside>
        <section><div className="section-heading-row"><h2 className="section-title">Recommended for you</h2><span className="result-count">Updated today</span></div>{loading && <div className="loading-state">Loading roles...</div>}{visibleJobs.map((job) => <article className="job-card" key={job.id}><div className="job-mark">{job.company.charAt(0)}</div><div className="job-details"><h3>{job.title}</h3><p className="job-company">{job.company}</p><p className="job-meta">{job.location} &middot; {job.type}</p><span className="job-tag">{job.tag}</span></div><button className={`save-button ${job.saved ? "saved" : ""}`} onClick={() => toggleSaved(job)} aria-label={job.saved ? "Unsave job" : "Save job"}>{job.saved ? "Saved" : "Save"}</button></article>)}</section>
      </div>
    </div>
  );
}
