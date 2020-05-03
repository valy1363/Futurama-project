const mongoose = require("mongoose");

let Section = new mongoose.Schema({
    title: String,
    author: { type: mongoose.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Section", Section);