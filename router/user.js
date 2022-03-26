const User = require("../models/User");
const {
  verifyToken,
  authorizationToken,
  adminToken,
} = require("./verifyToken");

const router = require("express").Router();

// UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.Sec_Key
    ).toString();
  }
  try {
    //  findByIdAndUpdate is a MongoDB method , these methods makes it easy to perform CRUD operation
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        //    with this $set it takes what is passed in the body and updates the values
        $set: req.body,
        // but the above only sets the data if we want it to return the updatedUser we need set new to true
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {}
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({ others });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET All USERs
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER STATS(this will return total number of users register per month etc.)
router.get("/stats", async (req, res) => {
  // lets create a var for current date and last year
  const date = new Date();
  // to get lastYear we first create a date then we SET it to fullYear afterwards we GET fullYear , and finally we add a -1 to get lastYear to the current date
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  // after setting our var we can write out our function
  try {
    // to group the items I will be using mongoDB method Aggregate
    const data = await User.aggregate([
      // i will be creating a condition and $match will try to match this condition, take the createAt date and then set it to be greater than lastYear
      { $match: { createdAt: { $gte: lastYear } } },
      //now i will be taking the month number inside my createAt date , basically sortring it further
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      // now i will be grouping my users by thier Id and link it with month, and also get my total amount of users with the $sum method setting it to 1 it will return/sum all users
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Cart

// CREATE
router.post("/cart", async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/cart/:id", async (req, res) => {
  try {
    //  findByIdAndUpdate is a MongoDB method , these methods makes it easy to perform CRUD operation
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        //    with this $set it takes what is passed in the body and updates the values
        $set: req.body,
        // but the above only sets the data if we want it to return the updatedUser we need set new to true
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (error) {}
});

// DELETE
router.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.send(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER CART
router.get("/cart/:userId", async (req, res) => {
  try {
    //   my condition here is my userId as each user only has one Cart , why i used findOne method
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET All USER CARTS
router.get("/cart", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
    console.log(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
