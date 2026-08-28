import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const demoCompany = {
  id: "demo-company", name: "Northstar Labs", tagline: "Tools for teams doing their best work.",
  about: "Northstar Labs builds thoughtful software for modern teams. We care about clear communication, durable systems, and making work feel a little more human.", website: "northstarlabs.example", industry: "Software Development", size: "51-200 employees", location: "New York, NY", founded: 2018, followerCount: 8420, following: false,
  posts: [
    { id: "demo-company-post-1", content: "We are building a calmer way for teams to plan, share context, and make decisions together. Follow along as we share what we learn.", createdAt: new Date(Date.now() - 7200000).toISOString(), likeCount: 36 },
    { id: "demo-company-post-2", content: "Our latest field note: great collaboration starts with making the invisible work visible. Read the full story on our site.", createdAt: new Date(Date.now() - 172800000).toISOString(), likeCount: 21 },
  ],
  jobs: [
    { id: "demo-company-job-1", title: "Senior Product Designer", location: "Remote", type: "Full-time" },
    { id: "demo-company-job-2", title: "Frontend Engineer", location: "New York, NY", type: "Full-time" },
    { id: "demo-company-job-3", title: "Community Lead", location: "Remote", type: "Contract" },
  ],
};

function CompanyPost({ post, onLiked }) {
  const [liked, setLiked] = useState(false);
  function toggleLike() {
    setLiked(!liked);
    onLiked(post.id, liked ? -1 : 1);
  }
  return <article className="post-card"><div className="post-header"><div className="company-mini-logo">N</div><div><strong className="post-author-name">Northstar Labs</strong><div className="post-author-headline">Tools for teams doing their best work.</div><div className="post-time">{new Date(post.createdAt).toLocaleDateString()}</div></div></div><p className="post-content">{post.content}</p><div className="post-footer"><button className={`like-btn ${liked ? "liked" : ""}`} onClick={toggleLike}>{liked ? "♥ Liked" : "♡ Like"} · {post.likeCount}</button></div></article>;
}

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [company, setCompany] = useState(demoCompany);
  const [analytics, setAnalytics] = useState({ uniqueVisitors: 12480, followers: 8420, engagement: 64, invites: 0 });
  const [invited, setInvited] = useState(false);

  useEffect(() => { api.get("/company").then((res) => setCompany(res.data)).catch(() => {}); }, []);
  useEffect(() => { if (activeTab === "Analytics") api.get("/company/analytics").then((res) => setAnalytics(res.data)).catch(() => {}); }, [activeTab]);

  async function toggleFollow() {
    if (String(company.id).startsWith("demo-")) { setCompany((current) => ({ ...current, following: !current.following, followerCount: current.followerCount + (current.following ? -1 : 1) })); return; }
    const res = await api.post("/company/follow");
    setCompany((current) => ({ ...current, following: res.data.following, followerCount: current.followerCount + (res.data.following ? 1 : -1) }));
  }

  async function inviteFollowers() {
    if (!String(company.id).startsWith("demo-")) await api.post("/company/invite");
    setInvited(true);
  }

  function handleLiked(id, amount) { setCompany((current) => ({ ...current, posts: current.posts.map((post) => post.id === id ? { ...post, likeCount: post.likeCount + amount } : post) })); }

  return <div className="page page-wide company-page"><section className="company-hero"><div className="company-banner"><span className="banner-wordmark">NORTHSTAR</span><span className="banner-star">✦</span></div><div className="company-identity"><div className="company-logo">N</div><div className="company-heading"><h1>{company.name}</h1><p>{company.tagline}</p><span>{company.industry} · {company.location} · {company.followerCount.toLocaleString()} followers</span></div><div className="company-actions"><button className={company.following ? "btn-secondary" : "btn-primary company-follow"} onClick={toggleFollow}>{company.following ? "Following" : "Follow"}</button><button className="btn-secondary" onClick={inviteFollowers}>{invited ? "Invites sent" : "Invite to follow"}</button></div></div><nav className="company-tabs" aria-label="Company page sections">{["Overview", "Posts", "Jobs", "Analytics"].map((tab) => <button className={activeTab === tab ? "active" : ""} key={tab} onClick={() => setActiveTab(tab)}>{tab}{tab === "Jobs" && <span>{company.jobs.length}</span>}</button>)}</nav></section>
    {activeTab === "Overview" && <div className="company-columns"><main><section className="company-section"><h2>About</h2><p>{company.about}</p><Link to="/jobs" className="company-link">Visit our jobs</Link></section><section className="company-section"><div className="section-heading-row"><h2>Life at {company.name}</h2><span className="result-count">What we value</span></div><div className="value-grid"><div><strong>Clarity</strong><span>Write it down. Make it useful.</span></div><div><strong>Curiosity</strong><span>Keep asking better questions.</span></div><div><strong>Care</strong><span>Build for people, not metrics.</span></div></div></section></main><aside className="company-sidebar"><h2>Page details</h2><dl><div><dt>Website</dt><dd>{company.website}</dd></div><div><dt>Company size</dt><dd>{company.size}</dd></div><div><dt>Headquarters</dt><dd>{company.location}</dd></div><div><dt>Founded</dt><dd>{company.founded}</dd></div></dl><button className="admin-tool" onClick={() => setActiveTab("Analytics")}>View page analytics</button></aside></div>}
    {activeTab === "Posts" && <section className="company-feed"><div className="section-heading-row"><div><p className="eyebrow">From the company</p><h2 className="section-title">Latest updates</h2></div><span className="result-count">Public posts</span></div>{company.posts.map((post) => <CompanyPost key={post.id} post={post} onLiked={handleLiked} />)}</section>}
    {activeTab === "Jobs" && <section className="company-section company-jobs"><div className="section-heading-row"><div><p className="eyebrow">Build with us</p><h2 className="section-title">Open positions</h2></div><Link to="/jobs" className="company-link">See all jobs</Link></div>{company.jobs.map((job) => <article className="company-job" key={job.id}><div className="company-job-mark">N</div><div><h3>{job.title}</h3><p>{company.name} · {job.location} · {job.type}</p></div><Link to="/jobs" className="btn-secondary">View role</Link></article>)}</section>}
    {activeTab === "Analytics" && <section className="analytics-panel"><p className="eyebrow">Admin view</p><h2 className="page-title">Page analytics</h2><p className="page-lede">Understand who is discovering your company page.</p><div className="analytics-grid"><div><strong>{analytics.uniqueVisitors.toLocaleString()}</strong><span>unique visitors</span><small>Live page views</small></div><div><strong>{analytics.followers.toLocaleString()}</strong><span>followers</span><small>{analytics.invites} invites sent</small></div><div><strong>{analytics.engagement}%</strong><span>visitor engagement</span><small>Above industry average</small></div></div><div className="admin-note"><strong>Admin tools</strong><span>Invite followers, refresh your banner, and keep your company story current.</span><button className="btn-secondary" onClick={inviteFollowers}>{invited ? "Invitations sent" : "Invite followers"}</button></div></section>}
  </div>;
}
