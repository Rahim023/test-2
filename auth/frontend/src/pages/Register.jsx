import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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

        <h3 className="fw-bold mb-3 text-center text-white">Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
          <input
            type="text"
            className="form-control bg-dark text-light border-0"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="form-control bg-dark text-light border-0"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control bg-dark text-light border-0"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn fw-bold text-white"
            style={{
              background: "linear-gradient(135deg, #ff4da6, #ff0080)",
              border: "none",
            }}
          >
            Register
          </button>
        </form>
        <p className="mt-3 text-center" style={{ color: "#bbb" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#ff4da6" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
