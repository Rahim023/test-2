import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; 
import "./App.css";

function App() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/enquiry")
      .then((res) => res.json())
      .then((data) =>
        setEnquiries(data.map((enq) => ({ ...enq, likes: 0 })))
      );
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      alert("Enquiry submitted!");
      setForm({ name: "", email: "", phone: "", message: "" });
      setEnquiries([{ ...data.enquiry, likes: 0 }, ...enquiries]);
    }
  };

  // Infinite Like (always +1)
  const addLike = (id) => {
    setEnquiries((prev) =>
      prev.map((enq) =>
        enq._id === id ? { ...enq, likes: enq.likes + 1 } : enq
      )
    );
  };

  // Infinite Dislike (always -1)
  const addDislike = (id) => {
    setEnquiries((prev) =>
      prev.map((enq) =>
        enq._id === id ? { ...enq, likes: enq.likes - 1 } : enq
      )
    );
  };

  return (
    <div className="container">
      <h1>Discussion Board Enquiry</h1>

      <form onSubmit={handleSubmit} className="enquiry-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>

      <h2>All Enquiries</h2>
      <ul className="enquiry-list" style={{ listStyle: "none", padding: 0 }}>
        {enquiries.map((enq) => (
          <li 
            key={enq._id} 
            className="enquiry-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}
          >
            {/* Left side: Enquiry details */}
            <div style={{ flex: 1 }}>
              <strong>{enq.name}</strong> <span style={{ color: "#130202ff" }}>({enq.email})</span>
              <p style={{ margin: "5px 0" }}>{enq.message}</p>
            </div>

            {/* Right side: Like/Dislike */}
            <div 
              className="like-section" 
              style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "60px" }}
            >
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <AiFillHeart
                  size={24}
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => addLike(enq._id)}
                />
                <AiOutlineHeart
                  size={22}
                  color="gray"
                  style={{ cursor: "pointer" }}
                  onClick={() => addDislike(enq._id)}
                />
              </div>
              <div className="like-count" style={{ marginTop: "4px", fontWeight: "bold" }}>
                {enq.likes}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
