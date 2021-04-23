const mongoose = require("mongoose");

let Post = new mongoose.Schema({
    title: String,
    content: String,
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    likedBy: Array,
    dislikedBy: Array,
    section: { type: String, ref: "Section" },
    comments: { type: mongoose.Types.ObjectId, ref: "Comments" },
    nrComments: { type: Number, default: 0 },
    media: String
});

module.exports = mongoose.model("Post", Post);