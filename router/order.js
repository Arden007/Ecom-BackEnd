const Order = require("../models/Order");
const {
  verifyToken,
  authorizationToken,
  adminToken,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", adminToken, async (req, res) => {
  try {
    //  findByIdAndUpdate is a MongoDB method , these methods makes it easy to perform CRUD operation
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        //    with this $set it takes what is passed in the body and updates the values
        $set: req.body,
        // but the above only sets the data if we want it to return the updatedUser we need set new to true
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {}
});

// DELETE
router.delete("/:id", adminToken, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.send(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER ORDERS
router.get("/find/:userId", authorizationToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET All
router.get("/", adminToken, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500);
  }
});

// GET MONTHLY INCOME
router.get("/income", adminToken, async (req, res) => {
  // here I will be doing a simliar stats method as i did with USER_STATS , only difference is i will be taking in the currentMonth, lastMonth and previousMonth  income to compare them  
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
//   now that the Data has been set we can use a try and catch to aggregate the data
try {
  const income = await Order.aggregate([
    //   to aggregate my data i will be creting a condition that will be set to geater than previousMonth which has been declared above, bassically it will be just 2 month
    { $match: { createdAt: { $gte: previousMonth } } },
    {
      $project: {
        month: { $month: "$createdAt" },
        // amount we are fetch from the orderSchema since $project allow us to create or use existing fields in the document
        sales: "$amount",
      },
    },
    // since i have the amount for each month i will group them and sum them
     {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ]);
  res.status(200).send(income );
} catch (err) {
    res.status(500).json(err)
} 
})

module.exports = router;
