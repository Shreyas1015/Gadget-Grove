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
  "/fetchParticularProductData/:ap_id",
  authenticateToken,
  fetchParticularProductData
);
router.post("/subscribers", subscribers);
module.exports = router;
