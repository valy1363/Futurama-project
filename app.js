const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.set("view engine", "ejs");

app.set("views", __dirname + "/en");

app.use("/uploads", express.static("uploads"));

/* Database */

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://valentin:<password>@cluster0-fsimv.mongodb.net/<dbname>?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
console.log(process.env.MONGODB_URI);

const user_api = require("./api/routes/user_api").route;
app.use("/user_api", user_api);

const section_api = require("./api/routes/section_api").route;
app.use("/section_api", section_api);

const post_api = require("./api/routes/post_api").route;
app.use("/post_api", post_api);

const comment_api = require("./api/routes/comment_api").route;
app.use("/comment_api", comment_api);

/* Router */

const en_route = require("./api/routes/en_route");


app.get("/get-en", (req, res) => {
    app.set("views", __dirname + "/en");
    const page = req.query.page;
    if (page != undefined)
        res.redirect(`/${page}`);
    else res.redirect(`/`);
});

app.get("/get-ro", (req, res) => {
    app.set("views", __dirname + "/ro");
    const page = req.query.page;
    if (page != undefined)
        res.redirect(`/${page}`);
    else res.redirect(`/`);
});

app.use("/", en_route);
app.use("/static", express.static(__dirname + "/static"));
app.listen(process.env.PORT || 3000);