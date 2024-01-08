const express = require("express");
const {
  subscribers,
  fetchHeadphonesData,
  fetchParticularHeadphoneData,
} = require("../controllers/customersController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/fetchHeadphonesData", authenticateToken, fetchHeadphonesData);
router.post(
  "/fetchParticularHeadphoneData/:ap_id",
  authenticateToken,
  fetchParticularHeadphoneData
);
router.post("/subscribers", subscribers);
module.exports = router;
