require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Usage = require("./models/Usage");
const Preference = require("./models/Preference");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5002;
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/productivitydb";

mongoose.connect(MONGO).then(()=>console.log("Mongo connected")).catch(console.error);

// Helper to get YYYY-MM-DD
function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0,10);
}

// Sync endpoint: receives usage object and stores/merges it per client per day
app.post("/api/sync", async (req, res) => {
  try {
    const { clientId, usage } = req.body;
    if (!clientId) return res.status(400).json({ error: "clientId required" });
    const date = todayStr();
    let doc = await Usage.findOne({ clientId, date });
    if (!doc) {
      doc = new Usage({ clientId, date, usage });
    } else {
      // merge usage seconds
      const existing = doc.usage || {};
      for (const h of Object.keys(usage||{})) {
        existing[h] = (existing[h] || 0) + (usage[h] || 0);
      }
      doc.usage = existing;
    }
    await doc.save();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server error" });
  }
});

// Get today's report for client
app.get("/api/report/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const date = todayStr();
  const doc = await Usage.findOne({ clientId, date });
  res.json(doc || { clientId, date, usage: {} });
});

// Save / fetch preferences (blocked sites)
app.post("/api/prefs", async (req, res) => {
  const { clientId, blocked } = req.body;
  if (!clientId) return res.status(400).json({ error: "clientId required" });
  let pref = await Preference.findOne({ clientId });
  if (!pref) pref = new Preference({ clientId, blocked: blocked || [] });
  else pref.blocked = blocked || [];
  await pref.save();
  res.json({ ok: true, pref });
});
app.get("/api/prefs/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const pref = await Preference.findOne({ clientId });
  res.json(pref || { clientId, blocked: [] });
});

app.listen(PORT, ()=>console.log(`Server running ${PORT}`));
