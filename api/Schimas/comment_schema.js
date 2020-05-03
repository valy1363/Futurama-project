const mongoose = require("mongoose");

let Comment = new mongoose.Schema({
    post: { type: String, ref: "Post" },
    content: String,
    authorId: String,
    author: String,
    profilePicture: String,
    media: String
});

module.exports = mongoose.model("Comment", Comment);