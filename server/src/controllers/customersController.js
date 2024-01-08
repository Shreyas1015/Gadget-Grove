require("dotenv").config();

const asyncHand = require("express-async-handler");
const pool = require("../config/dbConfig");
const ImageKit = require("imagekit");
const { authenticateUser } = require("../middlewares/authMiddleware");

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

const fetchParticularHeadphoneData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const ap_id = req.params.ap_id;
    const searchQuery =
      "select * from all_products_data where product_id = 1 and ap_id = $1";
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

module.exports = {
  subscribers,
  fetchHeadphonesData,
  fetchParticularHeadphoneData,
};
