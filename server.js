const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");

// api files
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

//Body Parser Middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//DB config
const db = require("./config/keys").mongoURI;

//connect to Mongoose
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello utkarhs home to backchodi"));

// use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
