function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function Avatar({ name, avatarUrl, size = "md" }) {
  const className = size === "lg" ? "avatar avatar-lg" : "avatar";
  return (
    <div className={className}>
      {avatarUrl ? <img src={avatarUrl} alt={name} /> : initials(name)}
    </div>
  );
}
