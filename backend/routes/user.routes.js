const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", protect, getAllUsers);

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
