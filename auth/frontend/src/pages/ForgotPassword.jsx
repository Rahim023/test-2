import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMsg(res.data.message || "If that email exists, a reset link was sent.");
    } catch (error) {
      setMsg("Request failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#121212" }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "350px",
          backgroundColor: "#1c1b18",
          color: "#f5f0e6",
          borderRadius: "16px",
        }}
      >
        <div
          style={{
            height: "6px",
            background: "linear-gradient(135deg, #ff4da6, #ff0080)",
            borderRadius: "6px 6px 0 0",
            marginBottom: "16px",
          }}
        ></div>

        <h3 className="fw-bold mb-3 text-center text-white">Forgot Password</h3>

        {msg && (
          <div
            className={`alert ${
              msg.includes("failed") ? "alert-danger" : "alert-info"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
          <input
            type="email"
            className="form-control bg-dark text-light border-0"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn fw-bold text-white"
            style={{
              background: "linear-gradient(135deg, #ff4da6, #ff0080)",
              border: "none",
            }}
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-3 text-center" style={{ color: "#bbb" }}>
          <Link to="/login" style={{ color: "#ff4da6" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
