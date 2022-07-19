const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/error.middlewares");

// Routes
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");

connectDB();
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running successfully.");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// app.get("/chats", (req, res) => {
//   res.send(chats);
// });

// app.get("/chat/:id", (req, res) => {
//   const chatId = req.params.id;
//   const result = chats.find((c) => c._id == chatId);
//   res.send(result);
// });

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
