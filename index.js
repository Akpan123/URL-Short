const express = require("express");
const { connectToMongoDB } = require("./connect");
const path = require("path");
const cookieparser = require("cookie-parser");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticrouter");
const userRoute= require("./routes/user");

const { accessSync } = require("fs");
const { restrictToLoggedinUserOnly, CheckAuth } = require("./middleware/auth");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDB Connected!")
);

app.set("view engine", "ejs");
app.set('views', path.resolve ("./views"));

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());


//Route
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", CheckAuth,staticRoute);

app.get("/url/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true } // Return the updated document
    );

    if (!entry) {
      // If no entry is found, send a 404 Not Found response
      return res.status(404).send("URL not found.");
    }

    // Redirect to the found entry's redirectURL
    res.redirect(entry.redirectURL);
  } catch (error) {
    // Handle any other errors that might occur
    res.status(500).send("An error occurred while processing your request.");
  }
});


app.listen(PORT, () => console.log(`Server started by Jarvis at port ${PORT}`));
