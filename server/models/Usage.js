const mongoose = require("mongoose");
const UsageSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  usage: { type: Object, default: {} } // { host: seconds }
}, { timestamps: true });

module.exports = mongoose.model("Usage", UsageSchema);
