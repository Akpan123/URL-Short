const { handleUserSignup, handleUserLogin } = require("../controllers/user");
const express = require('express')

const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

module.exports = router;

