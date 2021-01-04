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

route.post("/en/create-comment", upload.single("commentMedia"), (req, res) => {

    if (!req.cookies.id)
        res.send('<p>Cannot create comment without an account</p><input type="button" value="Back" onclick="history.back()">');
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
                        res.redirect(`/en/get-post/${req.query.post}`);
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
                        res.redirect("/en/get-post/${req.query.post}");
                    });
                }
                else {
                    res.send('<p>Comment with no content</p><input type="button" value="Back" onclick="history.back()">');
                }
            });

            module.exports = { postID: req.query.post };
        });
        
        
    }
});

route.post("/ro/create-comment", upload.single("commentMedia"), (req, res) => {

    if (!req.cookies.id)
        res.send('<p>Nu poti creea un comentariu fara cont</p><input type="button" value="Back" onclick="history.back()">');
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
                        res.redirect(`/ro/get-post/${req.query.post}`);
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
                        res.redirect("/ro/get-post/${req.query.post}");
                    });
                }
                else {
                    res.send('<p>Contentariu fara continut</p><input type="button" value="Back" onclick="history.back()">');
                }
            });

            module.exports = { postID: req.query.post };
        });
        
        
    }
});

route.get("/en/delete-comment", (req, res) => {
    Comment.deleteOne({ _id: req.query.comment }, (err) => {
        if (err)
            throw err;
    }).then(comment => {
        res.redirect(`/en/get-post/${comment.post}`);
    });
});

route.get("/ro/delete-comment", (req, res) => {
    Comment.deleteOne({ _id: req.query.comment }, (err) => {
        if (err)
            throw err;
    }).then(comment => {
        res.redirect(`/ro/get-post/${comment.post}`);
    });
});

route.get("/en/get-post", (req, res) => {
    const postID = req.query.post;
    module.exports = { postID };
    res.redirect(`/en/get-post/${postID}`);
});

route.get("/ro/get-post", (req, res) => {
    const postID = req.query.post;
    module.exports = { postID };
    res.redirect(`/ro/get-post/${postID}`);
});

module.exports = { route };