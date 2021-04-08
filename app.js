const express = require("express");
const app = express();
const redis = require("redis");
const session = require("express-session");
const bodyParser = require("body-parser");

let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    name: "eid",
    store: new RedisStore({ client: redisClient, disableTouch: true }),
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
      httpOnly: true,
      sameSite: "lax",
    },
    secret: "sadfdsfdsa",
    resave: false,
  })
);

app.get("/", (req, res) => {
  req.session.destroy();
  res.render("index.ejs");
});
app.post("/", (req, res) => {
  const id = req.body.id;
  if (id === "sahil") {
    req.session.user = id;
    res.redirect("/secret");
    console.log(req.session);
  } else {
    res.redirect("/");
  }
});
app.get("/secret", (req, res) => {
  if (req.session.user === "sahil") res.render("secret.ejs");
  else res.send("not authorized");
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
    console.log(req.session);
  });
});

app.listen(4000, () => {
  console.log("Started on localhost 4000");
});
