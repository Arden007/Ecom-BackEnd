const Product = require("../models/Product");
const {
  verifyToken,
  authorizationToken,
  adminToken,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/",  async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id",  async (req, res) => {
  try {
    //  findByIdAndUpdate is a MongoDB method , these methods makes it easy to perform CRUD operation
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        //    with this $set it takes what is passed in the body and updates the values
        $set: req.body,
        // but the above only sets the data if we want it to return the updatedUser we need set new to true
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {}
});

// DELETE
router.delete("/:id",  async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET All PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;




 