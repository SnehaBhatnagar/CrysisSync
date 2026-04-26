const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: String,
  password: String
});

// 🔥 Force correct collection
module.exports = mongoose.model("staffLogin", staffSchema, "staffLogin");