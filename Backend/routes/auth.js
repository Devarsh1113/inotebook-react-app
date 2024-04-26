const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const router = express.Router();
const { query, body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "Devarshisagoodb$y";

//ROUTE-1: Create a User using:POST "/api/auth". DOes not require authentication.
router.post(
  "/createuser",
  [
    body("email", "Enter a Valid Email!").isEmail(),
    body("name", "Enter a Valid Name!").isLength({ min: 3 }),
    body("password", "Password must be atleast 5 letters!!").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors, returns Bad Request and the Errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with the same email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with this Email already Exists!!" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Create a New User!
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      //res.json(user)
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Error Occured!!");
    }
  }
);
//ROUTE-2:  Authenticate a User using POST "/api/auth/login".
router.post(
  "/login",
  [
    body("email", "Enter Your Valid Email Please!").isEmail(),
    body("password", "Password Cannot be Blank.").exists(),
  ],
  async (req, res) => {
     // Correct placement of this line
    // If there are errors, returns Bad Request and the Errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please Login with Correct Credentials!" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please Login with Correct Credentials!" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Error Occurred!!");
    }
  }
);
//ROUTE-3: GET LOGGED IN USER DETAILS USING POST "api/auth/getuser" Login Required!
router.post("/getuser",fetchuser,
  async (req, res) => {
try {
  const  userId = req.user.id;
    const user = await User.findById(userId).select("-password");
  res.send(user)
  
} catch (error) {
  console.error(error.message);
      res.status(500).send("Internal Error Occurred!!");
}
  })

module.exports = router;
