const mongoose = require("mongoose");
const staffSchema = new mongoose.Schema({
  name: String,
  password: String
});
module.exports = mongoose.model("staffLogin", staffSchema, "staffLogin");