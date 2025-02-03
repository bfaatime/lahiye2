const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute"); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 8080;


mongoose.connect(DB_URL)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));


const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    req.user = user; 
    next();
  });
};


app.use("/api/auth", userRouter);


app.use("/api/clothes", authenticateToken, productRouter); 


app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});
