const mongoose = require("mongoose");

const userinfoSchema = new mongoose.Schema({
  emergency: String,
  location: String,
  description: String,
  time: Date
});

module.exports = mongoose.model("Userinfo", userinfoSchema, "Userinfo");