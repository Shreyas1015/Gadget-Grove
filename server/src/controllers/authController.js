require("dotenv").config();
const asyncHand = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateSecretKey = require("../utils/generateSecretKey");
const pool = require("../config/dbConfig");
const generateRefreshToken = require("../utils/generateRefreshToken");
const { verifyRefreshToken } = require("../middlewares/authMiddleware");

const secretKey = process.env.DB_SECRET_KEY || generateSecretKey();
console.log("SecretKey :", secretKey);

const login = asyncHand((req, res) => {
  const formData = req.body;
  const searchQuery = "SELECT * FROM users WHERE email = $1";

  try {
    pool.query(searchQuery, [formData.email], async (err, results) => {
      if (err) {
        console.error("Error running the query: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = results.rows[0];

      if (!user || !user.password) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }

      const isPasswordValid = await bcrypt.compare(
        formData.password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }

      const { uid, email, user_type } = user;

      const token = jwt.sign({ email }, secretKey, { expiresIn: "10h" });
      const refreshToken = generateRefreshToken(email);

      console.log("Generated Token:", token);
      console.log("Refresh Token:", refreshToken);

      res.cookie("token", token, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      res.status(200).json({
        message: "Logged in successfully",
        email,
        uid,
        user_type,
        isLogin: true,
      });
    });
  } catch (error) {
    console.error("Error running the query: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const refresh = asyncHand((req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) return res.sendStatus(401);

  const user = verifyRefreshToken(refreshToken);
  if (!user) return res.sendStatus(403);

  console.log("Received Refresh Token:", refreshToken);

  const token = jwt.sign(user, secretKey, { expiresIn: "10h" });
  const newRefreshToken = generateRefreshToken(user.email);

  console.log("New Access Token:", token);
  console.log("New Refresh Token:", newRefreshToken);

  res.cookie("token", token, { httpOnly: true });
  res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
  res.sendStatus(200);
});

const handleUserExists = (res) => {
  return res.status(400).json({ error: "User already exists" });
};

const handleServerError = (res, errMessage) => {
  console.error(errMessage);
  return res.status(500).json({ error: "Internal Server Error" });
};

const handleSuccess = (res, message) => {
  console.log(message);
  return res.status(200).json({ message });
};

const signUp = asyncHand(async (req, res) => {
  const formData = req.body;

  console.log("Form Data:", formData);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const passwordIsValid = passwordRegex.test(formData.password);
  console.log("Password is valid:", passwordIsValid);

  if (!passwordIsValid) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long and contain at least one lowercase letter, one special character, one uppercase letter, and one number",
    });
  }

  try {
    const searchQuery = "SELECT * FROM users WHERE email = $1";

    const result = await pool.query(searchQuery, [formData.email]);

    if (result.rows.length > 0) {
      return handleUserExists(res);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

    const insertQuery =
      "INSERT INTO users (email, password, user_type) VALUES ($1, $2, 2)";

    await pool.query(insertQuery, [formData.email, hashedPassword]);

    return handleSuccess(res, "User Registered Successfully");
  } catch (error) {
    return handleServerError(res, "Error inserting data: " + error);
  }
});

const logout = asyncHand((req, res) => {
  res.clearCookie("token", { httpOnly: true });
  res.clearCookie("refreshToken", { httpOnly: true });

  res.status(200).json({ message: "Logout successful" });
});

const imageAuthenticator = asyncHand((req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    console.log("Authentication Parameters:", authenticationParameters);
    res.json(authenticationParameters);
  } catch (error) {
    console.error("Error generating authentication parameters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = {
  login,
  signUp,
  refresh,
  logout,
  imageAuthenticator,
};
