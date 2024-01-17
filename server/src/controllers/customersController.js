require("dotenv").config();
const asyncHand = require("express-async-handler");
const pool = require("../config/dbConfig");
const ImageKit = require("imagekit");
const { authenticateUser } = require("../middlewares/authMiddleware");
const stripe = require("stripe")(
  "sk_test_51NR99USFBsMizJtqgugjwCzWBEka7nr355hR294tm3VNMVUxrz0YoIq1PY89wStYr0Fd6lAx1pP5xfp7LxdKELnl008ahGLLka"
);

const imagekit = new ImageKit({
  publicKey: "public_ytabO1+xt+yMhICKtVeVGbWi/u8=",
  privateKey: "private_b65RyEF/ud3utxYKAJ8mvx7BWSw=",
  urlEndpoint: "https://ik.imagekit.io/TriptoServices",
});

const subscribers = asyncHand((req, res) => {
  const formData = req.body;
  const searchQuery = "SELECT * from subscribers where email = $1";
  try {
    pool.query(searchQuery, [formData.email], (err, result) => {
      if (err) {
        console.error("Error running the query: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.rows.length > 0) {
        return res
          .status(401)
          .json({ error: "Already Subscribed with this mail" });
      } else {
        const query = "INSERT INTO subscribers (email) VALUES ( $1 )";
        pool.query(query, [formData.email], (err, result) => {
          if (err) {
            console.error("Internal Server Error : ", err);
            res.status(500).json({ error: "Internal Server error" });
          } else {
            res.status(200).json({ message: "Subscribed" });
          }
        });
      }
    });
  } catch (error) {
    console.error("Error Running this Function : ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const fetchHeadphonesData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select * from all_products_data where product_id = 1 ";
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Failed to execute ${query}`, err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const fetchParticularProductData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const ap_id = req.params.ap_id;
    const searchQuery = "select * from all_products_data where ap_id = $1";
    pool.query(searchQuery, [ap_id], (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log(result.rows[0]);
        res.status(200).json(result.rows[0]);
      }
    });
  });
});

const addToCart = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const selectedProduct = req.body.selectedProduct;
    const authenticatedUserID = req.uid;

    const quantity = selectedProduct.quantity;
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    try {
      const searchQuery =
        "SELECT COUNT(*), MAX(isordered) as maxIsOrdered FROM shopping_cart WHERE ap_id = $1 AND uid = $2";
      pool.query(
        searchQuery,
        [selectedProduct.ap_id, authenticatedUserID],
        (err, result) => {
          if (err) {
            console.error("Internal Server error : ", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          const isInCart = result.rows[0].count > 0;
          const maxIsOrdered = result.rows[0].maxIsOrdered;

          if (!isInCart || maxIsOrdered !== 0) {
            // If not in cart or already ordered, insert a new record
            const insertQuery = `
            INSERT INTO shopping_cart (uid, ap_id, quantity)
            VALUES ($1, $2, $3)`;
            pool.query(
              insertQuery,
              [authenticatedUserID, selectedProduct.ap_id, quantity],
              (err, result) => {
                if (err) {
                  console.error("Internal Server Error : ", err);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }
                return res.status(201).json({ message: "Added To Cart" });
              }
            );
          } else {
            // If in cart and not ordered, update the quantity
            const updateQuantityQuery = `
            UPDATE shopping_cart
            SET quantity = quantity + $1
            WHERE uid = $2 AND ap_id = $3`;
            pool.query(
              updateQuantityQuery,
              [quantity, authenticatedUserID, selectedProduct.ap_id],
              (err, result) => {
                if (err) {
                  console.error("Internal Server Error : ", err);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }
                // Return updated cart data
                return res.status(200).json({ message: "Added To Cart" });
              }
            );
          }
        }
      );
    } catch (error) {
      console.log(`Error in addToCart: ${error}`);
      return res.status(400).json({ error: "Bad Request" });
    }
  });
});

const fetchAllProductsInCart = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const authenticatedUserID = req.uid;
    const query =
      "SELECT shopping_cart.cid, shopping_cart.ap_id AS cart_ap_id, shopping_cart.isordered, shopping_cart.uid, shopping_cart.quantity, all_products_data.ap_id AS product_ap_id, all_products_data.cover_img, all_products_data.title, all_products_data.brand, all_products_data.price, all_products_data.description, all_products_data.category_id, all_products_data.ratings, all_products_data.availability, all_products_data.coloroptions, all_products_data.discounts, all_products_data.shipping, all_products_data.product_id FROM shopping_cart INNER JOIN all_products_data ON shopping_cart.ap_id = all_products_data.ap_id where shopping_cart.uid = $1 and isOrdered = 0";
    pool.query(query, [authenticatedUserID], (err, results) => {
      if (err) {
        console.error("Server Error : ", err);
        res.status(500).json({ error: "Internal Server Error " });
      } else {
        res.status(200).json(results.rows);
      }
    });
  });
});

const fetchTotalNumberOfCartItems = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const authenticatedUserID = req.uid;
    const totalItemsQuery =
      "select * from shopping_cart where isordered = 0 and uid = $1";
    pool.query(totalItemsQuery, [authenticatedUserID], (err, result) => {
      if (err) {
        console.error("Server Error : ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        return res.status(200).json(result.rowCount);
      }
    });
  });
});

const cancelProduct = asyncHand((req, res) => {
  console.log(req.query);
  authenticateUser(req, res, () => {
    const apID = req.query.cart_ap_id;

    const query = "DELETE FROM shopping_cart WHERE ap_id = $1";
    pool.query(query, [apID], (err, result) => {
      if (err) {
        console.log(`Error in deleting product from cart ${err}`);
        return res
          .status(409)
          .json({ error: "Error in deleting product from cart" });
      }
      return res.status(204).send();
    });
  });
});

const toggleWishlist = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, ap_id } = req.body;
    const checkWishlistQuery =
      "SELECT * FROM wishlisted_products WHERE uid = $1 AND ap_id = $2";
    pool.query(checkWishlistQuery, [decryptedUID, ap_id], (err, result) => {
      if (err) {
        console.error("Database Error: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.rows.length > 0) {
        const currentWishlistStatus = result.rows[0].iswishlisted;
        const updatedWishlistStatus = currentWishlistStatus === 1 ? 0 : 1;
        console.log("currentWishlistStatus : ", currentWishlistStatus);
        const updateWishlistQuery =
          "UPDATE wishlisted_products SET iswishlisted = $1 WHERE uid = $2 AND ap_id = $3";
        pool.query(
          updateWishlistQuery,
          [updatedWishlistStatus, decryptedUID, ap_id],
          (err, result) => {
            if (err) {
              console.error("Database Error: ", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            console.log("Updated : ", result);
            return res
              .status(200)
              .json({ message: "Wishlist status updated successfully" });
          }
        );
      } else {
        const insertWishlistQuery =
          "INSERT INTO wishlisted_products (uid, ap_id, iswishlisted) VALUES ($1, $2, $3)";
        pool.query(
          insertWishlistQuery,
          [decryptedUID, ap_id, 1],
          (err, result) => {
            if (err) {
              console.error("Database Error: ", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            console.log("Inserted : ", result);
            return res
              .status(200)
              .json({ message: "Product added to wishlist successfully" });
          }
        );
      }
    });
  });
});

const fetchWishlistedProducts = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    try {
      const { decryptedUID } = req.body;
      const fetchWishlistedDataQuery =
        "SELECT * FROM wishlisted_products WHERE uid = $1 ORDER BY wid ASC ";
      const result = await pool.query(fetchWishlistedDataQuery, [decryptedUID]);
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Database Error: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

const fetchWishlistedProductData = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    try {
      const { decryptedUID } = req.body;
      const fetchWishlistedDataQuery =
        "SELECT * FROM all_products_data AS a JOIN wishlisted_products AS w ON a.ap_id = w.ap_id LEFT JOIN shopping_cart AS s ON a.ap_id = s.ap_id WHERE w.uid = $1 AND w.iswishlisted = 1 AND (s.isordered IS NULL OR s.isordered = 0)";
      const result = await pool.query(fetchWishlistedDataQuery, [decryptedUID]);
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Database Error: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

const fetchEarpodsData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select * from all_products_data where product_id = 2";
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Failed to execute ${query}`, err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const fetchGamingData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select * from all_products_data where product_id = 3";
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Failed to execute ${query}`, err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const fetchLaptopsData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select * from all_products_data where product_id = 4";
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Failed to execute ${query}`, err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const fetchOculusData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select * from all_products_data where product_id = 5";
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Failed to execute ${query}`, err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const fetchSpeakersData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select * from all_products_data where product_id = 6";
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Failed to execute ${query}`, err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const fetchWatchesData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select * from all_products_data where product_id = 7";
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Failed to execute ${query}`, err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const createCheckoutSession = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    const lineItems = req.body.lineItems;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:3000/cancel",
      });

      console.log(session);
      res.json({ id: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while creating the checkout session.",
      });
    }
  });
});

const handlePaymentSuccess = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    const { id, decryptedUID } = req.body;
    console.log("Received Checkout Session ID:", id);

    try {
      const session = await stripe.checkout.sessions.retrieve(id);

      if (session.payment_status === "paid") {
        console.log("Meta Data : ", decryptedUID);
        const updateQuery =
          "UPDATE shopping_cart SET isordered = 1 WHERE uid = $1 ";
        pool.query(updateQuery, [decryptedUID], (err, result) => {
          if (err) {
            console.error("Internal Server Error :", err);
            res.status(500).json({ error: "Payment was not successful." });
          } else {
            console.log("Cart Cleared");
            res.status(200).json({ status: "success" });
          }
        });
      } else {
        res.status(400).json({ error: "Payment was not successful." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the payment." });
    }
  });
});

module.exports = {
  subscribers,
  fetchHeadphonesData,
  fetchParticularProductData,
  addToCart,
  fetchAllProductsInCart,
  fetchTotalNumberOfCartItems,
  cancelProduct,
  toggleWishlist,
  fetchWishlistedProducts,
  fetchWishlistedProductData,
  fetchEarpodsData,
  fetchGamingData,
  fetchLaptopsData,
  fetchWatchesData,
  fetchSpeakersData,
  fetchOculusData,
  createCheckoutSession,
  handlePaymentSuccess,
};
