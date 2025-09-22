import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaTrash, FaPaperPlane } from "react-icons/fa";

export default function PostCard({ post, authUser, onLike, onComment, onDelete, isUserPost }) {
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(post._id, comment);
      setComment("");
    }
  };

  const hasLiked = authUser && post.likes?.some((user) => user.id === authUser.id);

  return (
    <>
      {/* Post Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="col d-flex"
      >
        <div
          className="card w-100 shadow-sm d-flex flex-column"
          style={{
            backgroundColor: "#121212",
            color: "#fff",
            borderRadius: "16px",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={(e) => {
            if (!e.target.closest("button") && !e.target.closest("input") && !e.target.closest("form")) {
              setShowModal(true);
            }
          }}
        >
          {/* Pink Gradient Strip */}
          <div
            style={{
              height: "6px",
              background: "linear-gradient(135deg, #ff4da6, #ff0080)",
            }}
          ></div>

          {/* Post Image */}
          {post.imageUrl && (
            <img
              src={`http://localhost:5000/uploads/${post.imageUrl}`}
              alt="post"
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />
          )}

          {/* Post Content */}
          <div className="p-3 d-flex flex-column flex-grow-1">
            <h5 style={{ fontWeight: "700" }}>{post.topic}</h5>
            <p style={{ color: "#ccc", flexGrow: 1 }}>
              {post.description?.length > 120
                ? post.description.slice(0, 120) + "..."
                : post.description}
            </p>
            <small style={{ color: "#888", marginBottom: "8px" }}>
              By {post.userName || "Unknown"}
            </small>

            {/* Bottom Action Bar */}
            <div className="d-flex align-items-center gap-2 mb-2">
              {/* Like */}
              <button
                className="btn d-flex align-items-center gap-1 p-1"
                style={{
                  background: "transparent",
                  color: hasLiked ? "#ff4da6" : "#fff",
                  border: "none",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(post._id);
                }}
              >
                <FaHeart /> {post.likes?.length || 0}
              </button>

              {/* Delete */}
              {isUserPost && (
                <button
                  className="btn p-1 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "rgba(230, 57, 70, 0.3)",
                    color: "#e63946",
                    border: "none",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post._id);
                  }}
                >
                  <FaTrash />
                </button>
              )}
            </div>

            {/* Comment Input */}
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                handleCommentSubmit(e);
              }}
              className="d-flex align-items-center gap-2"
            >
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                style={{
                  flexGrow: 1,
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border: "1px solid #333",
                  backgroundColor: "#1c1c1c",
                  color: "#fff",
                  fontSize: "0.95rem",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#ff4da6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              style={{
                backgroundColor: "#121212",
                color: "#fff",
                width: "90%",
                maxWidth: "700px",
                maxHeight: "90%",
                borderRadius: "16px",
                overflowY: "auto",
                padding: "20px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient Strip */}
              <div
                style={{
                  height: "6px",
                  background: "linear-gradient(135deg, #ff4da6, #ff0080)",
                  borderRadius: "6px 6px 0 0",
                  marginBottom: "16px",
                }}
              ></div>

              {/* Header */}
              <h2>{post.topic}</h2>
              <p>{post.description}</p>
              <small>By {post.userName}</small>

              {post.imageUrl && (
                <img
                  src={`http://localhost:5000/uploads/${post.imageUrl}`}
                  alt="post"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    margin: "12px 0",
                  }}
                />
              )}

              {/* Likes & Comments Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginTop: "16px",
                }}
              >
                {/* Likes Section */}
                <div>
                  <h4>Likes ({post.likes?.length || 0})</h4>
                  {post.likes?.length > 0 ? (
                    <ul style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {post.likes.map((user, idx) => (
                        <li key={idx}>{user.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <small>No likes yet</small>
                  )}
                </div>

              <div>
  <h5 className="fw-bold">Comments</h5>
  {post.comments?.length > 0 ? (
    <ul style={{ maxHeight: "200px", overflowY: "auto", paddingLeft: "10px" }}>
      {post.comments.map((c, idx) => (
        <li key={idx} style={{ color: "white", marginBottom: "6px" }}>
          <strong style={{ color: "#ff6ec7" }}>
            {c.userName || "Anonymous"}
          </strong>
          : {c.text}
        </li>
      ))}
    </ul>
  ) : (
    <small style={{ color: "gray" }}>No comments yet</small>
  )}
</div>

</div>
              {/* Full-width Comment Box */}
              <form
                onSubmit={handleCommentSubmit}
                className="d-flex gap-2 mt-4"
              >
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  style={{
                    flexGrow: 1,
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #333",
                    backgroundColor: "#1c1c1c",
                    color: "#fff",
                    fontSize: "0.95rem",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#ff4da6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
