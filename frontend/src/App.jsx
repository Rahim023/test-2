import React, { useState, useEffect } from "react";
import "./App.css"; // Make sure this is imported

function App() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/enquiry")
      .then((res) => res.json())
      .then((data) => setEnquiries(data));
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
      setEnquiries([data.enquiry, ...enquiries]);
    }
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
      <ul className="enquiry-list">
        {enquiries.map((enq) => (
          <li key={enq._id} className="enquiry-item">
            <strong>{enq.name}</strong> ({enq.email})<br />
            <span>{enq.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
