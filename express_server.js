const express = require("express");
const app = express();
const PORT = 3002;

const urlDattabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDattabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});