import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import PostCard from "../components/PostCard";

export default function DiscussionBoard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [authUser, setAuthUser] = useState(storedUser);

  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [viewYourPosts, setViewYourPosts] = useState(false);

  useEffect(() => {
    if (!authUser) navigate("/login");
    else fetchPosts();
  }, [authUser, navigate]);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/post");
      setAllPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthUser(null);
    navigate("/login");
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!topic || !description) return;

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await API.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTopic(""); setDescription(""); setImage(null); setShowPopup(true);
      fetchPosts();
      setTimeout(() => setShowPopup(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    if (!authUser) return;

    setAllPosts(prev =>
      prev.map(post => {
        if (post._id === postId) {
          const hasLiked = post.likes?.some(u =>
            (u.id || u._id) === authUser.id
          );
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter(u => (u.id || u._id) !== authUser.id)
              : [...(post.likes || []), { id: authUser.id, name: authUser.name || authUser.email }],
          };
        }
        return post;
      })
    );

    try {
      await API.post(`/post/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId, text) => {
    if (!authUser || !text) return;
    try {
      await API.post(`/post/${postId}/comment`, { text }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (postId) => {
    try {
      await API.delete(`/post/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  if (!authUser) return null;

  const userPosts = allPosts.filter(p => (p.userId || p.user?._id) === authUser.id);
  const displayPosts = viewYourPosts ? userPosts : allPosts;

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3"
        style={{ background: "linear-gradient(90deg, #ff6ec7, #ff0080)", padding: "10px 20px" }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "2.5rem", margin: 0 }}>Discussion Board</h2>
        </div>
        <button onClick={handleLogout}
          style={{ background: "transparent", color: "#fff", border: "1px solid #ff4d4d", padding: "4px 10px", borderRadius: "6px" }}>
          Logout
        </button>
      </div>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Create Post */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm p-3" style={{ backgroundColor: "#1a1a1a", color: "white" }}>
              <h4 className="fw-bold mb-3 text-center">Create Post</h4>
              <form onSubmit={handlePost} className="d-flex flex-column gap-2">
                <input
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <textarea
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  type="file"
                  className="form-control bg-dark text-white border-secondary"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <button
                  className="btn mt-2"
                  style={{ background: "linear-gradient(90deg, #ff6ec7, #8e2de2)", color: "white", border: "none" }}
                >
                  Post
                </button>
              </form>

              <AnimatePresence>
                {showPopup && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className="mt-3 p-2 rounded text-center fw-bold" style={{ background: "#28a745", color: "white" }}>
                    Posting Discussion...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Posts */}
          <div className="col-lg-8">
            {/* Toggle Buttons */}
            <div className="d-flex justify-content-start gap-2 mb-3">
              <button
                className="btn btn-sm"
                style={{
                  background: viewYourPosts ? "linear-gradient(90deg, #ff6ec7, #8e2de2)" : "#1a1a1a",
                  color: "white", border: "none"
                }}
                onClick={() => setViewYourPosts(true)}
              >
                Your Posts
              </button>
              <button
                className="btn btn-sm"
                style={{
                  background: !viewYourPosts ? "linear-gradient(90deg, #ff6ec7, #8e2de2)" : "#1a1a1a",
                  color: "white", border: "none"
                }}
                onClick={() => setViewYourPosts(false)}
              >
                All Posts
              </button>
            </div>

            {/* Display posts */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {displayPosts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  authUser={authUser}
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={handleDelete}
                  isUserPost={(post.userId || post.user?._id) === authUser.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
