require("dotenv").config();
const jwt = require("jsonwebtoken");
const connection = require("../config/dbConfig");
const generateSecretKey = require("../utils/generateSecretKey");
<<<<<<< HEAD
const generateRefreshSecretKey = require("../utils/generateRefreshSecretKey");

const secretKey = process.env.DB_SECRET_KEY || generateSecretKey();

const refreshSecretKey =
  process.env.REFRESH_SECRET_KEY || generateRefreshSecretKey();
console.log("refreshSecretKey :", refreshSecretKey);

const authenticateToken = (req, res, next) => {
  const token = req.cookies["token"];
=======

const secretKey = process.env.JWT_SECRET || generateSecretKey();
console.log("SecretKey :", secretKey);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
  console.log("Received Token:", token);

  if (!token) {
    console.log("Unauthorized: Token not provided");
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided" });
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.log("Forbidden: Invalid token");
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      } else {
        req.user = decoded;
        console.log("Decoded User :", decoded);
        connection.query(
<<<<<<< HEAD
          "SELECT * FROM users WHERE email = ?",
=======
          "SELECT u.uid, u.email, u.user_type, ap.admin_id, up.user_profile_id FROM users u LEFT JOIN admin_profile ap ON u.uid = ap.uid LEFT JOIN user_profile up ON u.uid = up.uid WHERE u.email = ? ; ",
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
          [req.user.email],
          (err, result) => {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ message: "Error fetching user data" });
<<<<<<< HEAD
            } else if (result.length === 0) {
              console.log("User not found in the database");
              return res
                .status(404)
                .json({ message: "User not found in the database" });
            } else {
              req.uid = result[0].uid;
              req.user_type = result[0].user_type;
              req.email = result[0].email;

              console.log("UID :", req.uid);
              console.log("USER_TYPE :", req.user_type);
              console.log("EMAIL :", req.email);
              next();
=======
            } else {
              req.uid = result[0].uid;
              req.user_type = result[0].user_type;
              req.admin_id = result[0].admin_id;
              req.user_profile_id = result[0].user_profile_id;
              console.log("UID :", req.uid);
              console.log("USER_TYPE :", req.user_type);
              console.log("ADMIN ID :", req.admin_id);
              console.log("USER PROFILE ID  :", req.user_profile_id);
              next(); 
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
            }
          }
        );
      }
    });
  }
<<<<<<< HEAD
};

const verifyRefreshToken = (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, refreshSecretKey);
    return { email: payload.email };
  } catch (err) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  verifyRefreshToken,
};
=======
}

module.exports = authenticateToken;
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
