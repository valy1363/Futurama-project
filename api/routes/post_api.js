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

route.post("/en/create-post", upload.single("postMedia"), (req, res) => {
    if (!req.cookies.id)
        res.send('<p>Cannot create a post without an account</p><input type="button" value="Back" onclick="history.back()">');
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

            post.save().then(() => {
                res.redirect("/en/forum");
            });
        }
        else {
            res.send('<p>Post with no content</p><input type="button" value="Back" onclick="history.back()">');
        }
    }
});

route.post("/ro/create-post", upload.single("postMedia"), (req, res) => {
    if (!req.cookies.id)
        res.send('<p>Nu poti creea o postare fara cont</p><input type="button" value="Back" onclick="history.back()">');
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
                res.redirect("/ro/forum");
            });
        }
        else if (req.body.content && !req.file) {
            let post = new Post({
                title: req.body.title,
                content: req.body.content,
                section: req.body.section,
                author: req.cookies.id
            });

            post.save().then(() => {
                res.redirect("/ro/forum");
            });
        }
        else {
            res.send('<p>Postere fara continut</p><input type="button" value="Back" onclick="history.back()">');
        }
    }
});

route.get("/en/delete-post", (req, res) => {
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

route.get("/ro/delete-post", (req, res) => {
    Post.findOne({ _id: req.query.post }).then(post => {
        Post.remove({ _id: req.query.post }, err => {
            if (err)
                throw err;
            
            Comment.remove({ post: post._id }, err => {
                if (err)
                    throw err;
                res.redirect("/ro/forum");
            });
            
        });
    });
});

route.get("/en/up", (req, res) => {
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
    else {
        res.send('<p>Cannot like without an account</p><input type="button" value="Back" onclick="history.back()">');
    }
});

route.get("/ro/up", (req, res) => {
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
                    res.redirect("/ro/forum");
                });
            
            else
                Post.findOneAndUpdate({ _id: req.query.post }, { $push: { likedBy: req.cookies.id } }, (err, doc) => {
                    res.redirect("/ro/forum");
                });
        });
    }
    else {
        res.send('<p>Nu poti aprecia o postare fara cont</p><input type="button" value="Back" onclick="history.back()">');
    }
});

route.get("/en/down", (req, res) => {
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
    else {
        res.send('<p>Cannot dislike without an account</p><input type="button" value="Back" onclick="history.back()">');
    }
});

route.get("/ro/down", (req, res) => {
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
                        res.redirect("/ro/forum");
                    });
                
                else
                    Post.findOneAndUpdate({ _id: req.query.post }, { $push: { dislikedBy: req.cookies.id } }, (err, doc) => {
                        res.redirect("/ro/forum");
                    });
        });
    }
    else {
        res.send('<p>Nu poti aprecia o postare fara cont</p><input type="button" value="Back" onclick="history.back()">');
    }
});

module.exports = { route };