require("dotenv").config();
const asyncHand = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateSecretKey = require("../utils/generateSecretKey");
const connection = require("../config/dbConfig");
<<<<<<< HEAD
const generateRefreshToken = require("../utils/generateRefreshToken");
const { verifyRefreshToken } = require("../middlewares/authMiddleware");

const secretKey = process.env.DB_SECRET_KEY || generateSecretKey();
console.log("SecretKey :", secretKey);

const login = asyncHand((req, res) => {
  const { email, password } = req.body;
  const searchQuery = "SELECT * from users where email = ?";

=======

const secretKey = process.env.JWT_SECRET || generateSecretKey();
console.log("SecretKey :", secretKey);
// Login Form
const login = asyncHand((req, res) => {
  const { email, password } = req.body;
  const searchQuery = "SELECT * from users where email = ?";
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
  try {
    connection.query(searchQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error running the query : ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
<<<<<<< HEAD

=======
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      } else {
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid Credentials" });
        }

        const uid = user.uid;
        const email = user.email;
        const user_type = user.user_type;

<<<<<<< HEAD
        const token = jwt.sign({ email: email }, secretKey, {
          expiresIn: "1h",
        });

        console.log("Generated Token:", token);

        const refreshToken = generateRefreshToken(email);

        console.log("Refresh Token:", refreshToken);

        res.cookie("token", token, {
          httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        res.status(200).json({
          message: "Logged in successfully",
=======
        const token = jwt.sign(
          {
            email: email,
          },
          secretKey,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          message: "Logged in successfully",
          token: token,
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
          email: email,
          uid: uid,
          user_type: user_type,
        });
      }
    });
  } catch (error) {
    console.error("Error running the query : ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

<<<<<<< HEAD
const refresh = asyncHand((req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) return res.sendStatus(401);

  const user = verifyRefreshToken(refreshToken);
  if (!user) return res.sendStatus(403);

  console.log("Received Refresh Token:", refreshToken);

  const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
  const newRefreshToken = generateRefreshToken(user.email);

  console.log("New Access Token:", token);
  console.log("New Refresh Token:", newRefreshToken);

  res.cookie("token", token, { httpOnly: true });
  res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
  res.sendStatus(200);
});

=======
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
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

<<<<<<< HEAD
=======
  // Check password complexity
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
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
    const searchQuery = "SELECT * FROM users WHERE email = ?";

    connection.query(searchQuery, [formData.email], async (err, result) => {
      if (err) {
        return handleServerError(res, "Error running the query: " + err);
      }

      if (result.length > 0) {
        return handleUserExists(res);
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

      const insertQuery =
        "INSERT INTO users (email, password, user_type) VALUES (?, ?, 2)";
      connection.query(
        insertQuery,
        [formData.email, hashedPassword],
        (err, result) => {
          if (err) {
            return handleServerError(res, "Error inserting data: " + err);
          } else {
            return handleSuccess(res, "User Registered Successfully");
          }
        }
      );
    });
  } catch (error) {
    return handleServerError(res, "Error inserting data: " + error);
  }
});

module.exports = {
  login,
  signUp,
<<<<<<< HEAD
  refresh,
=======
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
};
