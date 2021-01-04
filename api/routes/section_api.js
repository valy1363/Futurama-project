const express = require("express");
const route = express.Router();

const Section = require("../Schimas/section_schema");
const Post = require("../Schimas/post_schema");


route.post("/en/create-section", (req, res) => {
    if (req.cookies.id != undefined) {
        let section = new Section({
            title: req.body.section,
            author: req.cookies.id
        });

        section.save().then(() => {
            res.redirect("/en/forum");
        });
    }
    else {
        res.send('<p>Cannot create a section without an account</p><input type="button" value="Back" onclick="history.back()">');
    }
});

route.post("/ro/create-section", (req, res) => {
    if (req.cookies.id != undefined) {
        let section = new Section({
            title: req.body.section,
            author: req.cookies.id
        });

        section.save().then(() => {
            res.redirect("/ro/forum");
        });
    }
    else {
        res.send('<p>Nu poti creea o sectiune fara cont</p><input type="button" value="Back" onclick="history.back()">');
    }
});

route.get("/en/get-section", (req, res) => {
    let section = req.query.section;
    module.exports = { section };
    res.redirect("/en/forum");
});

route.get("/ro/get-section", (req, res) => {
    let section = req.query.section;
    module.exports = { section };
    res.redirect("/ro/forum");
});

route.get("/en/delete-section", (req, res) => {
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

route.get("/ro/delete-section", (req, res) => {
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

            res.redirect("/ro/forum");
        }
    });
});

module.exports = { route };