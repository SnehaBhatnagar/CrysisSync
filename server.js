console.log("THIS SERVER FILE IS RUNNING");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Staff = require("./models/Staff");
const Userinfo = require("./models/Userinfo");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 FIXED DATABASE (IMPORTANT)
mongoose.connect("mongodb://127.0.0.1:27017/admin")
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));
// staff login post route

app.post("/login", async (req, res) => {
  try {
    const user = await Staff.findOne({
      name: req.body.name,
      password: req.body.password
    });
    if (user) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
// Sos POST route
app.post("/sos", async (req, res) => {
  try {
    const { emergency, location, description } = req.body;

    console.log("Incoming SOS:", req.body); // debug

    const newData = new Userinfo({
      emergency,
      location,
      description,
      time: new Date()
    });

    await newData.save();

    console.log("Saved successfully");

    res.json({ success: true });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ success: false });
  }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
//Get all SOS data
app.get("/getsos", async (req, res) => {
  const data = await Userinfo.find();
  res.json(data);
});

// 🚀 Start server
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on http://localhost:5000");
});