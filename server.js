const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/CrysisDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
const staffSchema = new mongoose.Schema({
  Name: String,
  Password: String
});
const Staff = mongoose.model("staffLogin", staffSchema, "staffLogin");

const userSchema = new mongoose.Schema({
  emergency: String,
  location: String,
  description: String,
  time: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }
});
const Userinfo = mongoose.model("userinfo", userSchema);

const serviceSchema = new mongoose.Schema({
  name: String,
  type: String,
  location: Object
});
const Service = mongoose.model("services", serviceSchema, "services");
app.post("/login", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const password = req.body.password?.trim();

    const user = await Staff.findOne({ Name: name, Password: password });

    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.post("/sos", async (req, res) => {
  try {
    const { emergency, location, description } = req.body;
    const newData = new Userinfo({ emergency, location, description });
    await newData.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
app.get("/getsos", async (req, res) => {
  try {
    const data = await Userinfo.find().sort({ time: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching SOS data" });
  }
});
app.get("/getservices", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.post("/assign-resource", async (req, res) => {
  try {
    const { sosId, resourceName } = req.body;
    await Userinfo.findByIdAndUpdate(sosId, {
      description: `ASSIGNED TO: ${resourceName}`,
      status: "Resolved"
    });
    res.json({ success: true, message: "Resource assigned successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});