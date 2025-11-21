const mongoose = require("mongoose");
const PrefSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  blocked: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Preference", PrefSchema);
