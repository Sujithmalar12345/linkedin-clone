import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Landing() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page loading-state">Loading...</div>;
  if (user) return null;

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="landing-kicker">A better way to move forward</p>
          <h1>Meet the people behind the work.</h1>
          <p className="landing-lede">Ripple brings your professional world into focus: thoughtful conversations, meaningful connections, and opportunities that fit.</p>
          <div className="landing-actions"><Link to="/register" className="landing-primary">Create your account <span>↗</span></Link><Link to="/login" className="landing-secondary">Sign in</Link></div>
          <div className="landing-proof"><div><strong>12k+</strong><span>people building</span></div><div><strong>420</strong><span>open opportunities</span></div><div><strong>98%</strong><span>good conversations</span></div></div>
        </div>
        <div className="landing-visual" aria-label="Ripple feed preview">
          <div className="visual-topline"><span className="visual-brand"><i /> Ripple</span><span className="visual-status">Your circle, in motion</span></div>
          <div className="visual-profile"><div className="visual-avatar">MC</div><div><strong>Maya Chen</strong><span>Product designer · New York</span></div><b>•••</b></div>
          <p className="visual-post">The best ideas get better when they have room to breathe. What are you making space for this week?</p>
          <div className="visual-reactions"><span>♥ 24</span><span>↗ Share</span><span>Comment</span></div>
          <div className="visual-thread"><div className="visual-avatar small">AJ</div><div><strong>Alex joined the conversation</strong><span>That is exactly the reminder I needed.</span></div></div>
          <div className="visual-accent accent-one" /><div className="visual-accent accent-two" />
        </div>
      </section>
      <section className="landing-lower"><div><p className="landing-kicker">More than a profile</p><h2>A living space for your professional story.</h2></div><div className="landing-points"><article><span>01</span><h3>Share what matters</h3><p>Turn small insights into conversations with people who get the context.</p></article><article><span>02</span><h3>Find your people</h3><p>Build a network around curiosity, craft, and the work you want to do next.</p></article><article><span>03</span><h3>Keep moving</h3><p>Discover roles, ideas, and collaborators without losing your signal.</p></article></div></section>
    </main>
  );
}
