const express = require("express");
const router = express.Router();
const Enquiry = require("../models/enquiry");

// POST a new enquiry
router.post("/", async (req, res) => {
  try {
    console.log("Received enquiry:", req.body);

    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const enquiry = new Enquiry({ name, email, phone, message });
    const saved = await enquiry.save();
    console.log("Enquiry saved:", saved);

    res.status(201).json({ success: true, enquiry: saved });
  } catch (err) {
    console.error("Error saving enquiry:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all enquiries
router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    console.error("Error fetching enquiries:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
