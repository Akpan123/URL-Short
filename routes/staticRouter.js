const express = require("express");

const URL = require("../models/url");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    if(!req.user) return res.redirect('/login');
    const allurls = await URL.find({createdBy: req.user._id});
    return res.render("home", {
      urls: allurls,
    });
  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    res.status(500).send("An error occurred while fetching URLs.");
  }
});

router.get("/signup",(req,res) => {
  return res.render("signup");
});

router.get("/login",(req,res) => {
  return res.render("login");
});


module.exports = router;

