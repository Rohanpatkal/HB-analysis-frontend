"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import { fetchComments, postComment, deleteComment, toggleCommentLike } from "../../../lib/api";
import styles from "./CommentSection.module.css";

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}

// Deterministic avatar colour from name
const AVATAR_COLORS = ["#6366f1","#f59e0b","#10b981","#ef4444","#3b82f6","#ec4899","#8b5cf6","#14b8a6"];
function avatarColor(name = "") {
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// ── Single comment card ───────────────────────────────────────────────────────

function CommentCard({ comment, currentUserId, onDelete, onLike }) {
  const isOwner   = comment.userId === currentUserId;
  const hasLiked  = Array.isArray(comment.likedBy) && comment.likedBy.includes(currentUserId);
  const [deleting, setDeleting] = useState(false);
  const [liking,   setLiking]   = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;
    setDeleting(true);
    await onDelete(comment._id);
    setDeleting(false);
  }

  async function handleLike() {
    if (liking) return;
    setLiking(true);
    await onLike(comment._id);
    setLiking(false);
  }

  return (
    <div className={styles.card}>
      {/* Avatar */}
      <div
        className={styles.avatar}
        style={{ background: avatarColor(comment.userName) }}
        aria-hidden="true"
      >
        {getInitials(comment.userName)}
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardName}>{comment.userName}</span>
          <span className={styles.cardTime}>{timeAgo(comment.createdAt)}</span>
          {isOwner && (
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Delete comment"
              title="Delete"
            >
              {deleting ? "…" : "🗑"}
            </button>
          )}
        </div>

        <p className={styles.cardText}>{comment.text}</p>

        {/* Like button */}
        <button
          className={`${styles.likeBtn} ${hasLiked ? styles.likeBtnActive : ""}`}
          onClick={handleLike}
          disabled={liking}
          aria-label={hasLiked ? "Unlike" : "Like"}
        >
          <span aria-hidden="true">{hasLiked ? "❤️" : "🤍"}</span>
          <span>{comment.likes ?? 0}</span>
        </button>
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function CommentSection() {
  const { userId, userName } = useUser();

  const [comments,  setComments]  = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [text,      setText]      = useState("");
  const [posting,   setPosting]   = useState(false);
  const [postError, setPostError] = useState("");

  // ── Fetch comments ──────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchComments({ limit: 50 });
      setComments(res.comments ?? []);
      setTotal(res.total ?? 0);
    } catch {
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Post comment ────────────────────────────────────────────────────────────
  async function handlePost(e) {
    e.preventDefault();
    if (!text.trim()) return;
    if (!userId) { setPostError("You must be logged in to comment."); return; }

    setPosting(true);
    setPostError("");
    try {
      const res = await postComment({ userId, userName: userName || "Anonymous", text });
      setComments(prev => [res.comment, ...prev]);
      setTotal(prev => prev + 1);
      setText("");
    } catch (err) {
      setPostError(err.message || "Failed to post comment.");
    } finally {
      setPosting(false);
    }
  }

  // ── Delete comment ──────────────────────────────────────────────────────────
  async function handleDelete(commentId) {
    try {
      await deleteComment(commentId, userId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      setTotal(prev => Math.max(0, prev - 1));
    } catch (err) {
      alert(err.message || "Failed to delete.");
    }
  }

  // ── Toggle like ─────────────────────────────────────────────────────────────
  async function handleLike(commentId) {
    try {
      const res = await toggleCommentLike(commentId, userId);
      setComments(prev => prev.map(c => c._id === commentId ? res.comment : c));
    } catch {
      // silently fail
    }
  }

  return (
    <section className={styles.section} aria-labelledby="comments-heading">
      {/* Header */}
      <div className={styles.heading}>
        <h2 id="comments-heading">
          💬 Community Comments
          {total > 0 && <span className={styles.count}>{total}</span>}
        </h2>
        <p>Share your recovery story or encourage others on their journey.</p>
      </div>

      {/* Compose box */}
      <form className={styles.compose} onSubmit={handlePost} aria-label="Write a comment">
        <div
          className={styles.composeAvatar}
          style={{ background: avatarColor(userName || "") }}
          aria-hidden="true"
        >
          {getInitials(userName || "?")}
        </div>

        <div className={styles.composeRight}>
          <textarea
            className={styles.textarea}
            placeholder="Write something encouraging… 🌿"
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={1000}
            rows={3}
            aria-label="Comment text"
          />
          <div className={styles.composeFooter}>
            <span className={styles.charCount}>{text.length}/1000</span>
            {postError && <span className={styles.postError}>{postError}</span>}
            <button
              type="submit"
              className={styles.postBtn}
              disabled={posting || !text.trim()}
            >
              {posting ? <span className={styles.spinner} /> : null}
              {posting ? "Posting…" : "Post Comment"}
            </button>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className={styles.emptyState}>
          <span className={styles.loadingDots}>Loading comments</span>
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <p style={{ color: "#ef4444" }}>{error}</p>
          <button className={styles.retryBtn} onClick={load}>Retry</button>
        </div>
      ) : comments.length === 0 ? (
        <div className={styles.emptyState}>
          <span style={{ fontSize: "2.5rem" }}>💬</span>
          <p>No comments yet. Be the first to share your story!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {comments.map(comment => (
            <CommentCard
              key={comment._id}
              comment={comment}
              currentUserId={userId}
              onDelete={handleDelete}
              onLike={handleLike}
            />
          ))}
        </div>
      )}
    </section>
  );
}
