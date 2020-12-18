const { addNewUser, findUserByID, findUserByEmail, authenticateUser, urlsForUser, generateNewKey } = require('./helpers');

const express = require('express');
const app = express();
const PORT = 3000;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieSession = require('cookie-session');


// Set ejs as the view engine
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));


// The body-parser library will convert the request body from a Buffer into string that we can read and then add the data to the req(request) object under the key body.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


let urlDatabase = {
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', shortURL: 'b2xVn2', id: '1' },
  '9sm5xK': { longURL: 'http://www.google.com', shortURL: '9sm5xK', id: '2' },
  'A1B2cD': { longURL: 'http://www.yahoo.com', shortURL: 'A1B2cD', id: '1' }
};


const users = {
  '1': {
    id: '1',
    email: 'aa@example.com',
    password: bcrypt.hashSync('passwordA', saltRounds)
  },
  '2': {
    id: '2',
    email: 'bb@example.com',
    password: bcrypt.hashSync('passwordB', saltRounds)
  }
};


app.get('/', (req, res) => {
  res.redirect('/urls');
});


// Show the URLs and user_id
app.get('/urls', (req, res) => {
  const id = req.session.user_id;
  let matchedUrlDB = {};
  if (id) {
    matchedUrlDB = urlsForUser(id, urlDatabase);
    const email = users[id].email;
    const templateVars = { urls: matchedUrlDB, user: email };
    res.render('urls_index', templateVars);
  } else {
    const templateVars = { error: 'User is not Authorised. Please Login', user: '' };
    res.render('error', templateVars);
  }
});


// Show the create new URL
app.get('/urls/new', (req, res) => {
  const email = findUserByID(req.session.user_id, users).email;
  const templateVars = { user: email };
  if (!email) {
    res.redirect('/login');
  } else {
    res.render('urls_new', templateVars);
  }
});


// Show the short URL associated to the long URL & edit URL
app.get('/urls/:shortURL', (req, res) => {
  if (req.session.user_id) {
    const email = findUserByID(req.session.user_id, users).email;
    if (urlDatabase[req.params.shortURL]) {
      // Use the shortURL from the route parameter to lookup it's associated longURL from the urlDatabase
      const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: email };
      res.render('urls_show', templateVars);
    } else {
      const templateVars = { error: 'This shortURL does not exist!', user: email }
      res.render('error', templateVars);
    }
  } else {
    const templateVars = { error: 'Please login first to view that url.', user: '' }
    res.render('error', templateVars)
  }
});


// Redirect to the long URL associated to the short URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longURL);
});


// Show registration page
app.get('/register', (req, res) => {
  const email = findUserByID(req.session.user_id, users).email;
  const templateVars = { user: email };
  res.render('users_register', templateVars);
});


// Show login
app.get('/login', (req, res) => {
  const email = findUserByID(req.session.user_id, users).email;
  const templateVars = { user: email };
  res.render('users_login', templateVars);
});


// Create a new URL
app.post('/urls', (req, res) => {
  if (req.session.user_id) {
    const shortURL = generateNewKey();
    const longURL = req.body.longURL;
    // add generated short URL and long URL to database
    urlDatabase[shortURL] = {
      longURL,
      shortURL,
      id: req.session.user_id
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    const templateVars = { error: 'Please login first to add short url.', user: '' }
    res.render('error', templateVars);
  }
});


// Delete URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const id = req.session.user_id;
  if (id) {
    if (urlDatabase[req.params.shortURL].id === id) {
      const shortURL = req.params.shortURL;
      delete urlDatabase[shortURL];
      res.redirect('/urls');
    } else {
      const templateVars = { error: 'You do not own this URL, so you cannot delete the data!', user: users[id].email }
      res.render('error', templateVars);
    }
  } else {
    const templateVars = { error: 'You do not have a permission to delete the data!', user: '' };
    res.render('error', templateVars);
  }
});


// Edit URL
app.post('/urls/:shortURL/edit', (req, res) => {
  const id = req.session.user_id;
  if (id) {
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = {
      longURL: longURL,
      shortURL: shortURL,
      id: req.session.user_id
    };
    res.redirect('/urls');
  } else {
    const templateVars = { error: 'You do not have a permission to edit the data!', user: '' };
    res.render('error', templateVars);
  }
});


// Create login & Cookies
app.post('/login', (req, res) => {
  const user = authenticateUser(req.body.email, req.body.password, users);
  const email = findUserByEmail(req.body.email, users);
  if (user) {
    req.session.user_id = user.id;
    res.redirect('/urls');
  } else {
    if (!email) {
      const templateVars = { error: 'Cannot find your account!', user: '' };
      res.render('error', templateVars);

    } else {
      const templateVars = { error: 'Wrong email address or password!', user: '' };
      res.render('error', templateVars);
    }
  }
});


app.post('/logout', (req, res) => {
  // clear the cookies
  req.session = null;
  res.redirect('/login');
});


// Create new registra
app.post('/register', (req, res) => {
  const newEmail = req.body.email;
  const newPwd = req.body.password;
  const user = findUserByEmail(newEmail, users);
  if (user) {
    const templateVars = { error: 'This account exists in the system!', user: '' };
    res.render('error', templateVars);
  } else {
    const userID = addNewUser(newEmail, newPwd, users);
    req.session.user_id = userID;
    res.redirect('/urls');
  }
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});