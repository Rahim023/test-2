const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  phone: { type: String },
  message: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enquirySchema);
