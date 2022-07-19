const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroupChat,
  removeFromGroupChat,
} = require("../controllers/chat.controller");
const router = express.Router();

router.get("/", protect, fetchChats);

router.post("/", protect, accessChat);
router.post("/group/create/", protect, createGroupChat);

router.patch("/group/rename/", protect, renameGroupChat);
router.patch("/group/add/", protect, addToGroupChat);
router.patch("/group/remove/", protect, removeFromGroupChat);

module.exports = router;
