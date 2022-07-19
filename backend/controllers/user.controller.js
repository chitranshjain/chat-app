const asyncHandler = require("express-async-handler");
const User = require("../models/user.models");
const { generateToken } = require("../config/jwt");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, image } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("An user with this email already exists");
  }

  const user = await User.create({ name, email, password, image });

  if (user) {
    res.status(201).json({ data: { token: generateToken(user._id) } });
  } else {
    res.status(400);
    throw new Error("Failed to create the user.");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("No user with this email exists");
  } else {
    if ((await user.matchPassword(password, user.password)) === true) {
      res.status(201).json({
        data: {
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400);
      throw new Error("Incorrect password");
    }
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const query = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(query).find({ _id: { $ne: req.user._id } });

  res.status(200).json({
    message: "Users found",
    data: users.map((user) => user.toObject({ getters: true })),
  });
});

module.exports = { registerUser, loginUser, getAllUsers };
