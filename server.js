const express = require('express');

const server = express();

server.use(express.json());

server.use(logger);

const postRouter = require("./posts/postRouter.js")
const userRouter = require("./users/userRouter.js");

server.get('/', (req, res) => {
  res.send(`<h2>Welcome to Adrian Server!</h2>`);
});



server.use("/api/posts", postRouter);
server.use("/api/users", userRouter);

//custom middleware

function logger(req, res, next) {
  const date = new Date();
  console.log(`Method: ${req.method}, URL: ${req.url}, Date: ${date}`)
  next()
}

module.exports = server;
