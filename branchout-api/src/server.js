require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = require("../models/app");
app.use(cors());
app.use(express.json());

const authRoutes = require("../routes/authRoute");
const userRoutes = require("../routes/userRouter");
const repoRoutes = require("../routes/repoRoutes");

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Middleware: Attach io to each request
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/repo", repoRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  try {
    console.log(`Server successfully running on ${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});