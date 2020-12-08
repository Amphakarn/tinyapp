const express = require("express");
const app = express();
const PORT = 3002;
// Set ejs as the view engine
app.set("view engine", "ejs");

// The body-parser library will convert the request body from a Buffer into string that we can read.
// It will then add the data to the req(request) object under the key body.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// create the URL database object
let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// generate a random string to serve as our shortURL
const generateNewKey = () => {
  let newKey = "";
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let charsLength = chars.length;
  for (let i = 0; i < 6; i++) {
    newKey += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return newKey; // does it require return?
};

// create actions

// const showAllURLS = (urls) => {
//   return urls;
// };

// const showOneURL = (urls, key) => {
//   if(urls[key]) {
//     return urls[key];
//   } else {
//     return null;
//   }
// };

// const addOneURL = (urls, newURL) => {
//   urls[newKey()] = newURL;
// }

// const removeURL = (urls, key) => {
//   delete url[key];
// };

// const editURL = (urls, key, newURL) => {
//   urls[key] = newURL;
// };

// GET method route
// use res.render to load up an ejs view file

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new")
});

app.get("/urls/:shortURL", (req, res) => {
  // Use the shortURL from the route parameter to lookup it's associated longURL from the urlDatabase
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {  
  const shortURL = generateNewKey();
  const longURL = req.body.longURL;
  // add generated short URL and long URL to database
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
  // console.log(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  console.log("This is the short URL: ", req.params.shortURL);
  res.redirect(longURL);
});

// // Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  // console.log("the database: ", urlDatabase);
  // console.log("the short URL (key): ", shortURL);
  // console.log("the long URL (value): ", urlDatabase[shortURL]);
  delete urlDatabase[shortURL];
  res.redirect("/urls");

})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});