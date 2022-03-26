const Cart = require("../models/Cart");
const {
  verifyToken,
  authorizationToken,
  adminToken,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", authorizationToken, async (req, res) => {
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
router.delete("/:id", authorizationToken, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.send(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER CART
router.get("/find/:userId", async (req, res) => {
  try {
    //   my condition here is my userId as each user only has one Cart , why i used findOne method
    const cart = await Cart.findOne({userId: req.params.userId});
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET All USER CARTS
router.get("/", adminToken, async (req, res) => {
    try {
        const carts = await Cart.find() 
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
