const express = require("express");
const route = express.Router();

const User = require("../Schimas/user_schema");
const Section = require("../Schimas/section_schema");
const Post = require("../Schimas/post_schema");
const Comment = require("../Schimas/comment_schema");

route.get("/", (req, res) => {
    res.redirect("/en");
});

route.get("/en", (req, res) => {
    res.render("en_index.ejs");
});

route.get("/ro", (req, res) => {
    res.render("ro_index.ejs");
});

route.get("/en/forum", (req, res) => {
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
                
                res.render("en_forum.ejs", { posts: posts, sections: sections, id: cookieUserId, getsection: getsection });
                
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

                res.render("en_forum.ejs", { posts: posts, sections: sections, id: cookieUserId, getsection: getsection, nrComments: nrComments });
            });
        }

    });
});

route.get("/ro/forum", (req, res) => {
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
                
                res.render("ro_forum.ejs", { posts: posts, sections: sections, id: cookieUserId, getsection: getsection });
                
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

                res.render("ro_forum.ejs", { posts: posts, sections: sections, id: cookieUserId, getsection: getsection, nrComments: nrComments });
            });
        }

    });
});

route.get("/en/account", (req, res) => {
    let id = req.cookies.id;
    if (id)
        User.findOne({ _id: id }, (err, user) => {
            if (err)
                throw err;
            else res.render("en_account.ejs", { user: user });
        });    

    else res.render("en_login.ejs");
});

route.get("/ro/account", (req, res) => {
    let id = req.cookies.id;
    if (id)
        User.findOne({ _id: id }, (err, user) => {
            if (err)
                throw err;
            else res.render("ro_account.ejs", { user: user });
        });    

    else res.render("ro_login.ejs");
});

route.get("/en/get-post/:post", (req, res) => {
    const postID = require("./comment_api").postID;

    
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
                
            res.render("en_post.ejs", { comments: comments, post: post, id: req.cookies.id});
            
        });
    });
});

route.get("/ro/get-post/:post", (req, res) => {
    const postID = require("./comment_api").postID;

    
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
                
            res.render("ro_post.ejs", { comments: comments, post: post, id: req.cookies.id});
            
        });
    });
});

route.get("/en/game", (req, res) => {
    res.render("en_game.ejs");
});

route.get("/ro/game", (req, res) => {
    res.render("ro_game.ejs");
});

module.exports = route;