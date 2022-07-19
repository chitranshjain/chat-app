const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat.models");
const User = require("../models/user.models");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new Error("userId param not sent with the request");
    res.sendStatus(400);
  }

  var chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.user._id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chat = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "name image email",
  });

  if (chat.length > 0) {
    res
      .status(200)
      .json({ message: "Chat found", chat: chat.toObject({ getters: true }) });
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json({
        message: "Chat created",
        chat: fullChat.toObject({ getters: true }),
      });
    } catch (error) {
      res.status(500).json({ message: "Error while creating chat" });
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name image email",
    });

    res.status(200).json({
      message: "Chats found",
      chats: chats.map((chat) => chat.toObject({ getters: true })),
    });
  } catch (error) {
    throw new Error("ERROR : " + error.message);
    res.status(500);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  console.log("Creating group chat");
  const { users, name } = req.body;

  console.log(`${JSON.stringify(users)}, ${JSON.stringify(name)}`);

  if (!users || !name) {
    res.status(400).json({ message: "Please enter all the fields" });
  }

  if (users.length < 2) {
    res
      .status(400)
      .json({ message: "Atleast 2 users are required to create a Group Chat" });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({
      message: "Group chat created successfully",
      chat: fullGroupChat.toObject({ getters: true }),
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `An error occurred. ERROR : ${error.message}` });
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, newGroupName } = req.body;

  if (!chatId || !newGroupName) {
    res.status(400).json({ message: "Please enter all the fields" });
  }

  try {
    await Chat.findByIdAndUpdate(chatId, { $set: { chatName: newGroupName } });
    const fullGroupChat = await Chat.findOne({ _id: chatId })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({
      message: "Group renamed successfully",
      chat: fullGroupChat.toObject({ getters: true }),
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `An error occurred. ERROR : ${error.message}` });
  }
});

const addToGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    res.status(400).json({ message: "Please enter all the fields" });
  }

  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({
      message: "User added successfully",
      chat: chat.toObject({ getters: true }),
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `An error occurred: ERROR : ${error.message}` });
  }
});

const removeFromGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    res.status(400).json({ message: "Please enter all the fields" });
  }

  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({
      message: "User removed successfully",
      chat: chat.toObject({ getters: true }),
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `An error occurred: ERROR : ${error.message}` });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroupChat,
  removeFromGroupChat,
};
