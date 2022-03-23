const express = require("express");
const Cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./router/user");
const authRouter = require("./router/auth");
const productRouter = require("./router/product");
const cartRouter = require("./router/cart");
const orderRouter = require("./router/order");

dotenv.config();

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
// Cart
app.use("/cart", cartRouter);
// Order
app.use("/order", orderRouter);

app.listen(process.env.PORT || 0808, () => {
  console.log("Backend Server is running!");
});
