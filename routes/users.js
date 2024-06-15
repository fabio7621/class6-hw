const express = require("express");
const { isAuth } = require("../service/auth");
const { signUp, signIn, getProfile, updatePassword, updateProfile } = require("../controllers/userCon.js");
const router = express.Router();

router.post("/sign_up", signUp);
router.post("/sign_in", signIn);
router.get("/profile", isAuth, getProfile);
router.post("/updatePassword", isAuth, updatePassword);
router.patch("/updateProfile", isAuth, updateProfile);

module.exports = router;
