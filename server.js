const express = require('express');
const helmet = require("helmet");
const server = express();

server.use(express.json());

server.use(logger);
server.use(helmet());

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

server.use(errorHandler);

function errorHandler ( req,res) {
  res.status(404).json({message: "Route not found"})
}

module.exports = server;
