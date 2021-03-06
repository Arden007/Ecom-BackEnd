const express = require("express");
const Cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./router/user");
const authRouter = require("./router/auth");
const productRouter = require("./router/product");
const orderRouter = require("./router/order");

dotenv.config();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection established"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(Cors());
// USER
app.use("/user", userRouter);
// AUTH
app.use("/auth", authRouter);
// PRODUCT
app.use("/product", productRouter);

// Order
app.use("/order", orderRouter);

app.listen(process.env.PORT || 0808, () => {
  console.log("Backend Server is running!");
});
