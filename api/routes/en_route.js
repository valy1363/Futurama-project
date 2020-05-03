const express = require("express");
const route = express.Router();

const User = require("../Schimas/user_schema");
const Section = require("../Schimas/section_schema");
const Post = require("../Schimas/post_schema");
const Comment = require("../Schimas/comment_schema");

route.get("/", (req, res) => {
    res.render("index.ejs");
});

route.get("/forum", (req, res, next) => {
    const cookieUserId = req.cookies.id;

    const sections = [];
    Section.find({}, (err, result) => {
        if (err)
            throw err;
        result.forEach(section => {
            sections.push(section);
        });

        const posts = [];

        let getsection = require("./section_api").section;
        
        if (getsection == undefined)
            getsection = "all";

        if (getsection == "all") {
            Post.find({}, (err, result) => {
                if (err)
                    throw err;
                
                result.forEach(post => {
                    posts.push(post);
                });
                
                res.render("forum.ejs", { posts: posts, sections: sections, id: cookieUserId, getsection: getsection });
                
            });
        }
        else {
            Post.find({ section: getsection }, (err, result) => {
                if (err)
                    throw err;

                let nrComments;

                result.forEach(post => {
                    posts.push(post);
                    vote = (post.likedBy.length - post.dislikedBy.length);
                    
                    Comment.find({ post: post._id }, (err, doc) => {
                        if (err)
                            throw err;
                        nrComments = doc.length;
                    });
                });

                res.render("forum.ejs", { posts: posts, sections: sections, id: cookieUserId, getsection: getsection, nrComments: nrComments });
            });
        }

    });
});

route.get("/account", (req, res) => {
    let id = req.cookies.id;
    if (id)
        User.findOne({ _id: id }, (err, user) => {
            if (err)
                throw err;
            else res.render("account.ejs", { user: user });
        });    

    else res.render("login.ejs");
});

route.get("/get-post/:post", (req, res) => {
    const postID = require("../routes/comment_api").postID;

    
    Post.findOne({ _id: postID }, (err, doc) => {
        if (err)
            throw err;
        let post = {};
        
        post = doc;

        const comments = [];
        Comment.find({ post: postID }, (err, allcomments) => {
            if (err)
                throw err;
            allcomments.forEach(comment => {
                comments.push(comment);
            });
                
            res.render("post.ejs", { comments: comments, post: post, id: req.cookies.id});
            
        });
    });

    
});

module.exports = route;