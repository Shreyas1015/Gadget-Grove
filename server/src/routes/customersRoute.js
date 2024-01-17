const express = require("express");
const {
  subscribers,
  fetchHeadphonesData,
  fetchParticularProductData,
  addToCart,
  fetchAllProductsInCart,
  fetchTotalNumberOfCartItems,
  cancelProduct,
  fetchWishlistedProducts,
  toggleWishlist,
  fetchWishlistedProductData,
  fetchEarpodsData,
  fetchGamingData,
  fetchLaptopsData,
  fetchOculusData,
  fetchSpeakersData,
  fetchWatchesData,
  createCheckoutSession,
  handlePaymentSuccess,
} = require("../controllers/customersController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/fetchHeadphonesData", authenticateToken, fetchHeadphonesData);
router.post("/addToCart", authenticateToken, addToCart);
router.post(
  "/fetchWishlistedProducts",
  authenticateToken,
  fetchWishlistedProducts
);
router.post("/toggleWishlist", authenticateToken, toggleWishlist);
router.delete("/cancelProduct", authenticateToken, cancelProduct);
router.post(
  "/fetchTotalNumberOfCartItems",
  authenticateToken,
  fetchTotalNumberOfCartItems
);
router.post(
  "/fetchAllProductsInCart",
  authenticateToken,
  fetchAllProductsInCart
);
router.post(
  "/fetchWishlistedProductData",
  authenticateToken,
  fetchWishlistedProductData
);
router.post(
  "/fetchParticularProductData/:ap_id",
  authenticateToken,
  fetchParticularProductData
);
router.post("/fetchEarpodsData", authenticateToken, fetchEarpodsData);
router.post("/fetchGamingData", authenticateToken, fetchGamingData);
router.post("/fetchLaptopsData", authenticateToken, fetchLaptopsData);
router.post("/fetchOculusData", authenticateToken, fetchOculusData);
router.post("/fetchSpeakersData", authenticateToken, fetchSpeakersData);
router.post("/fetchWatchesData", authenticateToken, fetchWatchesData);
router.post(
  "/create-checkout-session",
  authenticateToken,
  createCheckoutSession
);
router.post("/success", authenticateToken, handlePaymentSuccess);
router.post("/subscribers", subscribers);
module.exports = router;
