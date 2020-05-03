const express = require("express");
const route = express.Router();

const bcrypt = require('bcrypt');

const User = require("../Schimas/user_schema");
const Post = require("../Schimas/post_schema");
const Section = require("../Schimas/section_schema");
const Comment = require("../Schimas/comment_schema");
const mongoose = require("mongoose");

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/profilePicture/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

route.post("/sign-up", (req, res) => {
  if (req.body.password !== req.body.cpassword)
    res.json("Passwords don't match");
  else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          return res.json({
            message: "Mail exists"
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) 
              throw err;
            const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            username: req.body.username,
            password: hash
            });

            user.save().then(result => {
                res.cookie("id", result._id, { maxAge: 100000 }).redirect("/en/account");
            });
          });
        }
      });
    }
});

route.post("/log-in", (req, res) => {
  User.findOne({ email: req.body.email_ })
  .then(user => {
    if (user.email.length < 1) {
      return res.json({
        message: "Email doest exist"
      });
    }
    bcrypt.compare(req.body.password_, user.password, (err, result) => {
      if (err) {
        return res.json({
          message: "Auth failed"
        });
      }
      if (result) {
        
        res.cookie("id", user.id, { maxAge: 86400000 });
        res.redirect("/en/account");

      }
      else res.json({ message: "Auth failed" });
    });
  })
  .catch(err => {
    console.log(err);
    res.json({
      error: err
    });
  });
});

route.post("/edit-user", upload.single("profilePicture"), (req, res) => {
    User.findOne({ _id: req.cookies.id }, (err, user) => {
        if (err)
            throw err;
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err)
                throw err;
            if (result) {
                if (req.body.username)
                    User.findOneAndUpdate({ _id: req.cookies.id }, { username: req.body.username }, (err, doc) => {
                      Comment.updateMany({ authorId: req.cookies.id }, { author: doc.username }, (err, commentFound) => {});
                    });

                if (req.body.email)
                    User.findOneAndUpdate({ _id: req.cookies.id }, { email: req.body.email }, (err, doc) => {});

                if (req.body.npassword)
                    bcrypt.hash(req.body.npassword, 10, (err, hash) => {
                        if (err) 
                            throw err;
                        User.findOneAndUpdate({ _id: req.cookies.id }, { password: hash }, (err, doc) => {});
                    });
                
                if (req.file || req.file.path)
                    User.findByIdAndUpdate({ _id: req.cookies.id }, { image: req.file.path }, (err, doc) => {
                      Comment.updateMany({ authorId: req.cookies.id }, { profilePicture: req.file.path }, (err, commentFound) => {});
                    });

                res.redirect("/en/account");
            } 
            else res.json("Password incorect");
        });
    });
});

route.get("/log-out", (req, res) => {
  res.clearCookie("id");
  res.redirect("/en/account");
});

route.get("/delete-user", (req, res) => {
  let id = req.cookies.id;
  res.clearCookie("id");

  User.deleteOne({ _id: id }, (err) => {
    if (err)
      throw err;
  });

  Post.deleteOne({ author: id }, (err) => {
    if (err)
      throw err;
  });

  Section.deleteOne({ author: id }, (err) => {
    if (err)
      throw err;
  });

  Comment.deleteOne({ author: id }, (err) => {
    if (err)
      throw err;
  });
  
  res.redirect("/en/account");
});

module.exports = { route };