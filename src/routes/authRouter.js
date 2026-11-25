const express = require("express");
const { signup, login, logout, myProfile, authenticate } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authenticate, myProfile);
router.post("/logout", logout);

module.exports = router;
