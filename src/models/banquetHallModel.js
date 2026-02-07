const mongoose = require("mongoose");

// Define the Equipment schema for embedded equipment
const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  condition: { type: String, default: "Good" },
  available: { type: Boolean, default: true },
  quantity: { type: Number, default: 1 },
});

// Define the BanquetHall schema (aligned with SeminarHall fields for compatibility)
const banquetHallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  displayId: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  details: { type: String },
  equipment: [equipmentSchema],
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  unavailabilityReason: { type: String },
});

const BanquetHall = mongoose.model("BanquetHall", banquetHallSchema);
module.exports = BanquetHall;
