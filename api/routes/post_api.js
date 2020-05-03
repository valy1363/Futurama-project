const express = require("express");
const route = express.Router();
const path = require("path");
const multer = require("multer");

const Post = require("../Schimas/post_schema");
const Comment = require("../Schimas/comment_schema");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads/postMedia/");
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({
    storage: storage
  });

route.post("/create-post", upload.single("postMedia"), (req, res) => {
    if (!req.cookies.id)
        res.json("you need an account to create a comment")
    else {
        if (req.file) {
            let post = new Post({
                title: req.body.title,
                content: req.body.content,
                section: req.body.section,
                author: req.cookies.id,
                media: req.file.path
            });

            post.save().then(() => {
                res.redirect("/en/forum");
            });
        }
        else if (req.body.content && !req.file) {
            let post = new Post({
                title: req.body.title,
                content: req.body.content,
                section: req.body.section,
                author: req.cookies.id
            });

            post.save().then(doc => {
                res.redirect("/en/forum");
            });
        }
        else {
            res.json("comment with no content");
        }
    }
});

route.get("/delete-post", (req, res) => {
    Post.findOne({ _id: req.query.post }).then(post => {
        Post.remove({ _id: req.query.post }, err => {
            if (err)
                throw err;
            
            Comment.remove({ post: post._id }, err => {
                if (err)
                    throw err;
                res.redirect("/en/forum");
            });
            
        });
    });
});

route.get("/up", (req, res) => {
    if (req.cookies.id != undefined) {
        Post.findOne({ _id: req.query.post }, (err, post) => {
            if (err)
                throw err;

            let found = 0;
            post.likedBy.forEach(element => {
                if (element == req.cookies.id) {
                    found = 1;
                }
            });
            
            if (found == 1)
                Post.findOneAndUpdate({ _id: req.query.post }, { $pull: { likedBy: req.cookies.id } }, (err, doc) => {
                    res.redirect("/en/forum");
                });
            
            else
                Post.findOneAndUpdate({ _id: req.query.post }, { $push: { likedBy: req.cookies.id } }, (err, doc) => {
                    res.redirect("/en/forum");
                });
        });
    }
});

route.get("/down", (req, res) => {
    if (req.cookies.id != undefined) {
        Post.findOne({ _id: req.query.post }, (err, post) => {
            if (err)
                throw err;

                let found = 0;
                post.dislikedBy.forEach(element => {
                    if (element == req.cookies.id) {
                        found = 1;
                    }
                });
                
                if (found == 1)
                    Post.findOneAndUpdate({ _id: req.query.post }, { $pull: { dislikedBy: req.cookies.id } }, (err, doc) => {
                        res.redirect("/en/forum");
                    });
                
                else
                    Post.findOneAndUpdate({ _id: req.query.post }, { $push: { dislikedBy: req.cookies.id } }, (err, doc) => {
                        res.redirect("/en/forum");
                    });
        });
    }
});

module.exports = { route };