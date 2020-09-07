const express = require("express");
const route = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/commentMedia/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage
});

const Comment = require("../Schimas/comment_schema");
const Post = require("../Schimas/post_schema");
const User = require("../Schimas/user_schema");

route.post("/create-comment", upload.single("commentMedia"), (req, res) => {

    if (!req.cookies.id)
        res.json("you need an account to create a comment")
    else {
        Post.findByIdAndUpdate({ _id: req.query.post }, { $inc: { nrComments: 1 } }).then(() => {
            User.findOne({ _id: req.cookies.id }).then(user => {
                if (req.file) {
                    const comment = new Comment({
                        authorId: req.cookies.id,
                        author: user.username,
                        profilePicture: user.image,
                        content: req.body.content,
                        media: req.file.path,
                        post: req.query.post
                    });

                    comment.save().then(doc => {
                        res.redirect(`/get-post/${req.query.post}`);
                    });
                }
                else if (req.body.content && !req.file) {
                    const comment = new Comment({
                        authorId: req.cookies.id,
                        author: user.username,
                        profilePicture: user.image,
                        content: req.body.content,
                        post: req.query.post
                    });

                    comment.save().then(doc => {
                        res.redirect("/get-post/${req.query.post}");
                    });
                }
                else {
                    res.json("comment with no content");
                }
            });

            module.exports = { postID: req.query.post };
        });
        
        
    }
});

route.get("/delete-comment", (req, res) => {
    Comment.deleteOne({ _id: req.query.comment }, (err) => {
        if (err)
            throw err;
    }).then(comment => {
        res.redirect(`/get-post/${comment.post}`);
    });

    
});

route.get("/get-post", (req, res) => {
    const postID = req.query.post;
    module.exports = { postID };
    res.redirect(`/get-post/${postID}`);
});

module.exports = { route };