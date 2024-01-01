require("dotenv").config();
const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
const authRoutes = require("./src/routes/authRoute");
const cookieParser = require("cookie-parser");
=======
const corsOptions = require("./src/middlewares/corsMiddleware");
const authRoutes = require("./src/routes/authRoute");
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
const errorMiddleware = require("./src/middlewares/errorMiddleware");
const PORT = 5000;

const app = express();

//MiddleWare
app.use(express.json());
<<<<<<< HEAD
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/auth", authRoutes);

=======
app.use(cors(corsOptions));

app.use("/auth", authRoutes);

// This MiddleWare Should be at the Bottom, After All Routes
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
