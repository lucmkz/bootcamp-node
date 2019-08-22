const express = require("express");

const server = express();

server.use(express.json());

const users = ["Lucas", "Duarte", "Santos", "Dos"];

server.use((req, res, next) => {
  console.time("req");

  console.log(`Método: ${req.method}; URL ${req.url}`);

  next();

  console.timeEnd("req");
});
function checkUserExistis(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ Error: "User not found o request body" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ Error: "User does not exists" });
  }

  req.user = user;

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post("/users", checkUserExistis, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserExistis, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
