const express = require("express");
const app = express();
const PORT = 3002;

// Set ejs as the view engine
app.set("view engine", "ejs");

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// The body-parser library will convert the request body from a Buffer into string that we can read.
// It will then add the data to the req(request) object under the key body.
const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));

// create the URL database object
let urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", shortURL: "b2xVn2", id: 1 },
  "9sm5xK": { longURL: "http://www.google.com", shortURL: "9sm5xK", id: 2 }
};

const users = {
  "1": {
    id: "1",
    email: "aa@example.com",
    password: "passwordA"
  },
  "2": {
    id: "2",
    email: "bb@example.com",
    password: "passwordB"
  }
}

// generate a random string to serve as our shortURL
const generateNewKey = () => {
  let newKey = "";
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charsLength = chars.length;
  for (let i = 0; i < 6; i++) {
    newKey += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return newKey; // does it require return?
};

// use res.render to load up an ejs view file
// Show the URLs and username
app.get("/urls", (req, res) => {
  const user = users[req.cookies.user_id]
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

// Show the create new URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Show the short URL associated to the long URL & edit URL
app.get("/urls/:shortURL", (req, res) => {
  // Use the shortURL from the route parameter to lookup it's associated longURL from the urlDatabase
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

// Redirect to the long URL associated to the short URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// Show registration page
app.get("/register", (req, res) => {
  const templateVars = { users };
  res.render("users_register", templateVars);
})

// Show login
app.get("/login", (req, res) => {
  const user = users[req.cookies.user_id]
  const templateVars = { user };
  res.render("users_login", templateVars);
})

// create a URL
app.post("/urls", (req, res) => {
  const shortURL = generateNewKey();
  const longURL = req.body.longURL;
  // add generated short URL and long URL to database
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  // console.log("the database: ", urlDatabase);
  // console.log("the short URL (key): ", shortURL);
  // console.log("the long URL (value): ", urlDatabase[shortURL]);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// Edit URL
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

// Create login & Cookies
app.post("/login", (req, res) => {
  // use email from req body to look up user object in DB
  const email = req.body.email;
  let user;
  for (let key in users) {
    if (email === users[key].email) {
      user = users[key];
    }
  }
  // assign user id property from user object to the cookie
  if (user) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.send("USER NOT FOUND!");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Create new registra
app.post("/register", (req, res) => {
  const newID = generateNewKey();
  const newEmail = req.body.email;
  const newPwd = req.body.password;
  if (!newEmail || !newPwd) {
    res.send("400 - Illegal Request!")
  } else if (isEmailExist(newEmail)) {
    res.send("400 - Illegal Request! \n Your account is in the system!")
  } else {
    users[newID] = { id: newID, email: newEmail, password: newPwd };
    res.cookie("user_id", newID);
    res.redirect("/urls");
    console.log(users);
  }
})

const isEmailExist = (newEmail) => {
  for (const key in users) {
    if (users[key].email === newEmail) {
      return true;
    }
  }
  return false;
};

// app.post("/login", (req, res) => {

// })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});