const mongoose = require("mongoose");

let Profile = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, trim: true },
    email: String,
    password: String,
    image: { type: String, default: "uploads/profilePicture/default-picture.png"}
});

module.exports = mongoose.model("User", Profile);