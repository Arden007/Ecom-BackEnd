const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.Sec_Key
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.patch("/login", async (req, res) => {
 console.log(username);
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong Credentials!");

    const hasPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.Sec_Key
    );
    const OriginalPassword = hasPassword.toString(CryptoJS.enc.Utf8);

    OriginalPassword !== req.body.password &&
      res.status(401).json("Wrong Credentials!");
    // we gonna create an accessToken that will check if our user is an admin or if what they want to edit belongs to them
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      //   the token will expire after 3 days and the user will have to login again
      { expiresIn: "3d" }
    );

    // I will be using a spread operator to prevent the user password from displaying
    const { password, ...others } = user._doc;
    // mongoDB stores our data in a _doc file so to show only the info we want and not the path in which its stored, to do this just add _doc to user
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
