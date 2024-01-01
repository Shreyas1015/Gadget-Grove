const express = require("express");
<<<<<<< HEAD
const { login, signUp, refresh } = require("../controllers/authController");
const { forgetPass, resetPass } = require("../controllers/otpController");
const router = express.Router();

router.post("/login", login);
router.post("/signup", signUp);
router.post("/forget_password", forgetPass);
router.post("/reset_password", resetPass);
router.post("/refresh", refresh);
=======
const { login, signUp } = require("../controllers/authController");
const router = express.Router();


router.post("/login", login);
router.post("/signup", signUp);
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12

module.exports = router;
