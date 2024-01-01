<<<<<<< HEAD
const allowedOrigins = ["*"];
=======
const allowedOrigins = ["http://localhost:3000"];
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = corsOptions;
