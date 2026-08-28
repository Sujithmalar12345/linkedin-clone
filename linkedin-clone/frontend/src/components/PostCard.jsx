import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { useAuth } from "../AuthContext.jsx";
import api from "../api";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  const units = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label} ago`;
  }
  return "just now";
}

export default function PostCard({ post, onChanged }) {
  const { user } = useAuth();

  async function toggleLike() {
    if (String(post.id).startsWith("demo-")) {
      onChanged({ ...post, likedByMe: !post.likedByMe, likeCount: post.likeCount + (post.likedByMe ? -1 : 1) });
      return;
    }
    const res = await api.post(`/posts/${post.id}/like`);
    onChanged({ ...post, likedByMe: res.data.liked, likeCount: res.data.likeCount });
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/posts/${post.id}`);
    onChanged(null, post.id);
  }

  const isOwner = user && user.id === post.author.id;

  return (
    <article className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.author.id}`}>
          <Avatar name={post.author.name} avatarUrl={post.author.avatarUrl} />
        </Link>
        <div>
          <Link to={`/profile/${post.author.id}`} className="post-author-name">
            {post.author.name}
          </Link>
          <div className="post-author-headline">{post.author.headline}</div>
          <div className="post-time">{timeAgo(post.createdAt)}</div>
        </div>
      </div>

      <p className="post-content">{post.content}</p>
      {post.mediaUrl && post.mediaType === "image" && (
        <img className="post-media" src={post.mediaUrl} alt="Shared post media" />
      )}
      {post.mediaUrl && post.mediaType === "video" && (
        <video className="post-media" src={post.mediaUrl} controls preload="metadata" />
      )}

      <div className="post-footer">
        <button
          className={`like-btn ${post.likedByMe ? "liked" : ""}`}
          onClick={toggleLike}
        >
          {post.likedByMe ? "♥ Liked" : "♡ Like"} · {post.likeCount}
        </button>
        {isOwner && (
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
