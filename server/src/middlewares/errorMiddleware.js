const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
<<<<<<< HEAD
    error: "OutLook Internal Server Error",
=======
    error: "Internal Server Error",
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
  });
};

module.exports = errorMiddleware;
