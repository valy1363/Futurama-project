const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.set("view engine", "ejs");

app.set("views", __dirname + "/pages");

app.use("/uploads", express.static("uploads"));

/* Database */

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://valentin:abcd1234@cluster0-fsimv.mongodb.net/test?retryWrites=true&w=majority" || process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

const user_api = require("./api/routes/user_api").route;
app.use("/user_api", user_api);

const section_api = require("./api/routes/section_api").route;
app.use("/section_api", section_api);

const post_api = require("./api/routes/post_api").route;
app.use("/post_api", post_api);

const comment_api = require("./api/routes/comment_api").route;
app.use("/comment_api", comment_api);

/* Router */

const router = require("./api/routes/router");

app.use("/", router);
app.use("/static", express.static(__dirname + "/static"));
app.listen(process.env.PORT || 3000);