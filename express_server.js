const express = require("express");
const app = express();
const PORT = 3000;

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

const findUserByID = (id) => {
  for (const user in users) {
    if (users[user].id === id) {
      return users[user];
    }
  }
  return false;
};

const findUserByEmail = (email) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
};

const authenticateUser = (email, password) => {
  const foundUser = findUserByEmail(email);
  if (foundUser) {
    if (password === foundUser.password) {
      return foundUser;
    } else {
      return false;
    }
  }
  return false;
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
// Show the URLs and user_id
app.get("/urls", (req, res) => {
  const user = users[req.cookies.user_id]
  const templateVars = { urls: urlDatabase, user: findUserByID(req.cookies.user_id) };
  // console.log(findUserByID(req.cookies.user_id))
  res.render("urls_index", templateVars);
});

// this end point is for checking the content of usersDb
// remove when cleaning up the code
app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/db', (req, res) => {
  res.json(urlDatabase);
});


// Show the create new URL
app.get("/urls/new", (req, res) => {
  const templateVars = { user: findUserByID(req.cookies.user_id) }
  res.render("urls_new", templateVars);
});

// Show the short URL associated to the long URL & edit URL
app.get("/urls/:shortURL", (req, res) => {
  // Use the shortURL from the route parameter to lookup it's associated longURL from the urlDatabase
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: findUserByID(req.cookies.user_id) };
  // console.log("urls/:shortURL - templateVars: ", templateVars);
  // console.log(urlDatabase);
  // console.log();
  // console.log(req.params.shortURL);
  // console.log();
  // console.log(urlDatabase[req.params.shortURL]);
  res.render("urls_show", templateVars);
});

// Redirect to the long URL associated to the short URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

// Show registration page
app.get("/register", (req, res) => {
  const templateVars = { user: findUserByID(req.cookies.user_id) };
  res.render("users_register", templateVars);
})

// Show login
app.get("/login", (req, res) => {
  const user = users[req.cookies.user_id]
  const templateVars = { user: findUserByID(req.cookies.user_id) };
  res.render("users_login", templateVars);
})

// create a URL
app.post("/urls", (req, res) => {
  const shortURL = generateNewKey();
  const longURL = req.body.longURL;
  // add generated short URL and long URL to database
  console.log(req.cookies.user_id)
  urlDatabase[shortURL] = { 
    longURL: longURL,
    shortURL: shortURL,
    id: req.cookies.user_id
  };
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
  urlDatabase[shortURL] = { 
    longURL: longURL,
    shortURL: shortURL,
    id: req.cookies.user_id
  };
  res.redirect("/urls");
});

// Create login & Cookies
app.post("/login", (req, res) => {
  // receive email and password from user login
  const user = authenticateUser(req.body.email, req.body.password);
  const email = findUserByEmail(req.body.email);
  // assign user id property from user object to the cookie
  if (user) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    if (!email) {
      res.status(403).send("Cannot find your account!");
    } else {
      res.status(403).send("Wrong email address or password!");
    }    
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

<<<<<<< HEAD
=======
const addNewUser = (email, password) => {
  const newUserID = generateNewKey();

  const newUserObj = {
    id: newUserID,
    email,
    password
  };

  // Add user Object into the users
  users[newUserID] = newUserObj;
  // Return the id of the user
  return newUserID;
};

// Create new registra
app.post("/register", (req, res) => {
  // receive email and password from user login
  const newEmail = req.body.email;
  const newPwd = req.body.password;
  const user = findUserByEmail(newEmail);
  console.log("user = ", user)
  if (user) {
    res.status(403).send("This account exists in the system!");
  } else {
    const user_id = addNewUser(newEmail, newPwd);
    console.log(user_id);
    res.cookie("user_id", user_id);
    res.redirect("/urls");
  }
});

>>>>>>> feature/user-registration
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});