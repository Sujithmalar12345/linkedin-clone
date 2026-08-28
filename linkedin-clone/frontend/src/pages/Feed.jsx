import { useEffect, useRef, useState } from "react";
import api from "../api";
import PostCard from "../components/PostCard.jsx";
import { useAuth } from "../AuthContext.jsx";

const demoPosts = [
  { id: "demo-post-1", content: "A useful reminder for this week: the best product decisions usually get clearer when you spend more time listening before proposing solutions.", mediaUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80", mediaType: "image", createdAt: new Date(Date.now() - 3600000).toISOString(), likeCount: 18, likedByMe: false, author: { id: "demo-person-1", name: "Maya Chen", headline: "Product designer at Northstar Labs", avatarUrl: "" } },
  { id: "demo-post-2", content: "We are experimenting with shorter meetings and better written context. The result: more focus, fewer handoffs, and surprisingly better questions.", mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", mediaType: "video", createdAt: new Date(Date.now() - 86400000).toISOString(), likeCount: 24, likedByMe: false, author: { id: "demo-person-2", name: "Jon Bell", headline: "Engineering lead building calm products", avatarUrl: "" } },
  { id: "demo-post-3", content: "What is one skill you learned recently that changed how you work? I am collecting thoughtful answers from this community.", mediaUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80", mediaType: "image", createdAt: new Date(Date.now() - 172800000).toISOString(), likeCount: 9, likedByMe: false, author: { id: "demo-person-3", name: "Amina Yusuf", headline: "Founder at Common Ground", avatarUrl: "" } },
];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState("");
  const mediaInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/posts")
      .then((res) => setPosts(res.data.length ? res.data : demoPosts))
      .catch(() => setPosts(demoPosts))
      .finally(() => setLoading(false));
  }, []);

  async function handlePost(e) {
    e.preventDefault();
    if (!content.trim() && !mediaFile) return;
    setPosting(true);
    setError("");
    try {
      let media = { mediaUrl: "", mediaType: "" };
      if (mediaFile) {
        const formData = new FormData();
        formData.append("media", mediaFile);
        const uploadRes = await api.post("/posts/media", formData);
        media = uploadRes.data;
      }
      const res = await api.post("/posts", { content, ...media });
      setPosts((prev) => [res.data, ...prev]);
      setContent("");
      setMediaFile(null);
      if (mediaInputRef.current) mediaInputRef.current.value = "";
    } catch (err) {
      setError(err.response?.data?.error || "Could not publish your post");
    } finally {
      setPosting(false);
    }
  }

  function handlePostChanged(updated, deletedId) {
    if (deletedId) {
      setPosts((prev) => prev.filter((p) => p.id !== deletedId));
    } else {
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  }

  return (
    <div className="page">
      <div className="composer">
        <form onSubmit={handlePost}>
          <div className="composer-row">
            <textarea
              placeholder={`What are you working on, ${user?.name?.split(" ")[0] || ""}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="composer-actions">
            <div className="media-controls">
              <label className="media-picker">
                <span>{mediaFile ? mediaFile.name : "Add a photo or video"}</span>
                <input ref={mediaInputRef} type="file" accept="image/*,video/*" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <button disabled={posting || (!content.trim() && !mediaFile)}>
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
          {error && <div className="error-text">{error}</div>}
        </form>
      </div>

      {loading && <div className="loading-state">Loading feed...</div>}
      {!loading && posts.length === 0 && (
        <div className="empty-state">No posts yet. Be the first to share something.</div>
      )}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onChanged={handlePostChanged} />
      ))}
    </div>
  );
}
