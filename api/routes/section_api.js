const express = require("express");
const route = express.Router();

const Section = require("../Schimas/section_schema");
const Post = require("../Schimas/post_schema");
const Comment = require("../Schimas/comment_schema");


route.post("/create-section", (req, res) => {
    if (req.cookies.id != undefined) {
        let section = new Section({
            title: req.body.section,
            author: req.cookies.id
        });

        section.save().then(() => {
            res.redirect("/en/forum");
        });
    }
});

route.get("/get-section", (req, res) => {
    let section = req.query.section;
    module.exports = { section };
    res.redirect("/en/forum");

});

route.get("/delete-section", (req, res) => {
    Section.findOne({ title: req.query.section }).then(doc => {
        if (doc.author != req.cookies.id)
            res.json("Cannot delete if you are not the author of the section");
        else {
            Section.deleteOne({ title: req.query.section }, (err) => {
                if (err)
                    throw err;
                
            });
            Post.remove({ section: doc.title }, (err) => {
                if (err)
                  throw err;
            });

            res.redirect("/en/forum");
        }
    });
});

module.exports = { route };